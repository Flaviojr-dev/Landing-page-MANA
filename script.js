const hamburger = document.getElementById("hamburger");
const menuMobile = document.getElementById("menu-mobile");

hamburger.addEventListener("click", () => {
    menuMobile.classList.toggle("active");
});


const track = document.querySelector('.carousel-track');
let cards = Array.from(document.querySelectorAll('.card'));
let visibleCards = getVisibleCards();
let currentIndex = visibleCards;

function getVisibleCards() {
    if (window.innerWidth <= 600) return 1;      // Mobile
    if (window.innerWidth <= 1024) return 2;     // Tablet
    return 3;                                    // Desktop
}

function setupCarousel() {
    // Remove clones antigos
    document.querySelectorAll('.card.clone').forEach(clone => clone.remove());

    cards = Array.from(document.querySelectorAll('.card:not(.clone)'));
    visibleCards = getVisibleCards();
    currentIndex = visibleCards;

    // Clonar últimos N para o início
    const clonesStart = cards.slice(-visibleCards).map(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        return clone;
    });

    // Clonar primeiros N para o fim
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

    // Destaque no card central
    cards.forEach(card => card.classList.remove('active'));
    const centerIndex = currentIndex + Math.floor(visibleCards / 2);
    if (cards[centerIndex]) {
        cards[centerIndex].classList.add('active');
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

// Auto play infinito
setInterval(nextSlide, 3000);

// Atualiza no resize
window.addEventListener('resize', setupCarousel);

// Inicialização
setupCarousel();

const carrosel = document.getElementById("carrosel");
const slides = document.querySelectorAll(".googledep");
const pontos = document.querySelectorAll(".ponto");

let index = 1;
const totalSlides = slides.length;

// Clonar primeiro e último
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = "first-clone";
lastClone.id = "last-clone";

carrosel.appendChild(firstClone);
carrosel.insertBefore(lastClone, carrosel.firstChild);

const allSlides = document.querySelectorAll(".googledep");

function getSlideWidth() {
    return document.querySelector(".googledep").offsetWidth + 20; // largura + gap
}

function setPosition() {
    carrosel.style.transform = `translateX(${-getSlideWidth() * index}px)`;
}

// Posição inicial
setPosition();

function atualizarIndicadores() {
    pontos.forEach((p, i) => {
        p.classList.toggle("ativado", i === (index - 1 + totalSlides) % totalSlides);
    });
}

function proximoSlide() {
    if (index >= allSlides.length - 1) return;
    index++;
    carrosel.style.transition = "transform 0.6s ease";
    setPosition();
    atualizarIndicadores();
}

carrosel.addEventListener("transitionend", () => {
    if (allSlides[index].id === "first-clone") {
        carrosel.style.transition = "none"; // sem animação
        index = 1;
        setPosition();
    }
    if (allSlides[index].id === "last-clone") {
        carrosel.style.transition = "none"; // sem animação
        index = totalSlides;
        setPosition();
    }
});

setInterval(proximoSlide, 3000);
atualizarIndicadores();

// Corrige redimensionamento da tela
window.addEventListener("resize", () => {
    carrosel.style.transition = "none";
    setPosition();
});