'use strict';

const form = document.querySelector('#form-registro');
const btnEnviar = document.querySelector('#btn-enviar');
const inputPassword = document.querySelector('#password');
const indicadorFuerza = document.querySelector('#password-strength');
const mensajeGlobal = document.querySelector('#mensaje-global');

// 1. EVENTO FOCUSOUT: Valida cuando sales del campo
form.addEventListener('focusout', (e) => {
    if (e.target.matches('input, select')) {
        validarCampo(e.target);
        verificarFormularioCompleto();
    }
});

// 2. EVENTO INPUT: Limpia el error visual mientras escribes (se pone gris)
form.addEventListener('input', (e) => {
    if (e.target.matches('input, select')) {
        limpiarEstilos(e.target); 
        verificarFormularioCompleto(); 
    }
});

// Medidor de contraseña
inputPassword.addEventListener('input', (e) => {
    const fuerza = evaluarFuerzaPassword(e.target.value);
    indicadorFuerza.textContent = `Fuerza: ${fuerza.nivel}`;
    indicadorFuerza.style.color = fuerza.color;
});

function validarFormularioTotal() {
    const campos = form.querySelectorAll('input, select');
    let valido = true;
    campos.forEach(campo => {
        if (!validarCampo(campo)) valido = false;
    });
    return valido;
}

// Funcionalidad Extra: Habilita el botón SOLO si todos los campos tienen borde verde (clase campo--valido)
function verificarFormularioCompleto() {
    const campos = form.querySelectorAll('input, select');
    const todosValidos = Array.from(campos).every(c => {
        if (c.type === 'checkbox') return c.checked;
        return c.classList.contains('campo--valido');
    });
    btnEnviar.disabled = !todosValidos;
}

form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    if (validarFormularioTotal()) {
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData);
        
        datos.terminos = form.querySelector('#terminos').checked;
        delete datos.confirmar_password; 
        
        console.log('✅ Datos válidos listos para enviar:', datos);
        
        mostrarMensajeExito('¡Registro completado exitosamente!');
        
        form.reset();
        
        form.querySelectorAll('.campo--valido').forEach(c => c.classList.remove('campo--valido'));
        indicadorFuerza.textContent = 'Fuerza: Ninguna';
        indicadorFuerza.style.color = '#777';
        btnEnviar.disabled = true;
    }
});

function mostrarMensajeExito(mensaje) {
    mensajeGlobal.textContent = mensaje;
    mensajeGlobal.className = 'mensaje-global mensaje--exito';
    setTimeout(() => {
        mensajeGlobal.className = '';
        mensajeGlobal.textContent = '';
    }, 4000);
}