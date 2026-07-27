// Carga del modulo del analizador de codigos de barra
const { procesar_codigo_barra } = require('../js/barcode_parser.js');


// Suite de pruebas unitarias para el procesamiento uniforme de codigos de barra
describe('Pruebas de Procesamiento Uniforme de Códigos de Barra', () => {

    // Prueba 1: Validacion de prefijo 84 (Codigo completo sin modificaciones)
    test('Debe retornar el código completo tal cual si inicia por 84', () => {
        const codigo_entrada = '8412658794512';
        const resultado = procesar_codigo_barra(codigo_entrada);
        
        expect(resultado).toBe('8412658794512');
    });


    // Prueba 2: Validacion de prefijo 241 (Codigo completo sin espacios ni recortes)
    test('Debe retornar el código completo tal cual si inicia por 241', () => {
        const codigo_entrada = '2412345678902';
        const resultado = procesar_codigo_barra(codigo_entrada);
        
        expect(resultado).toBe('2412345678902');
    });


    // Prueba 3: Validacion de cualquier otro prefijo o formato estandar
    test('Debe retornar el código completo sin alteraciones para cualquier otro prefijo', () => {
        const codigo_entrada = '7501234567890';
        const resultado = procesar_codigo_barra(codigo_entrada);
        
        expect(resultado).toBe('7501234567890');
    });


    // Prueba 4: Saneamiento y prevencion de entradas invalidas
    test('Debe retornar null si la entrada es nula, vacía o no es una cadena de texto', () => {
        expect(procesar_codigo_barra('')).toBeNull();
        expect(procesar_codigo_barra(null)).toBeNull();
        expect(procesar_codigo_barra(12345)).toBeNull();
    });

});