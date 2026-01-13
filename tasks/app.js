// SELECCIÓN DE ELEMENTOS DEL DOM
const formulario = document.getElementById('form-tareas');
const input = document.getElementById('input-tarea');
const lista = document.getElementById('lista-tareas');
const mensajeError = document.getElementById('mensaje-error');

// ESTADO INICIAL (Cargar desde LocalStorage o array vacío)
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];//perse  para traducir el localstorage al momento de leer 

// FUNCIÓN PARA GUARDAR EN LOCALSTORAGE
const guardarLocal = () => {
    localStorage.setItem('tareas', JSON.stringify(tareas)); //stringify para traducir al localstorage al momento de guardar
};

// FUNCIÓN PARA RENDERIZAR LA LISTA
const renderizarTareas = () => {
    lista.innerHTML = ''; // innerhtml para limpiamos la lista visual

    tareas.forEach((tarea) => {
        // Creamos el HTML dinámicamente 
        const item = document.createElement('li');
        // Agregamos un atributo data-id para saber cuál borrar/editar luego
        item.dataset.id = tarea.id; 

        item.innerHTML = `
            <button class="eliminar">
                 <ion-icon name="trash-outline"></ion-icon>
            </button>

            <p>${tarea.texto}</p>

            <button class="editar">
                <ion-icon name="create-outline"></ion-icon>
            </button>
        `;

        lista.appendChild(item);
    });
};

// 5. AGREGAR TAREA
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el form

    const texto = input.value.trim();

    // Validación simple
    if (texto === '') {
        mensajeError.style.display = 'block';
        return;
    }
    
    mensajeError.style.display = 'none';

    // Creamos el objeto tarea
    const nuevaTarea = {
        id: Date.now(),
        texto: texto
    };

    tareas.push(nuevaTarea);
    guardarLocal();
    renderizarTareas();
    input.value = ''; // Limpiar input
});

// DELEGACIÓN DE EVENTOS (DETECTAR CLICS EN BORRAR O EDITAR)
lista.addEventListener('click', (e) => {
    // Usamos .closest('button') porque el usuario puede hacer clic en el ícono <ion-icon>
    // y necesitamos subir hasta encontrar el botón contenedor.
    const boton = e.target.closest('button');

    if (!boton) return; // Si no clickeó un botón, no hacemos nada

    // Obtenemos el ID de la tarea desde el elemento padre <li>
    const itemLi = boton.closest('li');
    const idTarea = parseInt(itemLi.dataset.id);

    // --- ACCIÓN DE ELIMINAR ---
    if (boton.classList.contains('eliminar')) {
        // Filtramos: Dejamos todas las tareas MENOS la que tiene ese ID
        tareas = tareas.filter(tarea => tarea.id !== idTarea);
        guardarLocal();
        renderizarTareas();
    }

    // --- ACCIÓN DE EDITAR ---
    if (boton.classList.contains('editar')) {
        const tareaAEditar = tareas.find(tarea => tarea.id === idTarea);
        
        // Un prompt sencillo para editar (se puede mejorar luego con modales)
        const nuevoTexto = prompt("Edita tu tarea:", tareaAEditar.texto);

        if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
            tareaAEditar.texto = nuevoTexto.trim();
            guardarLocal();
            renderizarTareas();
        }
    }
});

// 7. CARGA INICIAL
renderizarTareas();