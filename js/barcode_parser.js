// === MÓDULO ANALIZADOR UNIFORME DE CÓDIGOS DE BARRA ===


// Función principal para procesar y sanear el código de barra ingresado
function procesar_codigo_barra(codigo_entrada) {

    // Validación de seguridad de entrada: verifica que sea una cadena válida y no nula
    if (!codigo_entrada || typeof codigo_entrada !== 'string') {
        return null;
    }


    // Limpieza de espacios en blanco al inicio y al final de la cadena
    const codigo_limpio = codigo_entrada.trim();


    // Verificación de cadena no vacía tras la limpieza
    if (codigo_limpio.length === 0) {
        return null;
    }


    // Retorno del código completo e intacto para todos los prefijos (241, 84, etc.)
    return codigo_limpio;
}


// Exportación del módulo para la suite de pruebas TDD
module.exports = {
    procesar_codigo_barra
};