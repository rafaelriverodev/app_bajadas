// Array global para almacenar los productos registrados
const lista_productos_registrados = [];


// Esperar a que el DOM este completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // Referencias a elementos del DOM
    const boton_iniciar_camara = document.getElementById('boton_iniciar_camara');
    const boton_detener_camara = document.getElementById('boton_detener_camara');
    const input_codigo = document.getElementById('codigo_procesado');
    const input_empleado = document.getElementById('numero_empleado');
    const formulario_producto = document.getElementById('formulario_producto');
    const cuerpo_tabla = document.getElementById('cuerpo_tabla_productos');
    const boton_generar_pdf = document.getElementById('boton_generar_pdf');


    // Evento para activar el escaneo por camara
    boton_iniciar_camara.addEventListener('click', () => {

        iniciar_escaneo_camara(
            'lector_camara',
            (codigo_bruto) => {
                
                // Procesar la lectura con la logica de prefijos 84 / 241
                const codigo_validado = procesar_codigo_barra(codigo_bruto);

                if (codigo_validado) {
                    input_codigo.value = codigo_validado;
                    detener_escaneo_camara();
                    boton_iniciar_camara.style.display = 'inline-block';
                    boton_detener_camara.style.display = 'none';
                }

            },
            (error_camara) => {

                // Manejo de diagnostico de permisos y contexto seguro
                console.error("Error al acceder a la cámara:", error_camara);

                if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                    alert('⚠️ La cámara requiere una conexión segura (HTTPS) para funcionar.');
                } else {
                    alert('⚠️ No se pudo acceder a la cámara. Asegúrate de que ninguna otra app la esté usando y recarga la página.');
                }

            }
        );

        boton_iniciar_camara.style.display = 'none';
        boton_detener_camara.style.display = 'inline-block';

    });


    // Evento para detener manualmente la camara
    boton_detener_camara.addEventListener('click', () => {

        detener_escaneo_camara();
        boton_iniciar_camara.style.display = 'inline-block';
        boton_detener_camara.style.display = 'none';

    });


    // Evento para guardar el producto en la lista
    formulario_producto.addEventListener('submit', (evento) => {

        evento.preventDefault();

        const nuevo_registro = {
            empleado: input_empleado.value.trim(),
            nombre: document.getElementById('nombre_producto').value.trim(),
            codigo: input_codigo.value.trim(),
            cantidad: parseInt(document.getElementById('cantidad_producto').value, 10)
        };

        lista_productos_registrados.push(nuevo_registro);

        actualizar_tabla_productos();

        formulario_producto.reset();
        boton_generar_pdf.disabled = false;

    });


    /**
     * Renderiza la lista de productos acumulados en la tabla HTML de manera segura.
     */
    function actualizar_tabla_productos() {

        cuerpo_tabla.innerHTML = '';

        lista_productos_registrados.forEach((item, indice) => {

            const fila = document.createElement('tr');

            // Escape basico de texto para prevenir XSS
            fila.innerHTML = `
                <td>${item.empleado}</td>
                <td>${item.nombre}</td>
                <td>${item.codigo}</td>
                <td>${item.cantidad}</td>
                <td>
                    <button class="boton_eliminar" onclick="eliminar_producto(${indice})">❌</button>
                </td>
            `;

            cuerpo_tabla.appendChild(fila);

        });

    }


    // Funcion global para eliminar un registro
    window.eliminar_producto = function(indice) {

        lista_productos_registrados.splice(indice, 1);
        actualizar_tabla_productos();

        if (lista_productos_registrados.length === 0) {
            boton_generar_pdf.disabled = true;
        }

    };

});