// Initialize Hero Invitation Swiper
const invitationSwiper = new Swiper('.invitation-swiper', {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    speed: 800,
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(139, 92, 246, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
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

// Template links function
function openTemplate(templateId) {
    // Aquí puedes agregar los links reales de tus plantillas
    const templateLinks = {
        'boda-elegante': 'https://tu-link-plantilla-boda.com',
        'cumpleanos-colorido': 'https://tu-link-plantilla-cumpleanos.com',
        'baby-shower': 'https://tu-link-plantilla-babyshower.com',
        'minimalista': 'https://tu-link-plantilla-minimalista.com',
        'floral': 'https://tu-link-plantilla-floral.com',
        'luxury': 'https://tu-link-plantilla-luxury.com'
    };
    
    const link = templateLinks[templateId];
    if (link) {
        window.open(link, '_blank');
    } else {
        // Mientras no tengas los links reales, muestra un mensaje
        alert(`Próximamente: Plantilla ${templateId.replace('-', ' ')}`);
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.benefit-card, .step, .template-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form validation and WhatsApp integration
function sendWhatsAppMessage(message) {
    const phoneNumber = '5492657305625'; // Tu número de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Add loading states for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        this.style.opacity = '0.5';
        console.log('Error loading image:', this.src);
    });
});

// Lazy loading for images (optional enhancement)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add some interactive effects
document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Hero animations on load
window.addEventListener('load', () => {
    const heroText = document.querySelector('.hero-text');
    const phoneFrame = document.querySelector('.phone-frame');
    
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateX(-50px)';
        heroText.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateX(0)';
        }, 300);
    }
    
    if (phoneFrame) {
        phoneFrame.style.opacity = '0';
        phoneFrame.style.transform = 'translateY(50px) scale(0.9)';
        phoneFrame.style.transition = 'all 1s ease';
        
        setTimeout(() => {
            phoneFrame.style.opacity = '1';
            phoneFrame.style.transform = 'translateY(0) scale(1)';
        }, 600);
    }
});

// Console welcome message
console.log(`
🎉 ¡Bienvenido a Momentta! 🎉
Creamos invitaciones digitales únicas para tus momentos especiales.
¿Tienes alguna pregunta? ¡Contáctanos por WhatsApp!
WhatsApp: +54 9 2657 305625
`);
