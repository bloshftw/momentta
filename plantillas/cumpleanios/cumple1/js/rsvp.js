// Configuración y constantes
const CONFIG = {
    ADMIN_PASSWORD: 'admin123', // Cambia esta contraseña
    STORAGE_KEY: 'rsvp_guests'
};

// Elementos del DOM
const elements = {
    invitationSection: document.getElementById('invitation-section'),
    rsvpFormSection: document.getElementById('rsvp-form-section'),
    rsvpBtn: document.getElementById('rsvp-btn'),
    backBtn: document.getElementById('back-btn'),
    rsvpForm: document.getElementById('rsvp-form'),
    companionsGroup: document.getElementById('companions-group'),
    adminToggleBtn: document.getElementById('admin-toggle-btn'),
    adminLogin: document.getElementById('admin-login'),
    adminPassword: document.getElementById('admin-password'),
    adminLoginBtn: document.getElementById('admin-login-btn'),
    adminPanel: document.getElementById('admin-panel'),
    adminLogout: document.getElementById('admin-logout'),
    successModal: document.getElementById('success-modal'),
    closeModal: document.getElementById('close-modal'),
    successMessage: document.getElementById('success-message'),
    guestsTableBody: document.getElementById('guests-table-body'),
    confirmedCount: document.getElementById('confirmed-count'),
    declinedCount: document.getElementById('declined-count'),
    totalCount: document.getElementById('total-count')
};

// Estado de la aplicación
let isAdminLoggedIn = false;

// Utilidades para localStorage
const storage = {
    get: () => {
        try {
            return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];
        } catch (error) {
            console.error('Error al leer datos del localStorage:', error);
            return [];
        }
    },
    
    set: (data) => {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error al guardar datos en localStorage:', error);
        }
    }
};

// Funciones de navegación
function showRSVPForm() {
    elements.invitationSection.classList.add('hidden');
    elements.rsvpFormSection.classList.remove('hidden');
    elements.rsvpFormSection.classList.add('fade-in');
    
    // Reset form
    elements.rsvpForm.reset();
    hideAdminSections();
}

function showInvitation() {
    elements.rsvpFormSection.classList.add('hidden');
    elements.invitationSection.classList.remove('hidden');
    elements.invitationSection.classList.add('fade-in');
}

function hideAdminSections() {
    elements.adminLogin.classList.add('hidden');
    elements.adminPanel.classList.add('hidden');
    elements.adminPassword.value = '';
    isAdminLoggedIn = false;
}

// Funciones del formulario RSVP
function handleRSVPSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(elements.rsvpForm);
    const guestData = {
        id: Date.now(), // ID único basado en timestamp
        fullName: formData.get('fullName').trim(),
        phone: formData.get('phone').trim(),
        companions: parseInt(formData.get('companions')),
        attendance: formData.get('attendance'),
        date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Validar datos
    if (!guestData.fullName || !guestData.phone || !guestData.attendance) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }
    
    // Validar teléfono (formato básico)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    if (!phoneRegex.test(guestData.phone)) {
        alert('Por favor ingresa un número de teléfono válido.');
        return;
    }
    
    // Guardar datos
    const guests = storage.get();
    
    // Verificar si ya existe una respuesta con el mismo nombre y teléfono
    const existingGuest = guests.find(guest => 
        guest.fullName.toLowerCase() === guestData.fullName.toLowerCase() && 
        guest.phone === guestData.phone
    );
    
    if (existingGuest) {
        const confirmUpdate = confirm('Ya existe una confirmación con estos datos. ¿Deseas actualizarla?');
        if (confirmUpdate) {
            // Actualizar datos existentes
            const index = guests.findIndex(guest => guest.id === existingGuest.id);
            guests[index] = { ...guestData, id: existingGuest.id };
        } else {
            return;
        }
    } else {
        // Agregar nuevo invitado
        guests.push(guestData);
    }
    
    storage.set(guests);
    
    // Mostrar mensaje de confirmación
    showSuccessMessage(guestData);
    
    // Reset form
    elements.rsvpForm.reset();
}

function showSuccessMessage(guestData) {
    const attendanceText = guestData.attendance === 'yes' ? 'confirmaste tu asistencia' : 'Lamentamos que no puedas asistir, gracias por avisar';
    const companionsText = guestData.companions > 0 ? ` con ${guestData.companions} acompañante${guestData.companions > 1 ? 's' : ''}` : '';
    
    if (guestData.attendance === 'yes') {
        elements.successMessage.textContent = `¡Gracias ${guestData.fullName}! Has ${attendanceText}${companionsText}. Te esperamos pronto.`;
    } else {
        elements.successMessage.textContent = `¡Gracias ${guestData.fullName}! ${attendanceText}.`;
    }
    elements.successModal.classList.remove('hidden');
}

// Funciones de administración
function toggleAdminLogin() {
    elements.adminLogin.classList.toggle('hidden');
    elements.adminPassword.focus();
}

function attemptAdminLogin() {
    const password = elements.adminPassword.value;
    
    if (password === CONFIG.ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        elements.adminLogin.classList.add('hidden');
        elements.adminPanel.classList.remove('hidden');
        updateAdminPanel();
    } else {
        alert('Contraseña incorrecta.');
        elements.adminPassword.value = '';
    }
}

function adminLogout() {
    hideAdminSections();
}

function updateAdminPanel() {
    const guests = storage.get();
    
    // Actualizar estadísticas
    const confirmed = guests.filter(guest => guest.attendance === 'yes');
    const declined = guests.filter(guest => guest.attendance === 'no');
    
    elements.confirmedCount.textContent = confirmed.length;
    elements.declinedCount.textContent = declined.length;
    elements.totalCount.textContent = guests.length;
    
    // Actualizar tabla
    updateGuestsTable(guests);
}

function updateGuestsTable(guests) {
    elements.guestsTableBody.innerHTML = '';
    
    if (guests.length === 0) {
        elements.guestsTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #9ca3af; font-style: italic;">
                    No hay confirmaciones aún
                </td>
            </tr>
        `;
        return;
    }
    
    // Ordenar por fecha (más recientes primero)
    guests.sort((a, b) => b.id - a.id);
    
    guests.forEach(guest => {
        const row = document.createElement('tr');
        
        const attendanceClass = guest.attendance === 'yes' ? 'attendance-yes' : 'attendance-no';
        const attendanceText = guest.attendance === 'yes' ? 'Sí' : 'No';
        const companionsText = guest.companions > 0 ? guest.companions : '0';
        
        row.innerHTML = `
            <td><strong>${escapeHtml(guest.fullName)}</strong></td>
            <td>${escapeHtml(guest.phone)}</td>
            <td>${companionsText}</td>
            <td><span class="${attendanceClass}">${attendanceText}</span></td>
            <td>${guest.date}</td>
        `;
        
        elements.guestsTableBody.appendChild(row);
    });
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para mostrar/ocultar campo de acompañantes
function toggleCompanionsField() {
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const companionsGroup = elements.companionsGroup;
    
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                companionsGroup.style.display = 'block';
                companionsGroup.classList.add('show');
            } else {
                companionsGroup.style.display = 'none';
                companionsGroup.classList.remove('show');
                // Reset companions value when hiding
                document.getElementById('companions').value = '0';
            }
        });
    });
}

// Event Listeners
function initEventListeners() {
    // Navegación
    elements.rsvpBtn.addEventListener('click', showRSVPForm);
    elements.backBtn.addEventListener('click', showInvitation);
    
    // Formulario RSVP
    elements.rsvpForm.addEventListener('submit', handleRSVPSubmit);
    
    // Toggle campo de acompañantes
    toggleCompanionsField();
    
    // Administración
    elements.adminToggleBtn.addEventListener('click', toggleAdminLogin);
    elements.adminLoginBtn.addEventListener('click', attemptAdminLogin);
    elements.adminLogout.addEventListener('click', adminLogout);
    
    // Modal
    elements.closeModal.addEventListener('click', () => {
        elements.successModal.classList.add('hidden');
    });
    
    // Cerrar modal al hacer click fuera de él
    elements.successModal.addEventListener('click', (e) => {
        if (e.target === elements.successModal) {
            elements.successModal.classList.add('hidden');
        }
    });
    
    // Enter en password de admin
    elements.adminPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            attemptAdminLogin();
        }
    });
    
    // Escape para cerrar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            elements.successModal.classList.add('hidden');
        }
    });
}

// Función de inicialización
function init() {
    // Verificar que todos los elementos existen
    const missingElements = Object.entries(elements).filter(([key, element]) => !element);
    if (missingElements.length > 0) {
        console.error('Elementos faltantes en el DOM:', missingElements.map(([key]) => key));
        return;
    }
    
    // Inicializar event listeners
    initEventListeners();
    
    // Mostrar sección inicial
    showInvitation();
    
    console.log('Módulo RSVP inicializado correctamente');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// API pública para integración con otras partes del sistema
window.RSVPModule = {
    getGuests: storage.get,
    clearAllData: () => {
        if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
            storage.set([]);
            if (isAdminLoggedIn) {
                updateAdminPanel();
            }
        }
    },
    exportData: () => {
        const guests = storage.get();
        const dataStr = JSON.stringify(guests, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invitados_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
};