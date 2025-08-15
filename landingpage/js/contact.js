document.addEventListener('DOMContentLoaded', function() {
    // WhatsApp message configuration
    const whatsappNumber = '+5492657305625'; // Reemplaza con tu número
    const message = 'Hola! Me interesa saber más sobre las invitaciones digitales.';
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp button configuration
    const whatsappBtn = document.getElementById('whatsappBtn');

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const whatsappUrl = isMobile
                ? `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`
                : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
});