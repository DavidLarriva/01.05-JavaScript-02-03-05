'use strict';

/* =========================================
   SELECCIÓN DE ELEMENTOS DOM
========================================= */
const formTarea = document.getElementById('form-tarea');
const inputTarea = document.getElementById('input-tarea');
const listaTareas = document.getElementById('lista-tareas');
const mensajeEstado = document.getElementById('mensaje-estado');
const btnLimpiar = document.getElementById('btn-limpiar');
const themeBtns = document.querySelectorAll('[data-theme]');

/* =========================================
   ESTADO GLOBAL
========================================= */
let tareas = []; 

/* =========================================
   FUNCIONES DE RENDERIZADO DOM
========================================= */
function crearElementoTarea(tarea) {
    const li = document.createElement('li');
    li.className = 'task-item fade-in';
    li.dataset.id = tarea.id;

    if (tarea.completada) {
        li.classList.add('task-item--completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-item_checkbox';
    checkbox.checked = tarea.completada;

    const span = document.createElement('span');
    span.className = 'task-item_text';
    span.textContent = tarea.texto; 
    span.title = "Doble clic para editar";

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn--danger btn--small';
    btnEliminar.textContent = 'Eliminar';

    const divAcciones = document.createElement('div');
    divAcciones.className = 'task-item_actions';
    divAcciones.appendChild(btnEliminar);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(divAcciones);

    checkbox.addEventListener('change', () => toggleTarea(tarea.id));
    btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));
    
    // Extra: Evento para editar (Doble clic)
    span.addEventListener('dblclick', () => {
        const nuevoTexto = prompt("Edita tu tarea:", tarea.texto);
        if (nuevoTexto !== null) {
            TareaStorage.editar(tarea.id, nuevoTexto);
            cargarTareas();
        }
    });

    return li;
}

function renderizarTareas() {
    listaTareas.innerHTML = '';

    if (tareas.length === 0) {
        const divVacio = document.createElement('div');
        divVacio.className = 'empty-state';
        const p = document.createElement('p');
        p.textContent = 'No hay tareas. ¡Agrega una para comenzar!';
        divVacio.appendChild(p);
        listaTareas.appendChild(divVacio);
        return;
    }

    tareas.forEach(tarea => {
        const elemento = crearElementoTarea(tarea);
        listaTareas.appendChild(elemento);
    });
}

function mostrarMensaje(texto, tipo = 'success') {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = `mensaje mensaje--${tipo}`;
    mensajeEstado.classList.remove('oculto');
    setTimeout(() => {
        mensajeEstado.classList.add('oculto');
    }, 3000);
}

/* =========================================
   LÓGICA DE TAREAS
========================================= */
function cargarTareas() {
    tareas = TareaStorage.getAll();
    renderizarTareas();
}

function agregarTarea(texto) {
    if (!texto.trim()) {
        mostrarMensaje('El texto no puede estar vacío', 'error');
        return;
    }
    const nueva = TareaStorage.crear(texto);
    tareas = TareaStorage.getAll();
    renderizarTareas();
    mostrarMensaje(`Tarea "${nueva.texto}" agregada`);
}

function toggleTarea(id) {
    TareaStorage.toggleCompletada(id);
    cargarTareas();
}

function eliminarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (!confirm(`¿Eliminar "${tarea.texto}"?`)) return;
    
    TareaStorage.eliminar(id);
    cargarTareas();
    mostrarMensaje(`Tarea eliminada`, 'error');
}

function limpiarTodo() {
    if (tareas.length === 0) return;
    if (!confirm('¿Estás seguro de que deseas eliminar todas las tareas?')) return;
    
    TareaStorage.limpiarTodo();
    cargarTareas();
    mostrarMensaje('Todas las tareas fueron eliminadas', 'error');
}

/* =========================================
   TEMA Y EVENTOS
========================================= */
function aplicarTema(nombreTema) {
    if (nombreTema === 'oscuro') {
        document.documentElement.style.setProperty('--bg-primary', '#1a1a2e');
        document.documentElement.style.setProperty('--text-color', '#e0e0e0');
        document.documentElement.style.setProperty('--card-bg', '#16213e');
        document.documentElement.style.setProperty('--border-color', '#2c3e50');
    } else {
        document.documentElement.style.setProperty('--bg-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#333333');
        document.documentElement.style.setProperty('--card-bg', '#f9f9f9');
        document.documentElement.style.setProperty('--border-color', '#dddddd');
    }

    themeBtns.forEach(btn => {
        btn.classList.toggle('theme-btn--active', btn.dataset.theme === nombreTema);
    });

    TemaStorage.setTema(nombreTema);
}

// Event Listeners
formTarea.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = inputTarea.value.trim();
    agregarTarea(texto);
    inputTarea.value = '';
});

btnLimpiar.addEventListener('click', limpiarTodo);

themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        aplicarTema(btn.dataset.theme);
    });
});

/* =========================================
   INICIALIZACIÓN
========================================= */
const temaGuardado = TemaStorage.getTema();
aplicarTema(temaGuardado);
cargarTareas();

if (tareas.length === 0) {
    mostrarMensaje('¡Bienvenido! Agrega tu primera tarea', 'success');
}