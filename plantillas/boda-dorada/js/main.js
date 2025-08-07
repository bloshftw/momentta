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

    // Cuenta regresiva
    const weddingDate = new Date('2024-06-15T16:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span class="countdown-number">¡Ya llegó!</span><span class="countdown-label">El gran día</span></div>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '32');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '5');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '22');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '10');
    }
    
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

    // Efecto parallax suave en el hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Animación de los números de la cuenta regresiva
    function animateCountdownNumbers() {
        document.querySelectorAll('.countdown-number').forEach(number => {
            number.style.animation = 'none';
            setTimeout(() => {
                number.style.animation = 'pulse 0.5s ease';
            }, 10);
        });
    }

    setInterval(animateCountdownNumbers, 1000);
});

// Función para mostrar/ocultar elementos basado en scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.detail-card, .location-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-in');
        }
    });
}

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

// Preloader simple
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
