document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('confirmationForm');
    const attendanceSelect = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guestsGroup');
    const guestNamesGroup = document.getElementById('guestNamesGroup'); // Este elemento no existe en tu HTML
    const guestsSelect = document.getElementById('guests');
    const successMessage = document.getElementById('successMessage');
    const adminSection = document.getElementById('adminSection');

    // Configuración de administrador - MOVER ARRIBA para que esté disponible globalmente
    const ADMIN_PASSWORD = "21524"; // ⚠️ Cambia esta contraseña
    let isAdminLoggedIn = false;

    // Mostrar/ocultar campos según la asistencia
    if (attendanceSelect) {
        attendanceSelect.addEventListener('change', function() {
            if (this.value === 'si') {
                if (guestsGroup) {
                    guestsGroup.style.display = 'block';
                }
            } else {
                if (guestsGroup) {
                    guestsGroup.style.display = 'none';
                }
                // Solo ocultar guestNamesGroup si existe
                if (guestNamesGroup) {
                    guestNamesGroup.style.display = 'none';
                }
                if (guestsSelect) {
                    guestsSelect.value = '0';
                }
            }
        });
    }

    // Funciones de administrador
    function toggleAdminAccess() {
        const adminLogin = document.getElementById('adminLogin');
        if (adminLogin) {
            adminLogin.style.display = 'flex';
        }
    }

    function checkAdminPassword() {
        const passwordInput = document.getElementById('adminPassword');
        const password = passwordInput ? passwordInput.value : '';
        
        if (password === ADMIN_PASSWORD) {
            isAdminLoggedIn = true;
            const adminLogin = document.getElementById('adminLogin');
            const adminSection = document.getElementById('adminSection');
            const adminBtn = document.getElementById('adminBtn');
            
            if (adminLogin) adminLogin.style.display = 'none';
            if (adminSection) adminSection.style.display = 'block';
            if (adminBtn) adminBtn.innerHTML = '<i class="fas fa-unlock"></i> Panel Administrador';
            if (passwordInput) passwordInput.value = '';
            
            // Actualizar tabla una vez que el admin está logueado
            updateTable();
            
            // Scroll al panel de administración
            if (adminSection) {
                adminSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            alert('Contraseña incorrecta');
            if (passwordInput) passwordInput.value = '';
        }
    }

    function cancelAdminLogin() {
        const adminLogin = document.getElementById('adminLogin');
        const passwordInput = document.getElementById('adminPassword');
        
        if (adminLogin) adminLogin.style.display = 'none';
        if (passwordInput) passwordInput.value = '';
    }

    // Hacer las funciones disponibles globalmente
    window.toggleAdminAccess = toggleAdminAccess;
    window.checkAdminPassword = checkAdminPassword;
    window.cancelAdminLogin = cancelAdminLogin;

    // Manejar envío del formulario
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Recopilar datos del formulario
            const formData = new FormData(form);
            const data = {
                fecha: new Date().toLocaleDateString('es-ES'),
                nombre: formData.get('name'),
                telefono: formData.get('phone') || 'No proporcionado',
                asistencia: formData.get('attendance') === 'si' ? 'Sí' : 'No',
                acompanantes: formData.get('guests') || '0',
                restricciones: formData.get('dietary') || 'Ninguna',
                mensaje: formData.get('message') || 'Sin mensaje'
            };

            // Guardar en localStorage
            saveConfirmation(data);
            
            // Mostrar mensaje de éxito
            form.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Solo actualizar tabla si el admin está logueado
            if (isAdminLoggedIn) {
                updateTable();
            }
        });
    }

    // Función para actualizar tabla
    function updateTable() {
        if (!isAdminLoggedIn) return;
        
        const confirmations = JSON.parse(localStorage.getItem('weddingConfirmations')) || [];
        const tbody = document.querySelector('#confirmationsTable tbody');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        confirmations.forEach((confirmation, index) => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${confirmation.fecha}</td>
                <td>${confirmation.nombre}</td>
                <td>${confirmation.telefono}</td>
                <td><span class="status-${confirmation.asistencia === 'Sí' ? 'yes' : 'no'}">${confirmation.asistencia}</span></td>
                <td>${confirmation.acompanantes}</td>
                <td>${confirmation.restricciones}</td>
                <td>${confirmation.mensaje}</td>
            `;
        });
        
        // Agregar estilos para el estado (solo una vez)
        if (!document.getElementById('status-styles')) {
            const style = document.createElement('style');
            style.id = 'status-styles';
            style.textContent = `
                .status-yes {
                    background: #4CAF50;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                }
                .status-no {
                    background: #f44336;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Hacer updateTable disponible globalmente para las otras funciones
    window.updateTable = updateTable;

    // Cargar datos existentes al cargar la página (solo si admin está logueado)
    // updateTable(); // Comentado porque isAdminLoggedIn es false por defecto
});

// Función corregida para guardar confirmación
function saveConfirmation(data) {
    let confirmations = JSON.parse(localStorage.getItem('weddingConfirmations')) || [];
    confirmations.push(data); // Usar directamente el objeto data
    localStorage.setItem('weddingConfirmations', JSON.stringify(confirmations));
}

// Funciones de administrador corregidas
function exportToCSV() {
    // Verificar si las variables están definidas
    if (typeof isAdminLoggedIn === 'undefined' || !window.isAdminLoggedIn) {
        alert('Acceso denegado. Inicia sesión como administrador.');
        return;
    }
    
    const confirmations = JSON.parse(localStorage.getItem('weddingConfirmations')) || [];
    
    if (confirmations.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    const headers = ['Fecha', 'Nombre', 'Teléfono', 'Asistencia', 'Acompañantes', 'Restricciones', 'Mensaje'];
    let csvContent = headers.join(',') + '\n';
    
    confirmations.forEach(confirmation => {
        const row = [
            confirmation.fecha,
            `"${confirmation.nombre}"`,
            `"${confirmation.telefono}"`,
            confirmation.asistencia,
            confirmation.acompanantes,
            `"${confirmation.restricciones}"`,
            `"${confirmation.mensaje}"`
        ];
        csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'confirmaciones_boda.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearData() {
    if (typeof isAdminLoggedIn === 'undefined' || !window.isAdminLoggedIn) {
        alert('Acceso denegado. Inicia sesión como administrador.');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('weddingConfirmations');
        if (window.updateTable) {
            window.updateTable();
        }
        alert('Datos eliminados correctamente');
    }
}

// Validación en tiempo real - con verificación de elementos
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Formatear número de teléfono
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
            this.value = value;
        });
    }

    // Animaciones para el formulario
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });



    
});