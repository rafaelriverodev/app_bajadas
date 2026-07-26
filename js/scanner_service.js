// Variable global para mantener la referencia a la instancia del escaner
let instancia_escaner = null;


/**
 * Solicita permisos de camara de forma explícita antes de inicializar el lector.
 * 
 * @returns {Promise<boolean>} Resolucion exitosa si el permiso fue concedido.
 */
async function solicitar_permisos_camara_nativo() {

    try {

        // Solicitud nativa para forzar el dialogo de permisos en navegadores moviles
        const transmision_temporal = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
        });


        // Detener inmediatamente la transmision temporal para liberar el sensor
        transmision_temporal.getTracks().forEach((pista) => {
            pista.stop();
        });

        return true;

    } catch (error_permiso) {

        console.error("Error al solicitar permisos nativos:", error_permiso);
        return false;

    }

}


/**
 * Inicializa y arranca la camara enfocando la deteccion en codigos de barra lineales.
 * 
 * @param {string} id_elemento_html - ID del contenedor div para el visor.
 * @param {function} callback_exito - Funcion a ejecutar al detectar un codigo valido.
 * @param {function} callback_error - Funcion opcional para manejar errores de escaneo.
 */
async function iniciar_escaneo_camara(id_elemento_html, callback_exito, callback_error) {

    // Liberacion de instancia previa si existiera
    if (instancia_escaner) {
        await detener_escaneo_camara();
    }


    // Solicitud de permiso nativo
    const permiso_concedido = await solicitar_permisos_camara_nativo();

    if (!permiso_concedido) {

        if (typeof callback_error === 'function') {
            callback_error(new Error("PERMISO_DENEGADO"));
        }

        return;

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


    // Configuracion de rendimiento y area de escaneo
    const configuracion_camara = {
        fps: 15,
        qrbox: { width: 280, height: 150 },
        aspectRatio: 1.777778
    };


    // Inicio de captura tras obtener acceso verificado
    instancia_escaner.start(
        { facingMode: "environment" },
        configuracion_camara,
        (texto_detectado, resultado_raw) => {

            if (texto_detectado && typeof callback_exito === 'function') {
                callback_exito(texto_detectado);
            }

        },
        (mensaje_error_escaneo) => {
            // Silencioso durante la lectura frame por frame
        }
    ).catch((error_inicio) => {

        console.error("Error al arrancar Html5Qrcode:", error_inicio);

        if (typeof callback_error === 'function') {
            callback_error(error_inicio);
        }

    });

}


/**
 * Detiene el uso de la camara y libera el recurso del hardware de manera segura.
 * 
 * @returns {Promise<boolean>}
 */
function detener_escaneo_camara() {

    return new Promise((resolve) => {

        if (instancia_escaner) {

            instancia_escaner.stop().then(() => {

                instancia_escaner.clear();
                instancia_escaner = null;
                resolve(true);

            }).catch((error_detencion) => {

                console.error("Error al detener la cámara:", error_detencion);
                instancia_escaner = null;
                resolve(false);

            });

        } else {

            resolve(true);

        }

    });

}