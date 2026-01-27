// SELECCIÓN DE ELEMENTOS DEL DOM
const formulario = document.getElementById('form-tareas');
const input = document.getElementById('input-tarea');
const lista = document.getElementById('lista-tareas');
const mensajeError = document.getElementById('mensaje-error');

// Elementos de los contadores
const totalElement = document.getElementById('total');
const completadasElement = document.getElementById('completadas');
const pendientesElement = document.getElementById('pendientes');

// URL DE TU SERVIDOR (La base de datos simulada)
const URL_API = 'http://localhost:3000/tasks';

// ---------------------------------------------
// FUNCIONES AUXILIARES (Contadores y Renderizado)
// ---------------------------------------------

// Actualizar los números del contador
const actualizarContadores = (tareas) => {
    const total = tareas.length;
    const completadas = tareas.filter(tarea => tarea.check).length;
    const pendientes = total - completadas;

    totalElement.textContent = total;
    completadasElement.textContent = completadas;
    pendientesElement.textContent = pendientes;
};

// Renderizar la lista en el HTML
const renderizarLista = (tareas) => {
    lista.innerHTML = ''; // Limpiar lista visual

    tareas.forEach((tarea) => {
        const item = document.createElement('li');
        item.dataset.id = tarea.id; 

        // Estilos condicionales según si está completada
        const claseTexto = tarea.check ? 'completada' : '';
        const iconoCheck = tarea.check ? 'checkmark-done-outline' : 'checkmark-outline';

        item.innerHTML = `
            <button class="eliminar">
                 <ion-icon name="trash-outline"></ion-icon>
            </button>

            <p class="${claseTexto}">${tarea.texto}</p>

            <button class="check">
                <ion-icon name="${iconoCheck}"></ion-icon>
            </button>
        `;

        lista.appendChild(item);
    });
};

// ---------------------------------------------
// MÉTODOS HTTP (Simulación de Backend)
// ---------------------------------------------

// 1. GET: Obtener tareas del servidor
const obtenerTareas = async () => {
    try {
        const respuesta = await fetch(URL_API);
        const tareas = await respuesta.json();
        
        renderizarLista(tareas);
        actualizarContadores(tareas);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
    }
};

// 2. POST: Crear nueva tarea en el servidor
const crearTarea = async (tareaNueva) => {
    try {
        await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tareaNueva)
        });
        
        // Recargamos la lista para ver el cambio
        obtenerTareas(); 
    } catch (error) {
        console.error('Error al crear tarea:', error);
    }
};

// 3. DELETE: Eliminar tarea del servidor
const eliminarTarea = async (id) => {
    try {
        await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });
        
        obtenerTareas();
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
    }
};

// 4. PATCH: Editar estado (Check) en el servidor
const cambiarEstadoTarea = async (id, estadoActual) => {
    try {
        await fetch(`${URL_API}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ check: !estadoActual }) // Invertimos el valor
        });
        
        obtenerTareas();
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
    }
};


// ---------------------------------------------
// EVENTOS DEL DOM
// ---------------------------------------------

// Evento Submit (Agregar)
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = input.value.trim();

    if (texto === '') {
        mensajeError.style.display = 'block';
        return;
    }
    
    mensajeError.style.display = 'none';

    // Creamos el objeto tarea (JSON Server crea el ID automáticamente, 
    // pero podemos enviarlo como string si preferimos)
    const nuevaTarea = {
        texto: texto,
        check: false
    };

    crearTarea(nuevaTarea);
    input.value = ''; 
});

// Evento Click (Eliminar o Check)
lista.addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    const itemLi = boton.closest('li');
    const idTarea = itemLi.dataset.id; // JSON server usa strings usualmente

    // --- ELIMINAR ---
    if (boton.classList.contains('eliminar')) {
        eliminarTarea(idTarea);
    }

    // --- CHECK / COMPLETAR ---
    if (boton.classList.contains('check')) {
        // Necesitamos saber si actualmente es true o false para invertirlo.
        // Una forma rápida es mirar si tiene la clase "completada" en el párrafo
        const parrafo = itemLi.querySelector('p');
        const estaCompletada = parrafo.classList.contains('completada');

        cambiarEstadoTarea(idTarea, estaCompletada);
    }
});

// CARGA INICIAL
document.addEventListener('DOMContentLoaded', obtenerTareas);