// 1. VALIDACIÓN DE FORMULARIO CON preventDefault()
const formulario = document.getElementById('miFormulario');
const mensaje = document.getElementById('mensajeFormulario');

formulario.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;

    if (nombre === '' || email === '') {
        mensaje.textContent = 'Error: La validación falló. Campos vacíos.';
        mensaje.style.color = 'red';
    } else {
        mensaje.textContent = '¡Formulario procesado correctamente!';
        mensaje.style.color = 'green';
        formulario.reset();
    }
});

// 2. GESTOR DE TAREAS Y EVENT DELEGATION
const inputTarea = document.getElementById('inputTarea');
const btnAgregar = document.getElementById('btnAgregar');
const listaTareas = document.getElementById('listaTareas');
const contadorTareas = document.getElementById('contadorTareas');
let totalTareas = 0;

function actualizarContador() {
    contadorTareas.textContent = totalTareas;
}

function agregarNuevaTarea() {
    const texto = inputTarea.value.trim();
    if (texto !== '') {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="texto-tarea">${texto}</span>
            <button class="btn-completar">Completar</button>
            <button class="btn-eliminar">Eliminar</button>
        `;
        listaTareas.appendChild(li);
        inputTarea.value = '';
        totalTareas++;
        actualizarContador();
    }
}

btnAgregar.addEventListener('click', agregarNuevaTarea);

// Atajo de teclado: Agregar tarea con Enter o Ctrl+Enter
inputTarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || (e.ctrlKey && e.key === 'Enter')) {
        agregarNuevaTarea();
    }
});

// Event Delegation para los botones que se crean dinámicamente
listaTareas.addEventListener('click', function(e) {
    // Si hace clic en eliminar
    if (e.target.classList.contains('btn-eliminar')) {
        e.target.parentElement.remove();
        totalTareas--;
        actualizarContador();
    }
    // Si hace clic en completar
    else if (e.target.classList.contains('btn-completar')) {
        const spanTexto = e.target.parentElement.querySelector('.texto-tarea');
        spanTexto.classList.add('completada');
    }
});