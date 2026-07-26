// Carga del modulo del analizador de codigos de barra
const { procesar_codigo_barra } = require('../js/barcode_parser.js');


// Suite de pruebas unitarias para la lectura universal de codigos de barra
describe('Pruebas de Procesamiento Universal de Códigos de Barra', () => {

    // Prueba 1: Validacion de prefijo 84
    test('Debe retornar el código completo sin alteraciones si inicia por 84', () => {
        const codigo_entrada = '8412658794512';
        const resultado = procesar_codigo_barra(codigo_entrada);
        
        expect(resultado).toBe('8412658794512');
    });


    // Prueba 2: Validacion de prefijo 241 (Formato 241 + espacio + 4 digitos)
    test('Debe retornar formato "241 XXXX" para codigos que inician por 241', () => {
        const codigo_entrada = '2412345678902';
        const resultado = procesar_codigo_barra(codigo_entrada);
        
        expect(resultado).toBe('241 2345');
    });


    // Prueba 3: Lectura de cualquier otro codigo de barras estándar
    test('Debe retornar el código completo para cualquier otro formato de código de barras', () => {
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