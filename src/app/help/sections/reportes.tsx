import { LuChartBar, LuPackageMinus, LuPackagePlus, LuQrCode, LuReceipt } from 'react-icons/lu';
import { HelpSection } from './types';

export const reportes: HelpSection = {
  id: 'reportes',
  label: 'Reportes',
  icon: <LuChartBar size={16} />,
  color: 'text-primary',
  description: 'Reportes detallados de ventas con margen, gastos y movimientos de inventario. Se usan igual que los historiales: elija fechas, aplique y descargue.',
  subsections: [
    {
      id: 'reportes-ventas',
      title: 'Detalle de Ventas',
      icon: <LuChartBar size={18} />,
      route: '/reports/sales',
      menu: 'Reportes › Detalle de Ventas',
      description: 'Cada producto vendido con su costo, precio, descuento y margen. Es el reporte para conocer la rentabilidad.',
      features: [
        'Columnas: fecha, producto, código, cantidad, costo unitario y total, precio unitario y total (con impuestos), descuento, monto y total.',
        'Margen $ y Margen %: la ganancia bruta de cada línea.',
        'Totales al pie: subtotal, impuestos, total de ventas y margen bruto.',
      ],
      guides: [
        {
          title: 'Conocer la ganancia de un período',
          steps: [
            'En "Seleccionar fechas" elija el rango (por ejemplo, el mes) y haga clic en "Aplicar".',
            'Revise el "Margen bruto" al pie del reporte.',
            'Ordene o descargue el reporte en Excel desde "DESCARGAS" para analizarlo por producto.',
          ],
        },
      ],
      tips: [
        'El margen depende del costo registrado. Si un producto muestra margen extraño, revise su costo en Reportes › Productos Ingresados.',
      ],
    },
    {
      id: 'reportes-gastos',
      title: 'Detalle de Gastos',
      icon: <LuReceipt size={18} />,
      route: '/reports/expenses',
      menu: 'Reportes › Detalle de Gastos',
      description: 'Gastos del período con empleado, documento, categoría, tipo de pago, cuenta y monto.',
    },
    {
      id: 'reportes-ingresados',
      title: 'Productos Ingresados',
      icon: <LuPackagePlus size={18} />,
      route: '/reports/entered',
      menu: 'Reportes › Productos Ingresados',
      description: 'Ingresos de mercadería: producto, documento, cantidad, precio de costo, proveedor, caducidad, lote y usuario.',
      guides: [
        {
          title: 'Corregir un ingreso (con permiso)',
          steps: [
            'Busque el ingreso en el período.',
            'Haga clic en la opción de editar de la fila.',
            'Corrija el lote, la fecha de vencimiento o el precio de costo y haga clic en "Guardar".',
          ],
        },
      ],
    },
    {
      id: 'reportes-lotes',
      title: 'Productos por lote',
      icon: <LuQrCode size={18} />,
      route: '/reports/by-batch',
      menu: 'Reportes › Productos por lote',
      description: 'Ingresos por lote de un producto, con cantidad ingresada, existencia actual, precios, caducidad y lote. Seleccione el producto.',
    },
    {
      id: 'reportes-averiados',
      title: 'Productos Averiados',
      icon: <LuPackageMinus size={18} />,
      route: '/reports/damaged',
      menu: 'Reportes › Productos Averiados',
      description: 'Salidas registradas en Descontar Productos: fecha, producto, costo, cantidad, razón y empleado. Sirve para medir pérdidas.',
    },
  ],
};
