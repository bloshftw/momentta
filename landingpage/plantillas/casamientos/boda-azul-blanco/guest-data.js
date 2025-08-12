// Base de datos de invitados y sus grupos familiares
const guestDatabase = {
    "walter-perez-y-sandra": {
        name: "Walter Pérez",
        familyMembers: [
            "Walter Pérez",
            "Sandra"
        ],
        maxGuests: 2,
        ticketType: "family",
        whatsappContact: {
            name: "María (Organizadora)",
            phone: "5492657557205"
        }
    },
    "fabiola-amaya": {
        name: "Fabiola Amaya",
        familyMembers: [
            "Fabiola Amaya",
            "Walter",
            "Santiago",
            "Olga"
        ],
        maxGuests: 4,
        ticketType: "family",
        whatsappContact: {
            name: "María (Organizadora)",
            phone: "5492657557205"
        }
    },
    "juan-luna-y-elsa": {
        name: "Juan Luna",
        familyMembers: [
            "Juan Luna",
            "Elsa"
        ],
        maxGuests: 2,
        ticketType: "family",
        whatsappContact: {
            name: "María (Organizadora)",
            phone: "5492657557205"
        }
    },
    "cristian-barroso": {
        name: "Cristian Barroso",
        familyMembers: [
            "Cristian Barroso",
            "Justina",
            "Belén"
        ],
        maxGuests: 3,
        ticketType: "family",
        whatsappContact: {
            name: "María (Organizadora)",
            phone: "5492657557205"
        }
    }
};
    

// Función para obtener datos del invitado
function getGuestData(guestId) {
    return guestDatabase[guestId] || null;
}

// Función para obtener lista de todos los invitados principales
function getAllGuests() {
    return Object.keys(guestDatabase).map(id => ({
        id: id,
        name: guestDatabase[id].name
    }));
}

// Función para generar URL de WhatsApp
function generateWhatsAppURL(guestData, message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${guestData.whatsappContact.phone}?text=${encodedMessage}`;
}