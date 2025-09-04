const hamburger = document.getElementById("hamburger");
const menuMobile = document.getElementById("menu-mobile");

hamburger.addEventListener("click", () => {
    menuMobile.classList.toggle("active");
});
const track = document.querySelector('.carousel-track');
let cards = Array.from(document.querySelectorAll('.card'));
const dots = Array.from(document.querySelectorAll('.dot'));

let visibleCards = getVisibleCards(); // dinâmico
let currentIndex = visibleCards;

// 1. Função que define quantos cards aparecem por vez
function getVisibleCards() {
    if (window.innerWidth <= 600) return 1;   // mobile
    if (window.innerWidth <= 991) return 2;   // tablet
    return 3;                                 // desktop
}

// 2. Clonar primeiros e últimos N cards
function cloneSlides() {
    const clonesStart = cards.slice(-visibleCards).map(card => card.cloneNode(true));
    const clonesEnd = cards.slice(0, visibleCards).map(card => card.cloneNode(true));

    clonesStart.forEach(clone => track.prepend(clone));
    clonesEnd.forEach(clone => track.append(clone));

    // Atualiza lista
    cards = Array.from(document.querySelectorAll('.card'));
}

cloneSlides();
const totalSlides = cards.length;

// 3. Atualiza posição do carrossel
function updateCarousel(animate = true) {
    const offset = -(currentIndex * (100 / visibleCards));
    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `translateX(${offset}%)`;

    // Destaque central
    cards.forEach(card => card.classList.remove('active'));
    const centerIndex = currentIndex + Math.floor(visibleCards / 2);
    if (cards[centerIndex]) {
        cards[centerIndex].classList.add('active');
    }

    // Atualizar dots
    dots.forEach(dot => dot.classList.remove('active'));
    const dotIndex = (currentIndex - visibleCards + dots.length) % dots.length;
    if (dots[dotIndex]) {
        dots[dotIndex].classList.add('active');
    }
}

// 4. Avançar
function nextSlide() {
    currentIndex++;
    updateCarousel();

    if (currentIndex >= totalSlides - visibleCards) {
        setTimeout(() => {
            currentIndex = visibleCards;
            updateCarousel(false);
        }, 600);
    }
}

// 5. Voltar
function prevSlide() {
    currentIndex--;
    updateCarousel();

    if (currentIndex < visibleCards) {
        setTimeout(() => {
            currentIndex = totalSlides - visibleCards * 2;
            updateCarousel(false);
        }, 600);
    }
}

// 6. Auto play
let autoPlay = setInterval(nextSlide, 3000);

// 7. Recalcular ao mudar tela
window.addEventListener("resize", () => {
    clearInterval(autoPlay);

    // Resetar clones e recalcular
    track.innerHTML = "";
    cards = Array.from(document.querySelectorAll('.card'));
    visibleCards = getVisibleCards();
    currentIndex = visibleCards;

    cards.forEach(card => track.appendChild(card));
    cloneSlides();
    updateCarousel(false);

    autoPlay = setInterval(nextSlide, 3000);
});

updateCarousel(false);
