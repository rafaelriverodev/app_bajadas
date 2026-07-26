/**
 * Procesa y valida la lectura de un código de barras según su prefijo.
 * 
 * @param {string} codigo_entrada - Cadena de texto obtenida del escáner.
 * @returns {string|null} Código procesado o null si la entrada no es válida.
 */
function procesar_codigo_barra(codigo_entrada) {

    // Validacion de tipo y existencia de datos para prevenir fallos en ejecucion
    if (!codigo_entrada || typeof codigo_entrada !== 'string') {
        return null;
    }


    // Limpieza de espacios en blanco accidentales en los extremos
    const codigo_limpio = codigo_entrada.trim();


    // Regla de negocio: Si inicia por '84' o por '241', se retorna el codigo completo
    if (codigo_limpio.startsWith('84') || codigo_limpio.startsWith('241')) {
        return codigo_limpio;
    }


    // Retorno por defecto para codigos fuera de patron o lecturas incompletas
    return null;

}


// Exportacion modular compatible con Jest (Node.js) y el entorno del navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { procesar_codigo_barra };
}