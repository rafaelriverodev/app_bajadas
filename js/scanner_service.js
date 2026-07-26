// Variable global para mantener la instancia del escaner
let instancia_escaner = null;


/**
 * Inicializa y arranca la camara enfocando la deteccion en codigos de barra lineales.
 * 
 * @param {string} id_elemento_html - ID del contenedor div para el visor.
 * @param {function} callback_exito - Funcion a ejecutar al detectar un codigo valido.
 * @param {function} callback_error - Funcion opcional para manejar errores de escaneo.
 */
function iniciar_escaneo_camara(id_elemento_html, callback_exito, callback_error) {

    // Si ya existe una instancia activa, se detiene antes de reconfigurar
    if (instancia_escaner) {
        detener_escaneo_camara();
    }


    // Configuracion de formatos especificos para optimizar la precision (EAN-13 y Code 128)
    const formatos_soportados = [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.CODE_128
    ];


    // Instanciacion del lector con la configuracion restringida de formatos
    instancia_escaner = new Html5Qrcode(id_elemento_html, {
        formatsToSupport: formatos_soportados,
        verbose: false
    });


    // Configuracion de rendimiento y area de escaneo para dispositivos moviles y PC
    const configuracion_camara = {
        fps: 15, // Aumenta la frecuencia de captura por segundo
        qrbox: { width: 280, height: 150 }, // Rectangulo horizontal optimizado para codigos de barra
        aspectRatio: 1.777778
    };


    // Inicio de la captura utilizando la camara trasera del dispositivo (environment)
    instancia_escaner.start(
        { facingMode: "environment" },
        configuracion_camara,
        (texto_detectado, resultado_raw) => {
            
            // Validacion y paso de la lectura al callback de exito
            if (texto_detectado && typeof callback_exito === 'function') {
                callback_exito(texto_detectado);
            }

        },
        (mensaje_error) => {

            // Notificacion opcional de errores continuos de enfoque
            if (typeof callback_error === 'function') {
                callback_error(mensaje_error);
            }

        }
    ).catch((error) => {
        console.error("Error al acceder a la cámara:", error);
    });

}


/**
 * Detiene el uso de la camara y libera el recurso del hardware de manera segura.
 */
function detener_escaneo_camara() {

    if (instancia_escaner) {
        instancia_escaner.stop().then(() => {
            instancia_escaner.clear();
            instancia_escaner = null;
        }).catch((error) => {
            console.error("Error al detener la cámara:", error);
        });
    }

}