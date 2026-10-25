import { LuCalendarClock, LuCreditCard, LuTrendingDown, LuTrendingUp, LuUsers } from 'react-icons/lu';
import { HelpSection } from './types';

export const cuentas: HelpSection = {
  id: 'cuentas',
  label: 'Cuentas',
  icon: <LuCreditCard size={16} />,
  color: 'text-danger',
  description: 'Créditos otorgados a clientes (cuentas por cobrar) y deudas con proveedores (cuentas por pagar).',
  subsections: [
    {
      id: 'cuentas-cobrar',
      title: 'Cuentas por cobrar',
      icon: <LuTrendingUp size={18} />,
      route: '/accounts/receivable',
      menu: 'Cuentas › Cuentas por cobrar',
      description: 'Los créditos que se dieron al vender. Aquí se reciben los abonos de los clientes y se administran los planes de cuotas.',
      features: [
        'Resumen: créditos pendientes y total pendiente.',
        'Filtros: Todos, Pagadas o Pendientes, y búsqueda por cliente.',
        'Tabla: cliente, factura, vencimiento, total, saldo y estado de cada crédito.',
        'Descargas: estado de cuenta por rango de fechas.',
      ],
      guides: [
        {
          title: 'Recibir un abono',
          steps: [
            'Verifique que tiene una caja abierta.',
            'Busque el cliente y haga clic en el botón de abonos del crédito.',
            'Revise el detalle: saldo, abonos anteriores, productos y, en créditos por cuotas, las cuotas vencidas y la próxima.',
            'Elija el tipo de pago (y la cuenta, si no es efectivo) y escriba la cantidad. No puede ser mayor al saldo.',
            'En créditos por cuotas puede usar "Pagar a la fecha" (lo vencido) o "Liquidar" (todo el crédito hoy).',
            'Guarde el abono. Puede imprimir el comprobante.',
          ],
        },
        {
          title: 'Créditos por cuotas: mora y reestructuración',
          steps: [
            'En el detalle del crédito, la tabla de cuotas muestra vencimiento, capital, interés, mora, cuota, saldo y estado.',
            'Un usuario con permiso puede usar "Condonar mora" en una cuota vencida.',
            'Para cambiar el plan, use "Reestructurar crédito": elija la nueva frecuencia, número de cuotas y primera cuota, revise el plan calculado y confirme.',
            'Descargue el "Plan de pagos (PDF)" para entregarlo al cliente.',
          ],
        },
      ],
      tips: [
        'Cada abono paga primero lo vencido (mora, interés y capital). Lo que se abona antes de la fecha se descuenta de las últimas cuotas, solo a capital.',
        'El interés y la mora se facturan en cada abono con el mismo tipo de documento de la venta.',
      ],
      warnings: [
        'Si un abono se registró mal, elimínelo desde la tabla de abonos del crédito; queda registrado como eliminado.',
      ],
    },
    {
      id: 'cuentas-antiguedad',
      title: 'Cartera por antigüedad',
      icon: <LuCalendarClock size={18} />,
      route: '/accounts/aging',
      menu: 'Cuentas › Cartera por antigüedad',
      description: 'Clasifica lo que deben los clientes según los días de atraso, para priorizar el cobro.',
      features: [
        'Resumen con el total por cobrar y el total vencido.',
        'Columnas por cliente: Al día, 1-30 días, 31-60 días, 61-90 días y Más de 90 días.',
        'Búsqueda por cliente y botón "Descargar Excel".',
      ],
    },
    {
      id: 'cuentas-pagar',
      title: 'Cuentas por Pagar',
      icon: <LuTrendingDown size={18} />,
      route: '/accounts/payable',
      menu: 'Cuentas › Cuentas por Pagar',
      description: 'Las deudas con proveedores, creadas desde un ingreso de compra o manualmente.',
      guides: [
        {
          title: 'Crear una cuenta por pagar',
          steps: [
            'Haga clic en el botón para agregar cuenta.',
            'Escriba el nombre de la cuenta, busque el proveedor y elija el tipo y número de documento.',
            'Escriba la cantidad y la fecha de vencimiento y guarde.',
          ],
        },
        {
          title: 'Registrar un pago al proveedor',
          steps: [
            'Con la caja abierta, haga clic en el botón de abonos de la cuenta.',
            'Elija el tipo de pago (y la cuenta, si no es efectivo) y la cantidad (no mayor al saldo).',
            'Guarde. El saldo se actualiza y el abono aparece en la tabla de abonos.',
            'Si el proveedor emitió una nota de crédito (si está activado), regístrela con número, factura afectada, fecha y monto.',
          ],
        },
      ],
      tips: [
        'Use los filtros Todos, Pagadas y Pendientes y la búsqueda por proveedor para encontrar una cuenta rápidamente.',
      ],
    },
    {
      id: 'cuentas-cliente',
      title: 'Ver el crédito desde el cliente',
      icon: <LuUsers size={18} />,
      menu: 'Directorio › Contactos › Ver Dashboard',
      description: 'El dashboard de cada cliente muestra su crédito: saldo pendiente, vencido, límite y disponible, con un acceso directo a cuentas por cobrar.',
    },
  ],
};
