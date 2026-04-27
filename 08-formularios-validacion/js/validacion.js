'use strict';

const REGEX = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefono: /^\d{10}$/ 
};

function validarCampo(campo) {
    const nombreCampo = campo.name;
    let valor = campo.value.trim();
    let error = '';

    if (campo.type === 'checkbox') {
        if (campo.hasAttribute('required') && !campo.checked) {
            error = 'Debes aceptar los términos y condiciones';
        }
    } else {
        if (campo.hasAttribute('required') && !valor) {
            error = 'Este campo es obligatorio';
        }

        if (!error && valor) {
            switch (nombreCampo) {
                case 'nombre':
                    if (valor.length < 3) error = 'Mínimo 3 caracteres';
                    else if (!REGEX.nombre.test(valor)) error = 'Solo se permiten letras y espacios';
                    break;
                case 'email':
                    if (!REGEX.email.test(valor)) error = 'Formato de email inválido';
                    break;
                case 'telefono':
                    if (!REGEX.telefono.test(valor)) error = 'Debe tener exactamente 10 dígitos numéricos';
                    break;
                case 'fecha_nacimiento':
                    const fechaNacimiento = new Date(valor);
                    const hoy = new Date();
                    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
                    const m = hoy.getMonth() - fechaNacimiento.getMonth();
                    if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                        edad--;
                    }
                    if (edad < 18) error = 'Debes ser mayor de 18 años';
                    if (edad > 120) error = 'Fecha de nacimiento inválida';
                    break;
                case 'password':
                    if (valor.length < 8) error = 'Mínimo 8 caracteres';
                    else if (!/[A-Z]/.test(valor)) error = 'Debe tener al menos una letra mayúscula';
                    else if (!/[a-z]/.test(valor)) error = 'Debe tener al menos una letra minúscula';
                    else if (!/[0-9]/.test(valor)) error = 'Debe tener al menos un número';
                    break;
                case 'confirmar_password':
                    const passwordValue = document.querySelector('#password').value;
                    if (valor !== passwordValue) error = 'Las contraseñas no coinciden';
                    break;
            }
        }
    }

    // Aplica el feedback visual correcto
    if (error) {
        mostrarError(campo, error);
        return false;
    } else {
        marcarValido(campo); // Solo pone el borde verde si TODO está perfecto
        return true;
    }
}

function mostrarError(campo, mensaje) {
    campo.classList.add('campo--error');
    campo.classList.remove('campo--valido');

    let errorDiv = campo.parentElement.querySelector('.error-mensaje');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-mensaje';
        campo.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = mensaje;
}

function marcarValido(campo) {
    campo.classList.remove('campo--error');
    campo.classList.add('campo--valido');

    let errorDiv = campo.parentElement.querySelector('.error-mensaje');
    if (errorDiv) {
        errorDiv.textContent = '';
    }
}

// Nueva función: Limpia los colores para dejarlo gris/neutro mientras escribes
function limpiarEstilos(campo) {
    campo.classList.remove('campo--error');
    campo.classList.remove('campo--valido');
    
    let errorDiv = campo.parentElement.querySelector('.error-mensaje');
    if (errorDiv) {
        errorDiv.textContent = '';
    }
}

function evaluarFuerzaPassword(password) {
    let fuerza = 0;
    if (password.length >= 8) fuerza++;
    if (password.length >= 12) fuerza++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza++;
    if (/\d/.test(password)) fuerza++;
    if (/[^a-zA-Z0-9]/.test(password)) fuerza++;

    const niveles = ['Ninguna', 'Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    const colores = ['#777', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];

    fuerza = Math.min(fuerza, 5);
    return { nivel: niveles[fuerza], color: colores[fuerza], valor: fuerza };
}