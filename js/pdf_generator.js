/**
 * Genera y descarga un archivo PDF optimizado tanto para navegador de escritorio como para móviles.
 * 
 * @param {string} numero_empleado - Identificador del operador.
 * @param {Array<Object>} lista_productos - Coleccion de productos a exportar.
 */
function generar_reporte_pdf(numero_empleado, lista_productos) {

    // Validacion previa de existencia de datos
    if (!lista_productos || lista_productos.length === 0) {
        alert("No hay productos registrados para exportar.");
        return;
    }


    // Instanciacion de jsPDF desde el espacio global de nombres
    const { jsPDF } = window.jspdf;
    const documento_pdf = new jsPDF();


    // Encabezado del documento
    documento_pdf.setFontSize(16);
    documento_pdf.text("Reporte de Registro de Productos", 14, 20);

    documento_pdf.setFontSize(10);
    documento_pdf.text(`Número de Empleado: ${numero_empleado || 'No especificado'}`, 14, 28);
    documento_pdf.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-ES')}`, 14, 34);


    // Mapeo de datos para la tabla en el orden requerido: Nombre | Codigo | Cantidad
    const filas_tabla = lista_productos.map((item) => [
        item.nombre,
        item.codigo,
        item.cantidad
    ]);


    // Encabezados de la tabla
    const columnas_tabla = ["Nombre", "Código", "Cantidad"];


    // Generacion de la tabla automatica
    documento_pdf.autoTable({
        startY: 40,
        head: [columnas_tabla],
        body: filas_tabla,
        theme: 'striped',
        headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            cellPadding: 4
        }
    });


    // Nombre del archivo con marca de tiempo
    const fecha_formato = new Date().toISOString().slice(0, 10);
    const nombre_archivo = `registro_productos_${fecha_formato}.pdf`;


    // Metodo de descarga compatible con navegadores moviles (iOS/Android)
    try {

        // Generar un objeto Blob tipo PDF
        const blob_pdf = documento_pdf.output('blob');
        const url_blob = URL.createObjectURL(blob_pdf);


        // Crear un elemento de enlace temporal para forzar la descarga en moviles
        const enlace_descarga = document.createElement('a');
        enlace_descarga.href = url_blob;
        enlace_descarga.download = nombre_archivo;
        enlace_descarga.style.display = 'none';

        document.body.appendChild(enlace_descarga);
        enlace_descarga.click();


        // Limpieza de memoria despues de ejecutar el click
        setTimeout(() => {
            document.body.removeChild(enlace_descarga);
            URL.revokeObjectURL(url_blob);
        }, 1000);

    } catch (error_descarga) {

        console.error("Error al descargar el PDF en móvil:", error_descarga);
        
        // Respaldo secundario si el navegador bloquea la creacion de blobs
        documento_pdf.save(nombre_archivo);

    }

}


// Exportacion global para el navegador
if (typeof window !== 'undefined') {
    window.generar_reporte_pdf = generar_reporte_pdf;
}