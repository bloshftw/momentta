document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('confirmationForm');
    const attendanceSelect = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guestsGroup');
    const guestNamesGroup = document.getElementById('guestNamesGroup');
    const guestsSelect = document.getElementById('guests');
    const successMessage = document.getElementById('successMessage');
    const adminSection = document.getElementById('adminSection');

    // Mostrar/ocultar campos según la asistencia
    attendanceSelect.addEventListener('change', function() {
        if (this.value === 'si') {
            guestsGroup.style.display = 'block';
        } else {
            guestsGroup.style.display = 'none';
            guestNamesGroup.style.display = 'none';
            guestsSelect.value = '0';
        }
    });

    // Mostrar/ocultar nombres de acompañantes
    guestsSelect.addEventListener('change', function() {
        if (parseInt(this.value) > 0) {
            guestNamesGroup.style.display = 'block';
        } else {
            guestNamesGroup.style.display = 'none';
        }
    });

    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Recopilar datos del formulario
        const formData = new FormData(form);
        const data = {
            fecha: new Date().toLocaleDateString('es-ES'),
            nombre: formData.get('name'),
            email: formData.get('email'),
            telefono: formData.get('phone') || 'No proporcionado',
            asistencia: formData.get('attendance') === 'si' ? 'Sí' : 'No',
            acompanantes: formData.get('guests') || '0',
            nombresAcompanantes: formData.get('guestNames') || 'N/A',
            restricciones: formData.get('dietary') || 'Ninguna',
            mensaje: formData.get('message') || 'Sin mensaje'
        };

        // Guardar en localStorage (simulando base de datos)
        saveConfirmation(data);
        
        // Mostrar mensaje de éxito
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Actualizar tabla
        updateTable();
        
        // Scroll al mensaje de éxito
        successMessage.scrollIntoView({ behavior: 'smooth' });
    });

    // Cargar datos existentes al cargar la página
    updateTable();
});

function saveConfirmation(data) {
    let confirmations = JSON.parse(localStorage.getItem('weddingConfirmations')) || [];
    confirmations.push(data);
    localStorage.setItem('weddingConfirmations', JSON.stringify(confirmations));
}

function updateTable() {
    const confirmations = JSON.parse(localStorage.getItem('weddingConfirmations')) || [];
    const tbody = document.querySelector('#confirmationsTable tbody');
    
    tbody.innerHTML = '';
    
    confirmations.forEach((confirmation, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${confirmation.fecha}</td>
            <td>${confirmation.nombre}</td>
            <td>${confirmation.email}</td>
            <td>${confirmation.telefono}</td>
            <td><span class="status-${confirmation.asistencia === 'Sí' ? 'yes' : 'no'}">${confirmation.asistencia}</span></td>
            <td>${confirmation.acompanantes}</td>
            <td>${confirmation.nombresAcompanantes}</td>
            <td>${confirmation.restricciones}</td>
            <td>${confirmation.mensaje}</td>
        `;
    });
    
    // Agregar estilos para el estado
    const style = document.createElement('style');
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

function exportToCSV() {
    const confirmations = JSON.parse(localStorage.getItem('weddingConfirmations')) || [];
    
    if (confirmations.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    const headers = ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Asistencia', 'Acompañantes', 'Nombres Acompañantes', 'Restricciones', 'Mensaje'];
    
    let csvContent = headers.join(',') + '\n';
    
    confirmations.forEach(confirmation => {
        const row = [
            confirmation.fecha,
            `"${confirmation.nombre}"`,
            confirmation.email,
            confirmation.telefono,
            confirmation.asistencia,
            confirmation.acompanantes,
            `"${confirmation.nombresAcompanantes}"`,
            `"${confirmation.restricciones}"`,
            `"${confirmation.mensaje}"`
        ];
        csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'confirmaciones_boda_maria_carlos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearData() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('weddingConfirmations');
        updateTable();
        alert('Datos eliminados correctamente');
    }
}

// Validación en tiempo real
document.getElementById('email').addEventListener('input', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.style.borderColor = '#f44336';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

document.getElementById('phone').addEventListener('input', function() {
    // Formatear número de teléfono
    let value = this.value.replace(/\D/g, '');
    if (value.length >= 10) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    this.value = value;
});

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
