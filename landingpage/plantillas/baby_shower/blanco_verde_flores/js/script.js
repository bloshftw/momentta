// script.js - Baby Shower Invitation
        document.addEventListener('DOMContentLoaded', function() {
            
        // ===== INICIALIZAR SWIPER =====
            const swiper = new Swiper('.swiper-container', {
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
                effect: 'slide',
                speed: 800,
                slidesPerView: 1,
                spaceBetween: 0,
                centeredSlides: true,
                breakpoints: {
                    768: {
                        slidesPerView: 1,
                    },
                    1024: {
                        slidesPerView: 1,
                    }
                }
            });

            // ===== CONTADOR REGRESIVO =====
            // Configurar la fecha del evento aquí (formato: 'YYYY-MM-DDTHH:MM:SS')
            const eventDate = new Date('2025-09-15T15:00:00').getTime();
            
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = eventDate - now;

                if (distance > 0) {
                    // Calcular tiempo restante
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    // Actualizar elementos del DOM
                    const daysElement = document.getElementById('days');
                    const hoursElement = document.getElementById('hours');
                    const minutesElement = document.getElementById('minutes');
                    const secondsElement = document.getElementById('seconds');

                    if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
                    if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
                    if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
                    if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
                } else {
                    // Si el evento ya pasó, mostrar ceros
                    const elements = ['days', 'hours', 'minutes', 'seconds'];
                    elements.forEach(id => {
                        const element = document.getElementById(id);
                        if (element) element.textContent = '00';
                    });
                }
            }

            // Inicializar contador
            updateCountdown(); // Ejecutar inmediatamente
            setInterval(updateCountdown, 1000); // Actualizar cada segundo

            // ===== SCROLL SUAVE (para el indicador de scroll) =====
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.addEventListener('click', function() {
                    const countdownSection = document.querySelector('.countdown-section');
                    if (countdownSection) {
                        countdownSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }


            // ===== ANIMACIONES DE ENTRADA =====
            // Observer para animar elementos cuando entran en vista
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

            // Observar elementos del contador
            const countdownItems = document.querySelectorAll('.countdown-item');
            countdownItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = `all 0.6s ease ${index * 0.1}s`;
                observer.observe(item);
            });

            // Observar tarjetas de evento
            const eventCards = document.querySelectorAll('.event-card');
            eventCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `all 0.6s ease ${index * 0.2}s`;
                observer.observe(card);
            });

            // Observar botones de contacto
            const contactButtons = document.querySelectorAll('.whatsapp-button');
            contactButtons.forEach((button, index) => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(20px)';
                button.style.transition = `all 0.5s ease ${index * 0.1}s`;
                observer.observe(button);
            });

            // Observar tarjetas de información
            const infoCards = document.querySelectorAll('.info-card');
            infoCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `all 0.6s ease ${index * 0.3}s`;
                observer.observe(card);
            });

            // ===== EFECTOS ADICIONALES =====
            
            // Efecto parallax sutil en elementos flotantes
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.floating-leaf, .deco-left, .deco-right');
                
                parallaxElements.forEach((element, index) => {
                    const speed = 0.5 + (index * 0.1);
                    const yPos = -(scrolled * speed);
                    if (element.style.transform) {
                        element.style.transform += ` translateY(${yPos}px)`;
                    } else {
                        element.style.transform = `translateY(${yPos}px)`;
                    }
                });
            });

            // Agregar clase de carga completada
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);
            
        });

        // ===== FUNCIONES UTILITARIAS =====

        // Función para cambiar la fecha del evento dinámicamente
        function setEventDate(dateString) {
            // Uso: setEventDate('2025-12-25T18:00:00')
            eventDate = new Date(dateString).getTime();
            console.log('Fecha del evento actualizada:', new Date(eventDate));
        }

        // Función para obtener información del evento
        function getEventInfo() {
            const now = new Date().getTime();
            const distance = eventDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                
                return {
                    timeLeft: {
                        days: days,
                        hours: hours,
                        minutes: minutes
                    },
                    eventDate: new Date(eventDate),
                    hasStarted: false
                };
            } else {
                return {
                    timeLeft: null,
                    eventDate: new Date(eventDate),
                    hasStarted: true
                };
            }
        }

        // Función para personalizar el mensaje de WhatsApp
        function updateWhatsAppMessage(confirmButton, queryButton, phoneNumber) {
            const confirmMsg = encodeURIComponent("¡Hola! Confirmo mi asistencia al Baby Shower de María y Carlos");
            const queryMsg = encodeURIComponent("Hola, tengo una consulta sobre el Baby Shower");
            
            if (confirmButton) {
                confirmButton.href = `https://wa.me/${phoneNumber}?text=${confirmMsg}`;
            }
            if (queryButton) {
                queryButton.href = `https://wa.me/${phoneNumber}?text=${queryMsg}`;
            }
        }