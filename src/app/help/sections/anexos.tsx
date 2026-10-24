import { LuBookOpen, LuDownload, LuFileJson, LuFileText } from 'react-icons/lu';
import { HelpSection } from './types';

export const anexos: HelpSection = {
  id: 'anexos',
  label: 'Anexos y Descargas',
  icon: <LuDownload size={16} />,
  color: 'text-success',
  description: 'Anexos de IVA, libros de compras, descarga masiva de documentos electrónicos y lector de facturas JSON.',
  subsections: [
    {
      id: 'anexos-iva',
      title: 'Anexos de IVA',
      icon: <LuFileText size={18} />,
      route: '/annexes/annexes',
      menu: 'Anexos y Descargas › Anexos de IVA',
      description: 'Archivos para la declaración de IVA, organizados por tipo de anexo y mes.',
      guides: [
        {
          title: 'Descargar un anexo',
          steps: [
            'Arriba a la derecha elija "Esta Sucursal" o "Todas Las Sucursales".',
            'Ubique la fila del anexo: Ventas a Consumidor Final, Ventas a Contribuyentes, Documentos Anulados o Compras a Sujetos Excluidos.',
            'Haga clic en la columna del mes que necesita para descargarlo.',
          ],
        },
      ],
    },
    {
      id: 'anexos-compras',
      title: 'Libros de compras',
      icon: <LuBookOpen size={18} />,
      route: '/annexes/purchases',
      menu: 'Anexos y Descargas › Libros de compras',
      description: 'Registra las compras a partir de los archivos JSON que entregan los proveedores y genera el libro de compras.',
      guides: [
        {
          title: 'Importar facturas de compra',
          steps: [
            'En "Importar facturas" arrastre los archivos .json o haga clic para seleccionarlos.',
            'Revise el resultado: documentos procesados y errores con su detalle.',
            'Abra el libro del mes para ver los documentos (fecha, NIT, proveedor, crédito fiscal, total y retenciones). Haga clic en uno para ver su detalle.',
            'Si un documento aparece con "Revisar", compárelo con el original duplicado y elimine el que sobra.',
            'Use "Descargar libro" o "Descargar anexo" en el libro del período.',
          ],
        },
      ],
      tips: [
        'Con la función premium, el sistema lee automáticamente los JSON que los proveedores envían a su correo y los registra sin intervención. Consulte con su asesor.',
      ],
      warnings: [
        'Un período "Cerrado" ya no recibe cambios.',
      ],
    },
    {
      id: 'anexos-descargas',
      title: 'Descargas de Documentos',
      icon: <LuDownload size={18} />,
      route: '/annexes/downloads',
      menu: 'Anexos y Descargas › Descargas de Documentos',
      description: 'Genera un ZIP con todos los documentos electrónicos de un período, en JSON (formato de Hacienda) y en PDF.',
      guides: [
        {
          title: 'Descargar los documentos del mes',
          steps: [
            'Elija el período.',
            'Haga clic en "Generar JSON". El estado cambia a "Procesando"; puede tardar varios minutos.',
            'Haga clic en "Actualizar estado" hasta que diga "Listo para descargar" y descargue el ZIP.',
            'Cuando el JSON esté listo, haga clic en "Generar PDF" para obtener la versión visual y descárguela igual.',
          ],
        },
      ],
      warnings: [
        'Generar de nuevo reemplaza el archivo JSON o PDF activo del período.',
      ],
    },
    {
      id: 'anexos-lector',
      title: 'Lector de JSON',
      icon: <LuFileJson size={18} />,
      route: '/annexes/json-reader',
      menu: 'Anexos y Descargas › Lector de JSON',
      description: 'Muestra una factura electrónica JSON como un documento legible, sin registrarla.',
      guides: [
        {
          title: 'Ver una factura JSON',
          steps: [
            'Arrastre el archivo .json o haga clic para seleccionarlo.',
            'Revise emisor, receptor, productos, tributos, totales y el sello de recepción de Hacienda.',
            'Los archivos leídos quedan en "Últimos archivos leídos"; puede borrarlos uno a uno o con "Limpiar todo".',
          ],
        },
      ],
      tips: [
        'Si aparece "Sin sello del Ministerio de Hacienda", el documento puede estar pendiente de transmisión o no fue procesado.',
      ],
    },
  ],
};
