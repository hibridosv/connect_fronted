import { ReactElement } from 'react';
import {
  FaBoxes, FaChartBar, FaChartLine, FaExchangeAlt, FaFileInvoiceDollar,
  FaLightbulb, FaMoneyBillWave, FaPercentage, FaSearch, FaTruckLoading,
} from 'react-icons/fa';

export const CHATBOT_PHONE = '50370279521';
export const WHATSAPP_MESSAGE = '¿Cuánto he vendido hoy?';

export interface ChatbotCapability {
  icon: ReactElement;
  title: string;
  description: string;
  example: string;
  accent: string;
}

export const CAPABILITIES: ChatbotCapability[] = [
  {
    icon: <FaChartLine />,
    title: 'Ventas',
    description: 'Totales por período, mejores productos y clientes, ventas por categoría, anulaciones y detalle de cualquier factura.',
    example: '¿Cuánto he vendido de Coca-Cola este mes?',
    accent: 'text-primary bg-primary/10',
  },
  {
    icon: <FaChartBar />,
    title: 'Estadísticas',
    description: 'Resumen del día, ventas por hora o día de la semana, comparativo contra el mes anterior y proyección de cierre.',
    example: '¿Cómo me fue ayer comparado con el promedio?',
    accent: 'text-accent bg-accent/10',
  },
  {
    icon: <FaBoxes />,
    title: 'Inventario',
    description: 'Valor del inventario, stock bajo o agotado, productos sin movimiento, próximos a vencer y los más rentables.',
    example: '¿Qué productos se me están por vencer?',
    accent: 'text-success bg-success/10',
  },
  {
    icon: <FaMoneyBillWave />,
    title: 'Finanzas',
    description: 'Cuentas por cobrar y pagar con su mora, saldos de cuentas, gastos, transferencias y cortes de caja con descuadres.',
    example: '¿Cuánto me debe la ferretería López?',
    accent: 'text-info bg-info/10',
  },
  {
    icon: <FaPercentage />,
    title: 'Impuestos',
    description: 'Estimación de IVA débito, crédito fiscal y pago a cuenta del período, siempre lista para revisar antes de declarar.',
    example: '¿Cuánto llevo de IVA este mes?',
    accent: 'text-warning bg-warning/10',
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: 'DTE',
    description: 'Documentos electrónicos emitidos, rechazados o pendientes de envío al Ministerio de Hacienda.',
    example: '¿Qué facturas me rechazó Hacienda hoy?',
    accent: 'text-danger bg-danger/10',
  },
  {
    icon: <FaSearch />,
    title: 'Catálogo',
    description: 'Búsqueda instantánea de productos, clientes, empleados y proveedores por nombre, precio o existencia.',
    example: '¿A cómo vendo el queso duro y cuánto me queda?',
    accent: 'text-primary bg-primary/10',
  },
  {
    icon: <FaTruckLoading />,
    title: 'Compras',
    description: 'Lo comprado a cada proveedor y el historial de compra de un producto: precio, cantidad y vencimiento.',
    example: '¿A qué precio compré el último lote de arroz?',
    accent: 'text-accent bg-accent/10',
  },
  {
    icon: <FaLightbulb />,
    title: 'Diagnóstico del negocio',
    description: 'Crecimiento, márgenes, productos que más o menos dejan, stock muerto, cartera vencida y alertas de anomalías.',
    example: '¿Cómo puedo vender más este mes?',
    accent: 'text-success bg-success/10',
  },
  {
    icon: <FaExchangeAlt />,
    title: 'Gráficas',
    description: 'Cuando los datos se entienden mejor visualmente, el chatbot dibuja la gráfica y la envía directo al chat.',
    example: 'Muéstrame una gráfica de mis ventas de esta semana',
    accent: 'text-info bg-info/10',
  },
];
