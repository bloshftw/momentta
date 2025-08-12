 document.addEventListener('DOMContentLoaded', function() {
            // Configuración del botón de WhatsApp
            const whatsappButtons = document.querySelectorAll('#whatsappBtn, #whatsappOption');
            whatsappButtons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const phoneNumber = '5492657305625'; // Reemplaza con tu número de WhatsApp (incluyendo código de país sin +)
                    const message = encodeURIComponent('Hola, quisiera obtener más información de las invitaciones digitales');
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                    window.open(whatsappUrl, '_blank');
                });
            });

            // Animación suave al hacer scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Aplicar animaciones a los elementos
            document.querySelectorAll('.contact-info, .contact-form').forEach(function(el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(el);
            });

  document.addEventListener('DOMContentLoaded', function() {
            // Botón de WhatsApp en footer
            document.getElementById('whatsappFooter').addEventListener('click', function(e) {
                e.preventDefault();
                const phoneNumber = '5492657305625';
                const message = encodeURIComponent('Hola, quisiera obtener más información de las invitaciones digitales');
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                window.open(whatsappUrl, '_blank');
            });
        });

        });