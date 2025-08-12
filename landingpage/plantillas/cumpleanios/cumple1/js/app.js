document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper(".heroSwiper", {
    // Navegación
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // Paginación
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // Efecto
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    // Autoplay
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    // Otras opciones
    loop: true,
    speed: 1000,
  });
});