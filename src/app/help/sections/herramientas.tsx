import { LuClipboardList, LuPercent, LuSlidersHorizontal, LuStar, LuWrench } from 'react-icons/lu';
import { HelpSection } from './types';

export const herramientas: HelpSection = {
  id: 'herramientas',
  label: 'Herramientas',
  icon: <LuWrench size={16} />,
  color: 'text-text-muted',
  description: 'Cotizaciones, comisiones de referidos, puntos de oro y ajuste de inventario físico.',
  subsections: [
    {
      id: 'herramientas-cotizaciones',
      title: 'Cotizaciones',
      icon: <LuClipboardList size={18} />,
      route: '/tools/quotes',
      menu: 'Herramientas › Cotizaciones',
      description: 'Las cotizaciones guardadas desde la pantalla de ventas, con cliente, fecha y vencimiento.',
      guides: [
        {
          title: 'Crear una cotización',
          steps: [
            'En la pantalla de ventas agregue los productos y asigne el cliente.',
            'Abra "Opciones" › "Guardar como Cotización".',
          ],
        },
        {
          title: 'Convertir una cotización en venta',
          steps: [
            'Busque la cotización por número o cliente y haga clic en "Ver detalles".',
            'Revise los productos: solicitados, disponibles y faltantes en inventario.',
            'Haga clic en "Facturar". La cotización se carga como orden en la pantalla de ventas para cobrarla.',
          ],
        },
      ],
    },
    {
      id: 'herramientas-comisiones',
      title: 'Detalle de Comisiones',
      icon: <LuPercent size={18} />,
      route: '/tools/commissions',
      menu: 'Herramientas › Detalle de Comisiones',
      description: 'Calcula y paga las comisiones de los referidos sobre las ventas asociadas a ellos.',
      guides: [
        {
          title: 'Generar y pagar una comisión',
          steps: [
            'Busque el referido en "Buscar Referido".',
            'En "Facturas Pendientes" revise las ventas con su comisión y marque las que va a pagar con "AGREGAR".',
            'Haga clic en "Guardar" para crear la comisión.',
            'En el listado, abra la comisión: verá comisión bruta, retención (10%) y total a pagar.',
            'Haga clic en "PAGAR" para registrarla como pagada, o en "ELIMINAR" si se creó por error.',
          ],
        },
      ],
      tips: [
        'Para que una venta genere comisión, asigne el referido en la venta (Opciones › Asignar Referido).',
      ],
    },
    {
      id: 'herramientas-puntos',
      title: 'Puntos de Oro',
      icon: <LuStar size={18} />,
      route: '/tools/gold-points',
      menu: 'Herramientas › Puntos de Oro',
      description: 'Reportes de comisiones por puntos de oro en un rango de fechas.',
      guides: [
        {
          title: 'Crear un reporte de puntos de oro',
          steps: [
            'En "SELECCIONAR FECHA" elija el rango y aplique para crear el reporte.',
            'Abra el reporte para ver órdenes afectadas, comisiones, puntos de oro, retenciones y total a pagar.',
            'Haga clic en "PAGAR REPORTE" o "ELIMINAR REPORTE" según corresponda.',
          ],
        },
      ],
    },
    {
      id: 'herramientas-ajuste',
      title: 'Ajustar Inventario',
      icon: <LuSlidersHorizontal size={18} />,
      route: '/tools/adjustments',
      menu: 'Herramientas › Ajustar Inventario',
      description: 'Iguala el inventario del sistema con el conteo físico. Cada diferencia queda registrada en el kardex como ajuste.',
      guides: [
        {
          title: 'Hacer un conteo físico',
          steps: [
            'Haga clic en "Iniciar ajuste de inventario".',
            'Busque cada producto contado.',
            'Si la cantidad del sistema es correcta, haga clic en "Aceptar".',
            'Si no coincide, haga clic en "Cambiar", escriba la cantidad real contada y guarde.',
            'Cuando termine, haga clic en "Finalizar ajuste de inventario".',
            'Revise el ajuste en el listado: haga clic en él para ver cada producto con la cantidad anterior, la establecida y la diferencia.',
          ],
        },
      ],
      warnings: [
        'La cantidad de cada producto se compara con la existencia del sistema al momento de guardarlo. Puede seguir vendiendo durante el ajuste, pero guarde cada producto apenas lo cuente.',
      ],
    },
  ],
};
