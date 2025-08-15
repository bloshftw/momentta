// Initialize animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Initialize Swiper for Hero Carousel
// Hero background animation is now handled by CSS
// No need for Swiper initialization for hero section

// Initialize Swiper for Photo Gallery
const gallerySwiper = new Swiper('.gallery-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    centeredSlides: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    effect: 'coverflow',
    coverflowEffect: {
        rotate: 20,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 30,
            effect: 'slide',
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 30,
            effect: 'slide',
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 40,
            effect: 'slide',
        },
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add floating animation to cards on hover
const cards = document.querySelectorAll('.detail-item, .gift-category, .gallery-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add parallax effect to hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    const floatingElements = document.querySelectorAll('.floating-element');
    
    if (heroBackground) {
        const speed = scrolled * 0.3;
        heroBackground.style.transform = `translateY(${speed}px)`;
    }
    
    floatingElements.forEach((element, index) => {
        const speed = scrolled * (0.1 + index * 0.05);
        element.style.transform = `translateY(${speed}px)`;
    });
});

// Add entrance animations for elements as they come into view
const animateElements = document.querySelectorAll(
    '.animate-fade-in, .animate-slide-up, .animate-fade-in-up, ' +
    '.animate-fade-in-delay-1, .animate-fade-in-delay-2, .animate-fade-in-delay-3, ' +
    '.animate-slide-up-delay-1, .animate-slide-up-delay-2, .animate-slide-up-delay-3'
);

animateElements.forEach(element => {
    observer.observe(element);
});

// Add stagger animation to gift categories
const giftCategories = document.querySelectorAll('.gift-category');
giftCategories.forEach((category, index) => {
    category.style.animationDelay = `${index * 0.2}s`;
    observer.observe(category);
});

// Add particle effect on click (optional enhancement)
document.addEventListener('click', function(e) {
    createParticle(e.clientX, e.clientY);
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        left: ${x - 5}px;
        top: ${y - 5}px;
        width: 10px;
        height: 10px;
        background: linear-gradient(45deg, #F8BBD9, #E6E6FA);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: particleFloat 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 1000);
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.3);
        }
    }
`;
document.head.appendChild(style);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Stagger hero text animations
    const heroTexts = document.querySelectorAll('.hero-text > *');
    heroTexts.forEach((text, index) => {
        setTimeout(() => {
            text.style.opacity = '1';
            text.style.transform = 'translateY(0)';
        }, index * 300);
    });
});

// Initialize hero text elements for entrance animation
document.querySelectorAll('.hero-text > *').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';
});

// Add CSS class for loaded state
const loadedStyle = document.createElement('style');
loadedStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #FFF8DC, #FFE4E1);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '💕';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        animation: pulse 1.5s infinite;
        z-index: 10001;
    }
    
    @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
    }
`;
document.head.appendChild(loadedStyle);