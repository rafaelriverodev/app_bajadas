/**
 * Procesa y limpia la lectura de un código de barras.
 * Mantiene la regla especial para prefijos '241' y permite la lectura
 * universal de cualquier otro código de barras estándar.
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


    // Si la cadena procesada esta vacia tras el trim, retornamos null
    if (codigo_limpio.length === 0) {
        return null;
    }


    // Regla de negocio especifica: Si inicia por '241', se formatean los 3 primeros + espacio + siguientes 4 digitos
    if (codigo_limpio.startsWith('241')) {
        
        const digitos_extraidos = codigo_limpio.slice(3, 7);

        // Si se capturan los 4 digitos numericos contiguos, aplicamos la mascara '241 XXXX'
        if (digitos_extraidos.length === 4 && /^\d{4}$/.test(digitos_extraidos)) {
            return `241 ${digitos_extraidos}`;
        }

    }


    // Soporte universal: Para cualquier otro codigo (ej: prefijo 84 u otros estándares), se retorna completo
    return codigo_limpio;

}


// Exportacion modular compatible con Jest (Node.js) y el entorno del navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { procesar_codigo_barra };
}