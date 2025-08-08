// Animaciones de entrada
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Swiper
    const swiper = new Swiper('.gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    // Cuenta regresiva - CONFIGURACIÓN PRINCIPAL
    // ⚠️ IMPORTANTE: Cambia esta fecha por la fecha real de la boda
    // Formato: 'YYYY-MM-DDTHH:MM:SS' (Año-Mes-Día T Hora:Minuto:Segundo)
    const weddingDate = new Date('2025-09-07T16:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            // Si la fecha ya pasó, mostrar mensaje especial
            document.getElementById('countdown-hero').innerHTML = 
                '<div class="countdown-item-hero"><span class="countdown-number-hero">¡Ya llegó!</span><span class="countdown-label-hero">El gran día</span></div>';
            return;
        }
        
        // Calcular tiempo restante
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Actualizar elementos del hero
        document.getElementById('days-hero').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours-hero').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes-hero').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds-hero').textContent = seconds.toString().padStart(2, '0');
    }

    // Inicializar contador
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Scroll suave para el indicador
    document.querySelector('.scroll-indicator').addEventListener('click', function() {
        document.querySelector('.welcome-section').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    document.querySelectorAll('.detail-card, .welcome-content, .countdown-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Nueva función de animaciones mejorada
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.detail-card, .location-item, .welcome-content');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }

    // Aplicar clase de animación inicial
    document.querySelectorAll('.detail-card, .welcome-content, .location-item').forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    window.addEventListener('scroll', handleScrollAnimations);

    // Efecto hover mejorado para las tarjetas
    document.querySelectorAll('.detail-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animación de los números de la cuenta regresiva del hero
    function animateHeroCountdownNumbers() {
        document.querySelectorAll('.countdown-number-hero').forEach(number => {
            number.style.animation = 'none';
            setTimeout(() => {
                number.style.animation = 'pulse 0.5s ease';
            }, 10);
        });
    }

    setInterval(animateHeroCountdownNumbers, 1000);
});

// Preloader simple
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
