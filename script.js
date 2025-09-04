const hamburger = document.getElementById("hamburger");
const menuMobile = document.getElementById("menu-mobile");

hamburger.addEventListener("click", () => {
    menuMobile.classList.toggle("active");
});


// ...existing code...

const track = document.querySelector('.carousel-track');
let cards = Array.from(document.querySelectorAll('.card'));
const dots = Array.from(document.querySelectorAll('.dot'));

// ...existing code...
// ...existing code...

let visibleCards = getVisibleCards();
let currentIndex = visibleCards;

function getVisibleCards() {
    if (window.innerWidth <= 600) return 1;      // Mobile
    if (window.innerWidth <= 900) return 2;      // Tablet
    return 3;                                    // Desktop
}

function setupCarousel() {
    // Remove clones se existirem
    document.querySelectorAll('.card.clone').forEach(clone => clone.remove());

    cards = Array.from(document.querySelectorAll('.card:not(.clone)'));
    visibleCards = getVisibleCards();
    currentIndex = visibleCards;

    // Clonar primeiros e últimos N cards
    const clonesStart = cards.slice(-visibleCards).map(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        return clone;
    });
    const clonesEnd = cards.slice(0, visibleCards).map(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        return clone;
    });

    clonesStart.forEach(clone => track.prepend(clone));
    clonesEnd.forEach(clone => track.append(clone));

    cards = Array.from(document.querySelectorAll('.card'));
    updateCarousel(false);
}

function updateCarousel(animate = true) {
    const offset = -(currentIndex * (100 / visibleCards));
    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `translateX(${offset}%)`;

    // Ativar destaque no card central
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

function nextSlide() {
    currentIndex++;
    updateCarousel();

    if (currentIndex >= cards.length - visibleCards) {
        setTimeout(() => {
            currentIndex = visibleCards;
            updateCarousel(false);
        }, 600);
    }
}

function prevSlide() {
    currentIndex--;
    updateCarousel();

    if (currentIndex < visibleCards) {
        setTimeout(() => {
            currentIndex = cards.length - visibleCards * 2;
            updateCarousel(false);
        }, 600);
    }
}

// Auto play
setInterval(nextSlide, 3000);

// Responsividade ao redimensionar
window.addEventListener('resize', setupCarousel);

// Inicialização
setupCarousel();

// ...existing code...