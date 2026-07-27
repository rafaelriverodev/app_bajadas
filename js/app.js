// Estado global de la aplicacion
const estado_app = {
    productos: [],
    camara_activa: false
};


// Clave para almacenamiento persistente del numero de empleado
const CLAVE_STORAGE_EMPLEADO = 'numero_empleado_sesion';


// Referencias a los elementos del DOM
let elemento_boton_camara = null;
let elemento_boton_detener_camara = null;
let elemento_form_producto = null;
let elemento_input_codigo = null;
let elemento_input_nombre = null;
let elemento_input_cantidad = null;
let elemento_input_empleado = null;
let elemento_cuerpo_tabla = null;
let elemento_boton_pdf = null;


/**
 * Sanea cadenas de texto para prevenir ataques de inyeccion HTML y XSS.
 * 
 * @param {string} texto_entrada - Cadena a sanitizar.
 * @returns {string} Cadena segura libre de caracteres ejecutables.
 */
function sanitizar_texto(texto_entrada) {

    if (!texto_entrada) {
        return '';
    }

    const div_temporal = document.createElement('div');
    div_temporal.textContent = texto_entrada;
    return div_temporal.innerHTML;

}


/**
 * Carga el numero de empleado guardado en localStorage si existe.
 */
function cargar_sesion_empleado() {

    const empleado_guardado = localStorage.getItem(CLAVE_STORAGE_EMPLEADO);

    if (empleado_guardado && elemento_input_empleado) {
        elemento_input_empleado.value = sanitizar_texto(empleado_guardado);
    }

}


/**
 * Guarda el numero de empleado en localStorage para mantener la sesion.
 * 
 * @param {string} valor_empleado - Identificador del empleado.
 */
function guardar_sesion_empleado(valor_empleado) {

    if (valor_empleado) {
        localStorage.setItem(CLAVE_STORAGE_EMPLEADO, valor_empleado);
    }

}


/**
 * Inicializa los eventos y referencias del DOM una vez cargada la pagina.
 */
document.addEventListener('DOMContentLoaded', () => {

    // Asignacion de referencias DOM
    elemento_boton_camara = document.getElementById('boton_iniciar_camara');
    elemento_boton_detener_camara = document.getElementById('boton_detener_camara');
    elemento_form_producto = document.getElementById('formulario_producto');
    elemento_input_codigo = document.getElementById('codigo_procesado');
    elemento_input_nombre = document.getElementById('nombre_producto');
    elemento_input_cantidad = document.getElementById('cantidad_producto');
    elemento_input_empleado = document.getElementById('numero_empleado');
    elemento_cuerpo_tabla = document.getElementById('cuerpo_tabla_productos');
    elemento_boton_pdf = document.getElementById('boton_generar_pdf');


    // Permite la edicion o introduccion manual del codigo de barras en todo momento
    if (elemento_input_codigo) {
        elemento_input_codigo.removeAttribute('readonly');
    }


    // Cargar sesion previa de empleado si existe
    cargar_sesion_empleado();


    // Guardar automaticamente el numero de empleado al cambiar
    elemento_input_empleado.addEventListener('change', () => {
        const valor_sanitizado = sanitizar_texto(elemento_input_empleado.value.trim());
        guardar_sesion_empleado(valor_sanitizado);
    });


    // Evento para activar la camara
    elemento_boton_camara.addEventListener('click', () => {
        iniciar_escaneo();
    });


    // Evento para detener la camara manualmente
    elemento_boton_detener_camara.addEventListener('click', () => {
        detener_escaneo();
    });


    // Evento para guardar un producto en la lista
    elemento_form_producto.addEventListener('submit', (evento) => {
        evento.preventDefault();
        agregar_producto();
    });


    // Evento para generar la exportacion del reporte en PDF
    elemento_boton_pdf.addEventListener('click', () => {
        exportar_pdf();
    });

});


/**
 * Arranca la camara e integra la funcion de parseo universal de codigos de barra.
 */
function iniciar_escaneo() {

    if (typeof window.iniciar_escaneo_camara !== 'function') {
        alert("El servicio de escáner no se ha cargado correctamente.");
        return;
    }

    window.iniciar_escaneo_camara(
        "lector_camara",
        (codigo_bruto) => {
            
            // Procesa el codigo mediante la logica de parseo universal
            const codigo_procesado = window.procesar_codigo_barra(codigo_bruto);

            if (codigo_procesado) {
                elemento_input_codigo.value = codigo_procesado;
                detener_escaneo();
                elemento_input_nombre.focus();
            } else {
                console.warn("Código de barras no válido:", codigo_bruto);
            }

        },
        (error_camara) => {

            if (error_camara && error_camara.message === 'PERMISO_DENEGADO') {
                alert("⚠️ Permiso de cámara denegado. Por favor, habilita el acceso a la cámara en la configuración de tu navegador.");
            } else {
                alert("⚠️ No se pudo acceder a la cámara. Asegúrate de que ninguna otra app la esté usando y recarga la página.");
            }

            detener_escaneo();
        }
    );

    estado_app.camara_activa = true;
    elemento_boton_camara.style.display = 'none';
    elemento_boton_detener_camara.style.display = 'inline-block';

}


/**
 * Detiene la camara y restablece el estado de la interfaz.
 */
function detener_escaneo() {

    if (typeof window.detener_escaneo_camara === 'function') {
        window.detener_escaneo_camara().then(() => {
            estado_app.camara_activa = false;
            elemento_boton_camara.style.display = 'inline-block';
            elemento_boton_detener_camara.style.display = 'none';
        });
    }

}


/**
 * Procesa y agrega un nuevo registro validado a la tabla y estado global.
 */
function agregar_producto() {

    const codigo_ingresado = elemento_input_codigo.value.trim();
    const nombre_ingresado = elemento_input_nombre.value.trim();
    const cantidad_ingresada = parseInt(elemento_input_cantidad.value, 10);
    const empleado_ingresado = elemento_input_empleado.value.trim();

    if (!codigo_ingresado || !nombre_ingresado || isNaN(cantidad_ingresada) || cantidad_ingresada < 1 || !empleado_ingresado) {
        alert("Por favor completa todos los campos con información válida.");
        return;
    }

    // Procesar el codigo ingresado manualmente o por escaner mediante la logica de parseo
    const codigo_final = window.procesar_codigo_barra(codigo_ingresado) || codigo_ingresado;

    // Asegurar persistencia de la sesion del empleado
    guardar_sesion_empleado(sanitizar_texto(empleado_ingresado));

    // Creacion del objeto saneado
    const nuevo_producto = {
        id: Date.now(),
        codigo: sanitizar_texto(codigo_final),
        nombre: sanitizar_texto(nombre_ingresado),
        cantidad: cantidad_ingresada,
        empleado: sanitizar_texto(empleado_ingresado)
    };

    // Agregar al arreglo del estado
    estado_app.productos.push(nuevo_producto);

    // Actualizar la interfaz y limpiar campos
    renderizar_tabla_productos();
    limpiar_formulario_producto();
    actualizar_estado_boton_pdf();

}


/**
 * Limpia los campos del formulario manteniendo el numero de empleado.
 */
function limpiar_formulario_producto() {

    elemento_input_codigo.value = '';
    elemento_input_nombre.value = '';
    elemento_input_cantidad.value = '1';

}


/**
 * Renderiza dinamicamente las filas de la tabla de productos con opciones de edicion y eliminacion.
 */
function renderizar_tabla_productos() {

    elemento_cuerpo_tabla.innerHTML = '';

    estado_app.productos.forEach((producto) => {

        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.codigo}</td>
            <td>${producto.cantidad}</td>
            <td>
                <button type="button" class="boton_editar_fila" onclick="window.editar_cantidad_producto(${producto.id})">
                    Editar Cantidad
                </button>
                <button type="button" class="boton_eliminar_fila" onclick="window.eliminar_producto(${producto.id})">
                    Eliminar
                </button>
            </td>
        `;

        elemento_cuerpo_tabla.appendChild(fila);

    });

}


/**
 * Modifica exclusivamente la cantidad de un producto registrado en la lista.
 * 
 * @param {number} id_producto - Identificador unico del producto a editar.
 */
function editar_cantidad_producto(id_producto) {

    const producto_encontrado = estado_app.productos.find((prod) => prod.id === id_producto);

    if (!producto_encontrado) {
        return;
    }

    const nueva_cantidad_str = prompt(`Editar cantidad para "${producto_encontrado.nombre}":`, producto_encontrado.cantidad);

    if (nueva_cantidad_str === null) {
        return; // El usuario cancelo la edicion
    }

    const nueva_cantidad_num = parseInt(nueva_cantidad_str.trim(), 10);

    if (isNaN(nueva_cantidad_num) || nueva_cantidad_num < 1) {
        alert("⚠️ Ingresa un número entero válido mayor o igual a 1.");
        return;
    }

    producto_encontrado.cantidad = nueva_cantidad_num;
    renderizar_tabla_productos();

}


/**
 * Elimina un registro del estado global por su ID.
 * 
 * @param {number} id_producto - Identificador unico del producto a remover.
 */
function eliminar_producto(id_producto) {

    estado_app.productos = estado_app.productos.filter((prod) => prod.id !== id_producto);
    renderizar_tabla_productos();
    actualizar_estado_boton_pdf();

}


/**
 * Habilita o deshabilita el boton de exportacion a PDF segun haya registros.
 */
function actualizar_estado_boton_pdf() {

    if (estado_app.productos.length > 0) {
        elemento_boton_pdf.removeAttribute('disabled');
    } else {
        elemento_boton_pdf.setAttribute('disabled', 'true');
    }

}


/**
 * Dispara la generacion del reporte en PDF pasandole los datos del empleado y productos.
 */
function exportar_pdf() {

    const numero_empleado = sanitizar_texto(elemento_input_empleado.value.trim());

    if (!numero_empleado) {
        alert("Debes ingresar tu número de empleado para poder exportar el reporte.");
        elemento_input_empleado.focus();
        return;
    }

    if (typeof window.generar_reporte_pdf === 'function') {
        window.generar_reporte_pdf(numero_empleado, estado_app.productos);
    }

}


// Exportacion explicita de funciones al ambito window para garantizar respuesta de eventos en HTML
window.eliminar_producto = eliminar_producto;
window.editar_cantidad_producto = editar_cantidad_producto;