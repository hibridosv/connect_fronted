import { LuCircleAlert, LuFileText, LuListOrdered, LuReceipt, LuSearch, LuTruck } from 'react-icons/lu';
import { HelpSection } from './types';

export const facturacion: HelpSection = {
  id: 'facturacion',
  label: 'Facturación',
  icon: <LuFileText size={16} />,
  color: 'text-info',
  description: 'Documentos emitidos, documentos electrónicos (DTE), notas de crédito, retornos, anulaciones y notas de remisión.',
  subsections: [
    {
      id: 'facturacion-buscar',
      title: 'Buscar Documentos y detalle de un documento',
      icon: <LuSearch size={18} />,
      route: '/invoicing/search',
      menu: 'Facturación › Buscar Documentos',
      description: 'Busca cualquier documento por su número y muestra su detalle con todas las acciones posibles.',
      features: [
        'Detalle: productos, totales, cliente, cajero, fecha, tipo de documento, forma de pago, código de generación y estado electrónico.',
        'Avisos: "Este Documento se envió electrónicamente", "tiene una numeración temporal" o "ha sido anulado". Si no se envió, puede reintentarlo desde el enlace "aquí".',
        'Botones: Imprimir, PDF DTE, Nota C. (nota de crédito), Retorno y Anular.',
      ],
      guides: [
        {
          title: 'Reimprimir o descargar un documento',
          steps: [
            'Escriba el número en "Buscar documento" o elíjalo de "ULTIMOS DOCUMENTOS".',
            'Abra el detalle del documento.',
            'Haga clic en "Imprimir" para el ticket o en "PDF DTE" para el PDF electrónico.',
          ],
        },
        {
          title: 'Emitir una nota de crédito',
          steps: [
            'Abra el detalle del documento y haga clic en "Nota C.".',
            'Indique la cantidad de cada producto a acreditar (para el total del documento, use la opción indicada en la ventana).',
            'Marque si los productos regresan al inventario.',
            'Haga clic en "Crear Nota de Crédito". Las notas emitidas se listan en el detalle y se pueden descargar o anular.',
          ],
        },
        {
          title: 'Registrar una devolución de productos (retorno)',
          steps: [
            'Abra el detalle del documento y haga clic en "Retorno".',
            'Escriba la cantidad que el cliente devuelve de cada producto (no mayor a la disponible).',
            'Haga clic en "Crear Retorno". Se envía un Evento de Retorno a Hacienda, los productos vuelven al inventario y el documento sigue vigente por el resto.',
          ],
        },
        {
          title: 'Anular un documento',
          steps: [
            'Abra el detalle del documento y haga clic en "Anular".',
            'Si es electrónico, elija el tipo de anulación (Error en el documento, Rescindir la operación u Otro motivo) y escriba el motivo.',
            'Si corresponde, busque el documento de reemplazo por su número.',
            'Confirme. Se envía el Evento de Invalidación a Hacienda.',
          ],
        },
      ],
      warnings: [
        'La anulación de un documento electrónico no se puede deshacer.',
        'Si el documento tiene retornos, primero anule los retornos y luego el documento.',
      ],
    },
    {
      id: 'facturacion-emitidos',
      title: 'Documentos Emitidos',
      icon: <LuReceipt size={18} />,
      route: '/invoicing/documents',
      menu: 'Facturación › Documentos Emitidos',
      description: 'Todos los documentos del período con tipo, número, estado (Pagado o Anulado), cliente, tipo de pago, cajero y total. Elija fechas y aplique; haga clic en un documento para ver su detalle.',
    },
    {
      id: 'facturacion-correlativos',
      title: 'Correlativo de Documentos',
      icon: <LuListOrdered size={18} />,
      route: '/invoicing/correlatives',
      menu: 'Facturación › Correlativo de Documentos',
      description: 'Resumen diario del rango de numeración usado por tipo de documento, con subtotal, exento, gravado y total.',
      guides: [
        {
          title: 'Obtener el correlativo del mes',
          steps: [
            'Elija el tipo de documento.',
            'Elija el mes y el año y haga clic en "Aplicar".',
            'Revise por día la cantidad de facturas, la factura inicial y final y los montos. Descargue desde "DESCARGAS".',
          ],
        },
      ],
    },
    {
      id: 'facturacion-electronicos',
      title: 'Documentos Electrónicos',
      icon: <LuFileText size={18} />,
      route: '/invoicing/electronic',
      menu: 'Facturación › Documentos Electrónicos',
      description: 'Los DTE enviados al Ministerio de Hacienda con su estado: Recibido, Firmado, Procesado, Rechazado o Anulado.',
      features: [
        'Columnas: fecha, tipo de DTE, número de control, cliente, estado y email.',
        'Opciones de cada documento: Detalles del Documento, Descargar PDF, Descargar JSON, Reenviar Email y Reenviar Documento al MH.',
      ],
      guides: [
        {
          title: 'Reenviar un documento al cliente',
          steps: [
            'Elija las fechas y aplique.',
            'En el documento, abra las opciones y elija "Reenviar Email".',
            'Elija "Enviar al Cliente" (a su correo registrado) o "Enviar a Otro" y escriba el correo de destino.',
          ],
        },
      ],
    },
    {
      id: 'facturacion-rechazados',
      title: 'Documentos Rechazados',
      icon: <LuCircleAlert size={18} />,
      route: '/invoicing/rejected',
      menu: 'Facturación › Documentos Rechazados',
      description: 'Documentos electrónicos que Hacienda rechazó y que deben corregirse.',
      guides: [
        {
          title: 'Resolver un documento rechazado',
          steps: [
            'Abra la página y revise el total de documentos rechazados.',
            'Haga clic en el documento para ver los errores que impidieron su procesamiento.',
            'Corrija la causa (por ejemplo, datos del cliente en Directorio) y use "Reenviar Documento al MH".',
          ],
        },
      ],
      warnings: [
        'Un documento rechazado no tiene validez fiscal hasta que se procese correctamente.',
      ],
    },
    {
      id: 'facturacion-remision',
      title: 'Notas de Remisión',
      icon: <LuTruck size={18} />,
      route: '/invoicing/remission-notes',
      menu: 'Facturación › Notas de Remisión',
      description: 'Notas de remisión creadas desde la pantalla de ventas, para mover mercadería antes de facturar.',
      guides: [
        {
          title: 'Facturar una nota de remisión',
          steps: [
            'Busque la nota por número o cliente.',
            'Abra su menú › "Ver Nota de remisión".',
            'Revise productos y totales y haga clic en "Facturar" para convertirla en venta.',
          ],
        },
      ],
      tips: [
        'Una nota de remisión se crea desde Ventas › Opciones › "Crear Nota de Remisión" (necesita cliente).',
      ],
    },
  ],
};
