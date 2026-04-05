'use client';

import { isProducts, isRestaurant } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LuArrowLeftRight,
  LuArrowUpDown,
  LuBanknote,
  LuBookOpen,
  LuBuilding2,
  LuCalendarClock,
  LuChartBar,
  LuChevronDown,
  LuChevronRight,
  LuCircleAlert,
  LuCircleCheckBig,
  LuClipboardList,
  LuConciergeBell,
  LuCreditCard,
  LuDownload,
  LuFileJson,
  LuFileText, LuHistory,
  LuLayoutDashboard,
  LuLightbulb,
  LuLink2,
  LuMonitor,
  LuPackage,
  LuPackageMinus,
  LuPackagePlus,
  LuPaperclip,
  LuPrinter,
  LuQrCode,
  LuReceipt,
  LuScanLine,
  LuSearch,
  LuSettings,
  LuShield,
  LuShoppingCart,
  LuSlidersHorizontal,
  LuStar,
  LuStore,
  LuTag,
  LuTrendingDown,
  LuTrendingUp,
  LuTriangleAlert,
  LuUserCog,
  LuUsers,
  LuUtensilsCrossed,
  LuWallet,
  LuWrench,
  LuX,
} from 'react-icons/lu';

interface HelpSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  subsections: HelpSubsection[];
}

interface HelpSubsection {
  id: string;
  title: string;
  icon: React.ReactNode;
  route?: string;
  description: string;
  features: string[];
  tips?: string[];
  warnings?: string[];
}

const SECTIONS: HelpSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LuLayoutDashboard size={16} />,
    color: 'text-info',
    subsections: [
      {
        id: 'dashboard-main',
        title: 'Panel Principal',
        icon: <LuLayoutDashboard size={18} />,
        route: '/dashboard',
        description: 'Vista general del negocio con indicadores clave de rendimiento (KPIs), gráficos de ventas y estadísticas en tiempo real.',
        features: [
          'Tarjetas de resumen: ventas del día, total de ventas, monto en efectivo y créditos pendientes',
          'Gráfico de ventas por hora del día actual',
          'Gráfico de ventas por día de la semana',
          'Estadísticas de productos con bajo stock',
          'Acceso rápido a funciones frecuentes',
          'Actualización automática mediante WebSocket (tiempo real)',
        ],
        tips: [
          'Los datos del dashboard se actualizan automáticamente sin necesidad de recargar la página.',
          'Haga clic en las tarjetas de resumen para ir directamente al módulo correspondiente.',
        ],
      },
    ],
  },
  {
    id: 'products',
    label: 'Productos',
    icon: <LuPackage size={16} />,
    color: 'text-success',
    subsections: [
      {
        id: 'products-list',
        title: 'Catálogo de Productos',
        icon: <LuPackage size={18} />,
        route: '/products',
        description: 'Gestión completa del inventario. Consulte existencias, precios, categorías y detalles de todos los productos registrados.',
        features: [
          'Búsqueda por código o descripción con actualización instantánea',
          'Ordenamiento y filtrado por múltiples criterios',
          'Vista detallada de cada producto (precios, lotes, ubicación, marca)',
          'Descarga de listas de precios en formato PDF o Excel',
          'Paginación configurable (10, 25, 50, 100 resultados por página)',
          'Indicadores de stock bajo resaltados visualmente',
          'Vinculación de productos relacionados',
          'Gestión de disponibilidad (activar/desactivar)',
        ],
        tips: [
          'Use el campo de búsqueda para filtrar por código o descripción simultáneamente.',
          'Los productos con stock bajo aparecen con fondo rojo para identificarlos rápido.',
        ],
      },
      {
        id: 'products-add',
        title: 'Agregar Productos',
        icon: <LuPackagePlus size={18} />,
        route: '/products/add',
        description: 'Registro de ingresos al inventario. Agregue nuevos lotes, actualice existencias y registre el costo de los productos.',
        features: [
          'Búsqueda de producto por código o descripción',
          'Registro de cantidad, costo y precio de venta por ingreso',
          'Asignación de lote, fecha de vencimiento y ubicación',
          'Historial de ingresos recientes en la misma pantalla',
          'Posibilidad de agregar múltiples productos en una sola sesión',
          'Confirmación antes de guardar para evitar errores',
        ],
        tips: [
          'Puede registrar varios productos antes de guardar. Use el botón "Agregar otro" para continuar.',
          'El campo de costo es opcional si ya existe un costo registrado para el producto.',
        ],
        warnings: [
          'Verifique la cantidad y el costo antes de confirmar; los ingresos afectan el inventario inmediatamente.',
        ],
      },
      {
        id: 'products-remove',
        title: 'Retirar Productos',
        icon: <LuPackageMinus size={18} />,
        route: '/products/remove',
        description: 'Registro de salidas de inventario por daños, mermas, donaciones u otros motivos que no sean ventas.',
        features: [
          'Selección del producto y lote específico a retirar',
          'Especificación del motivo del retiro',
          'Registro de cantidad retirada',
          'Historial de retiros previos',
          'Cambio de asignación de lotes',
          'Vista detallada del lote seleccionado',
        ],
        warnings: [
          'Los retiros no se pueden deshacer fácilmente. Confirme la cantidad y el motivo antes de guardar.',
        ],
      },
      {
        id: 'products-linked',
        title: 'Productos Vinculados',
        icon: <LuLink2 size={18} />,
        route: '/products/linked',
        description: 'Gestión de relaciones entre productos. Vincule productos complementarios que se venden o gestionan juntos.',
        features: [
          'Visualización de productos y sus vínculos actuales',
          'Búsqueda de productos vinculados',
          'Estadísticas de bajo stock en productos vinculados',
          'Gestión de las relaciones entre productos',
          'Indicadores de disponibilidad de productos vinculados',
        ],
        tips: [
          'Los productos vinculados son útiles para kits o combos que siempre se venden juntos.',
        ],
      },
      {
        id: 'products-stock',
        title: 'Bajo Stock',
        icon: <LuTriangleAlert size={18} />,
        route: '/products/stock',
        description: 'Monitor de productos que han alcanzado o superado su límite mínimo de stock. Identifique qué productos necesitan reabastecimiento.',
        features: [
          'Lista de productos por debajo del mínimo configurado',
          'Búsqueda y filtrado de productos con bajo stock',
          'Ordenamiento por nivel de urgencia',
          'Estadísticas del total de productos afectados',
          'Acceso directo para generar orden de compra',
        ],
        tips: [
          'Revise esta sección diariamente para anticipar necesidades de compra.',
        ],
      },
      {
        id: 'products-expiring',
        title: 'Productos por Vencer',
        icon: <LuCalendarClock size={18} />,
        route: '/products/expiring',
        description: 'Alertas de productos próximos a su fecha de vencimiento. Priorice la venta de estos productos para reducir pérdidas.',
        features: [
          'Lista de productos ordenados por fecha de vencimiento más próxima',
          'Indicadores de estado por urgencia (vence pronto / ya venció)',
          'Filtros por rango de fechas',
          'Información de lote y ubicación de cada producto',
        ],
        warnings: [
          'Tome acción inmediata con los productos marcados en rojo (ya vencidos).',
        ],
      },
      {
        id: 'products-kardex',
        title: 'Kardex de Producto',
        icon: <LuScanLine size={18} />,
        route: '/products/[id]/kardex',
        description: 'Historial completo de movimientos de un producto específico. Consulte cada entrada, salida y ajuste registrado.',
        features: [
          'Registro cronológico de todos los movimientos del producto',
          'Tipo de movimiento: ingreso, venta, retiro, ajuste, transferencia',
          'Saldo acumulado por movimiento',
          'Información del lote involucrado',
          'Filtro por rango de fechas',
          'Exportación del kardex',
        ],
        tips: [
          'Acceda al kardex desde la vista detallada de cualquier producto en el catálogo.',
        ],
      },
    ],
  },
  {
    id: 'orders',
    label: 'Ventas',
    icon: <LuShoppingCart size={16} />,
    color: 'text-accent',
    subsections: [
      {
        id: 'orders-products',
        title: 'Ventas de Productos',
        icon: <LuShoppingCart size={18} />,
        route: '/orders/products',
        description: 'Punto de venta principal para negocios de productos. Registre ventas, aplique descuentos, seleccione forma de pago y emita documentos.',
        features: [
          'Búsqueda de productos por código (lectura de código de barras compatible) o descripción',
          'Gestión de cantidades, precios y descuentos por línea',
          'Selección de nivel de precio por producto',
          'Cambio de lote asignado por línea',
          'Múltiples formas de pago: efectivo, tarjeta, transferencia, crédito, cheque',
          'Tipos de documento: ninguno, ticket, factura, crédito fiscal',
          'Ventas especiales y ventas adicionales',
          'Asignación de notas de remisión',
          'Selección de vendedor/empleado',
          'Agregado de comentarios al pedido',
          'Cálculo automático de cambio en pagos en efectivo',
          'Impresión automática del comprobante',
        ],
        tips: [
          'Conecte un lector de código de barras USB para agilizar el registro de productos.',
          'Use el atajo de teclado Enter para agregar el producto buscado.',
          'Para ventas a crédito, asegúrese de seleccionar el cliente antes de procesar.',
        ],
        warnings: [
          'Verifique el tipo de documento antes de confirmar; cambiar después puede requerir anular el documento.',
        ],
      },
      {
        id: 'orders-restaurant',
        title: 'Ventas de Restaurante',
        icon: <LuUtensilsCrossed size={18} />,
        route: '/orders/restaurant',
        description: 'POS especializado para restaurantes y servicios de alimentación con gestión de mesas, delivery y personalización de platillos.',
        features: [
          'Selección de tipo de servicio: mesa, para llevar, delivery',
          'Asignación de mesa para servicio en restaurante',
          'Búsqueda y selección de menú con imágenes',
          'Modificadores y opciones de personalización por platillo',
          'Modo delivery con búsqueda de cliente por nombre o teléfono',
          'Gestión de propinas',
          'División de cuenta entre comensales',
          'Ventas especiales y descuentos',
          'Múltiples formas de pago',
          'Selección de tipo de factura',
          'Envío directo a cocina (impresora de cocina)',
        ],
        tips: [
          'Use el modo mesa para llevar control del tiempo de atención por table.',
          'La opción "dividir cuenta" permite cobrar por separado a cada comensal.',
        ],
      },
    ],
  },
  {
    id: 'cash',
    label: 'Caja',
    icon: <LuWallet size={16} />,
    color: 'text-warning',
    subsections: [
      {
        id: 'cash-accounts',
        title: 'Cuentas Bancarias',
        icon: <LuBanknote size={18} />,
        route: '/cash/bank-accounts',
        description: 'Administración de cuentas bancarias y de efectivo del negocio. Consulte saldos, registre movimientos y transfiera fondos.',
        features: [
          'Creación y gestión de múltiples cuentas (efectivo, banco, etc.)',
          'Vista de saldo actual por cuenta',
          'Transferencias entre cuentas',
          'Historial de movimientos por cuenta',
          'Detalles completos de cada cuenta',
        ],
      },
      {
        id: 'cash-expenses',
        title: 'Gastos',
        icon: <LuTrendingDown size={18} />,
        route: '/cash/expenses',
        description: 'Registro y control de gastos operativos. Categorice los gastos para un mejor análisis financiero.',
        features: [
          'Registro de gastos con descripción, monto y categoría',
          'Creación y gestión de categorías de gasto',
          'Historial de gastos con paginación',
          'Filtros por categoría y rango de fechas',
          'Reportes de gastos para análisis',
        ],
        tips: [
          'Mantenga las categorías organizadas para facilitar los reportes mensuales.',
        ],
      },
      {
        id: 'cash-remittances',
        title: 'Remesas',
        icon: <LuArrowUpDown size={18} />,
        route: '/cash/remittances',
        description: 'Registro de remesas de caja. Documente las salidas de efectivo hacia cuentas bancarias o sucursales.',
        features: [
          'Registro de remesas con monto y descripción',
          'Vista de últimas remesas realizadas',
          'Seguimiento del flujo de efectivo',
          'Asociación con cuenta destino',
        ],
      },
      {
        id: 'cash-history',
        title: 'Historial de Caja',
        icon: <LuHistory size={18} />,
        route: '/cash/history',
        description: 'Registro completo de todos los movimientos de efectivo. Consulte entradas, salidas y saldos históricos.',
        features: [
          'Log completo de movimientos de caja',
          'Filtros por tipo de movimiento y rango de fechas',
          'Saldos acumulados',
          'Exportación de datos',
        ],
      },
      {
        id: 'cash-transfers',
        title: 'Transferencias',
        icon: <LuArrowLeftRight size={18} />,
        route: '/cash/transfers',
        description: 'Gestión de transferencias entre cuentas internas del negocio.',
        features: [
          'Transferencia entre cuentas propias',
          'Historial de transferencias realizadas',
          'Verificación de saldos antes de transferir',
        ],
        warnings: [
          'Las transferencias afectan los saldos de ambas cuentas inmediatamente.',
        ],
      },
    ],
  },
  {
    id: 'cashdrawers',
    label: 'Cajas Registradoras',
    icon: <LuCreditCard size={16} />,
    color: 'text-warning',
    subsections: [
      {
        id: 'cashdrawers-main',
        title: 'Cajas y Cortes',
        icon: <LuCreditCard size={18} />,
        route: '/cashdrawers',
        description: 'Gestión de cajas registradoras físicas. Abra y cierre turnos, realice cortes de caja y revise el historial de operaciones.',
        features: [
          'Lista de cajas registradoras disponibles',
          'Apertura de caja con monto inicial',
          'Cierre de turno y generación de corte',
          'Vista de cortes del día actual',
          'Historial completo de cortes con paginación',
          'Detalle de cada corte: ventas, efectivo, diferencias',
          'Filtrar cortes por usuario o ver todos',
          'Resumen de ventas por forma de pago en cada corte',
        ],
        tips: [
          'Realice el corte de caja al final de cada turno para mantener un control preciso del efectivo.',
          'Compare el efectivo contado con el total calculado en el sistema para detectar diferencias.',
        ],
        warnings: [
          'No olvide abrir la caja al inicio del turno; sin esto no podrá registrar ventas.',
        ],
      },
    ],
  },
  {
    id: 'contacts',
    label: 'Contactos',
    icon: <LuUsers size={16} />,
    color: 'text-info',
    subsections: [
      {
        id: 'contacts-main',
        title: 'Gestión de Contactos',
        icon: <LuUsers size={18} />,
        route: '/contacts/search',
        description: 'Directorio de clientes, proveedores y empleados. Administre toda la información de contacto de personas relacionadas con el negocio.',
        features: [
          'Búsqueda por nombre, número de documento, código o teléfono',
          'Registro de nuevos contactos (clientes, proveedores, empleados)',
          'Edición de información existente',
          'Eliminación con confirmación',
          'Clasificación por tipo: cliente, proveedor, empleado',
          'Vista de totales (cuentas por cobrar/pagar por contacto)',
          'Descarga de lista de contactos',
          'Paginación y filtros avanzados',
        ],
        tips: [
          'Un contacto puede ser simultáneamente cliente y proveedor.',
          'Los contactos marcados como empleados pueden asignarse como vendedores en ventas.',
        ],
      },
    ],
  },
  {
    id: 'accounts',
    label: 'Cuentas',
    icon: <LuReceipt size={16} />,
    color: 'text-danger',
    subsections: [
      {
        id: 'accounts-receivable',
        title: 'Cuentas por Cobrar',
        icon: <LuTrendingUp size={18} />,
        route: '/accounts/receivable',
        description: 'Control de créditos otorgados a clientes. Gestione cobros, consulte saldos pendientes y genere estados de cuenta.',
        features: [
          'Lista de clientes con saldo pendiente',
          'Filtro por estado: todas / pendientes / pagadas',
          'Tarjetas de resumen: total por cobrar, pendiente, pagado',
          'Registro de pagos recibidos',
          'Historial de pagos por cliente',
          'Búsqueda por nombre de cliente',
          'Filtro por rango de fechas',
          'Descarga de reporte de cuentas por cobrar',
          'Enlace a detalle de factura original',
        ],
        tips: [
          'Use el filtro "Pendientes" para ver rápidamente qué clientes tienen saldo por pagar.',
          'Puede registrar pagos parciales; el saldo se actualiza automáticamente.',
        ],
      },
      {
        id: 'accounts-payable',
        title: 'Cuentas por Pagar',
        icon: <LuTrendingDown size={18} />,
        route: '/accounts/payable',
        description: 'Control de créditos recibidos de proveedores. Gestione pagos, consulte vencimientos y administre notas de crédito.',
        features: [
          'Lista de proveedores con saldo pendiente',
          'Filtro por estado: todas / pendientes / pagadas',
          'Tarjetas de resumen: total por pagar, pendiente, pagado',
          'Registro de pagos realizados',
          'Gestión de notas de crédito',
          'Búsqueda por nombre de proveedor',
          'Filtro por rango de fechas',
          'Descarga de reporte de cuentas por pagar',
        ],
        tips: [
          'Registre notas de crédito recibidas de proveedores para mantener el saldo correcto.',
        ],
      },
    ],
  },
  {
    id: 'invoicing',
    label: 'Facturación',
    icon: <LuFileText size={16} />,
    color: 'text-info',
    subsections: [
      {
        id: 'invoicing-documents',
        title: 'Documentos Emitidos',
        icon: <LuFileText size={18} />,
        route: '/invoicing/documents',
        description: 'Reporte de todos los documentos fiscales emitidos. Consulte facturas, tickets, créditos fiscales y notas de crédito.',
        features: [
          'Lista completa de documentos emitidos',
          'Filtro por tipo de documento y rango de fechas',
          'Vista detallada de cada documento',
          'Indicadores de estado del documento',
          'Exportación de reportes',
          'Totales por tipo de documento',
        ],
      },
      {
        id: 'invoicing-electronic',
        title: 'Facturación Electrónica',
        icon: <LuQrCode size={18} />,
        route: '/invoicing/electronic',
        description: 'Gestión de Documentos Tributarios Electrónicos (DTE). Consulte el estado de transmisión ante el Ministerio de Hacienda y reenvíe documentos fallidos.',
        features: [
          'Lista de DTEs con estado de transmisión (procesado, pendiente, rechazado)',
          'Reenvío de documentos pendientes o con error',
          'Envío por correo electrónico al receptor',
          'Filtro por tipo de DTE y rango de fechas',
          'Indicadores de estado con colores (verde: procesado, rojo: rechazado)',
          'Detalle completo de cada DTE',
          'Acceso al código de generación (UUID)',
          'Sello del Ministerio de Hacienda',
        ],
        tips: [
          'Los documentos en rojo requieren atención inmediata; revise el motivo de rechazo.',
          'Puede reenviar un documento al correo del cliente desde el detalle del DTE.',
        ],
        warnings: [
          'Los documentos rechazados por el MH deben anularse y emitirse nuevamente con los datos correctos.',
        ],
      },
      {
        id: 'invoicing-remission',
        title: 'Notas de Remisión',
        icon: <LuPrinter size={18} />,
        route: '/invoicing/remission-notes',
        description: 'Gestión de notas de remisión para control de despachos. Documente la entrega de mercadería sin fines fiscales.',
        features: [
          'Lista de notas de remisión emitidas',
          'Asociación con factura o pedido',
          'Estado de entrega',
          'Impresión de nota de remisión',
        ],
      },
      {
        id: 'invoicing-correlatives',
        title: 'Correlativos',
        icon: <LuSlidersHorizontal size={18} />,
        route: '/invoicing/correlatives',
        description: 'Configuración de los rangos de numeración para cada tipo de documento fiscal.',
        features: [
          'Gestión de correlativos por tipo de documento',
          'Configuración de número inicial y final',
          'Estado actual del correlativo en uso',
          'Prevención de duplicados en numeración',
        ],
        warnings: [
          'Modifique los correlativos solo si está seguro del impacto. Un correlativo incorrecto puede generar documentos inválidos.',
        ],
      },
      {
        id: 'invoicing-rejected',
        title: 'Documentos Rechazados',
        icon: <LuCircleAlert size={18} />,
        route: '/invoicing/rejected',
        description: 'Seguimiento de documentos electrónicos rechazados por el Ministerio de Hacienda con sus motivos de rechazo.',
        features: [
          'Lista de documentos rechazados con fecha y motivo',
          'Detalle del error reportado por el MH',
          'Opciones de corrección y reenvío',
          'Historial de intentos de transmisión',
        ],
      },
    ],
  },
  {
    id: 'history',
    label: 'Historial',
    icon: <LuHistory size={16} />,
    color: 'text-text-muted',
    subsections: [
      {
        id: 'history-sales',
        title: 'Historial de Ventas',
        icon: <LuShoppingCart size={18} />,
        route: '/history/sales',
        description: 'Registro completo de todas las transacciones de venta. Consulte ventas pasados con todos sus detalles.',
        features: [
          'Lista de ventas con fecha, monto y estado',
          'Detalle completo de cada venta (productos, cantidades, precios)',
          'Filtros por rango de fechas',
          'Búsqueda por número de pedido o cliente',
          'Exportación a Excel/PDF',
          'Indicadores de tipo de pago y documento',
        ],
      },
      {
        id: 'history-customer',
        title: 'Por Cliente',
        icon: <LuUsers size={18} />,
        route: '/history/by-customer',
        description: 'Análisis de ventas agrupado por cliente. Identifique sus mejores clientes y su historial de compras.',
        features: [
          'Ventas agrupadas y totalizadas por cliente',
          'Ranking de clientes por volumen de compra',
          'Historial detallado por cliente',
          'Filtros por período',
        ],
      },
      {
        id: 'history-product',
        title: 'Por Producto',
        icon: <LuPackage size={18} />,
        route: '/history/by-product',
        description: 'Análisis de ventas agrupado por producto. Identifique los productos más vendidos y su rotación.',
        features: [
          'Ventas agrupadas y totalizadas por producto',
          'Ranking de productos más vendidos',
          'Volumen de unidades vendidas',
          'Filtros por período',
        ],
      },
      {
        id: 'history-user',
        title: 'Por Vendedor',
        icon: <LuUserCog size={18} />,
        route: '/history/by-user',
        description: 'Rendimiento de ventas por empleado/vendedor. Base para cálculo de comisiones y evaluación de desempeño.',
        features: [
          'Ventas totalizadas por vendedor',
          'Número de transacciones por empleado',
          'Comparativa entre períodos',
          'Filtros por fecha',
        ],
      },
      {
        id: 'history-deleted',
        title: 'Registros Eliminados',
        icon: <LuX size={18} />,
        route: '/history/deleted',
        description: 'Auditoría de registros eliminados. Consulte qué se eliminó, cuándo y quién realizó la acción.',
        features: [
          'Log de eliminaciones con fecha y usuario responsable',
          'Tipo de registro eliminado',
          'Datos del registro antes de la eliminación',
          'Filtros por tipo y rango de fechas',
        ],
        tips: [
          'Use este módulo para auditar y detectar eliminaciones no autorizadas.',
        ],
      },
      {
        id: 'history-costs',
        title: 'Historial de Costos',
        icon: <LuChartBar size={18} />,
        route: '/history/costs',
        description: 'Seguimiento de la evolución de costos de productos. Analice márgenes y detecte variaciones en precios de compra.',
        features: [
          'Historial de cambios de costo por producto',
          'Comparativa de costos en el tiempo',
          'Cálculo de margen de ganancia',
          'Exportación de datos',
        ],
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: <LuChartBar size={16} />,
    color: 'text-accent',
    subsections: [
      {
        id: 'reports-sales',
        title: 'Reportes de Ventas',
        icon: <LuChartBar size={18} />,
        route: '/reports/sales',
        description: 'Generación de reportes analíticos de ventas para toma de decisiones. Exporte a Excel para análisis externos.',
        features: [
          'Reporte de ventas por período',
          'Totales por forma de pago',
          'Totales por tipo de documento',
          'Descarga en formato Excel/CSV',
          'Filtros por sucursal y rango de fechas',
        ],
      },
      {
        id: 'reports-entered',
        title: 'Ingresos al Inventario',
        icon: <LuPackagePlus size={18} />,
        route: '/reports/entered',
        description: 'Reporte de todos los ingresos registrados al inventario.',
        features: [
          'Lista de ingresos con producto, cantidad y costo',
          'Filtros por producto y período',
          'Totales de costo de ingreso',
          'Descarga de reporte',
        ],
      },
      {
        id: 'reports-damaged',
        title: 'Productos Dañados',
        icon: <LuTriangleAlert size={18} />,
        route: '/reports/damaged',
        description: 'Reporte de productos retirados del inventario por daños o pérdidas.',
        features: [
          'Lista de retiros con motivo y cantidad',
          'Costo total de pérdidas',
          'Filtros por período y categoría',
          'Exportación de datos',
        ],
      },
      {
        id: 'reports-batch',
        title: 'Ventas por Lote',
        icon: <LuClipboardList size={18} />,
        route: '/reports/by-batch',
        description: 'Análisis de ventas agrupado por lote/partida de producto.',
        features: [
          'Ventas segmentadas por número de lote',
          'Trazabilidad de lotes vendidos',
          'Fechas de vencimiento por lote',
          'Útil para productos con control de lotes obligatorio',
        ],
      },
    ],
  },
  {
    id: 'transfers',
    label: 'Transferencias',
    icon: <LuArrowLeftRight size={16} />,
    color: 'text-success',
    subsections: [
      {
        id: 'transfers-new',
        title: 'Nueva Transferencia',
        icon: <LuArrowLeftRight size={18} />,
        route: '/transfers/new',
        description: 'Creación de transferencias de inventario entre sucursales. Mueva productos de un local a otro con trazabilidad completa.',
        features: [
          'Selección de sucursal destino',
          'Búsqueda y adición de productos a transferir',
          'Especificación de cantidades por producto',
          'Gestión de lista de transferencia antes de enviar',
          'Descarga de comprobante de transferencia en PDF',
          'Envío a sucursal destino',
        ],
        tips: [
          'Prepare la lista completa antes de enviar; una vez enviada no se puede modificar.',
        ],
      },
      {
        id: 'transfers-list',
        title: 'Historial de Transferencias',
        icon: <LuClipboardList size={18} />,
        route: '/transfers/list',
        description: 'Consulta de todas las transferencias realizadas con su estado actual.',
        features: [
          'Lista de transferencias con fecha, origen y destino',
          'Estado: enviada, recibida, pendiente',
          'Detalle de productos incluidos',
          'Descarga de reporte',
          'Filtros por fecha y estado',
        ],
      },
      {
        id: 'transfers-request',
        title: 'Recibir Transferencias',
        icon: <LuStore size={18} />,
        route: '/transfers/request',
        description: 'Gestión de transferencias entrantes. Confirme la recepción de inventario proveniente de otras sucursales.',
        features: [
          'Lista de transferencias pendientes de recibir',
          'Revisión de productos incluidos en la transferencia',
          'Confirmación de recepción',
          'Actualización automática del inventario al confirmar',
        ],
        warnings: [
          'Verifique físicamente los productos antes de confirmar la recepción.',
        ],
      },
    ],
  },
  {
    id: 'tools',
    label: 'Herramientas',
    icon: <LuWrench size={16} />,
    color: 'text-text-muted',
    subsections: [
      {
        id: 'tools-adjustments',
        title: 'Ajustes de Inventario',
        icon: <LuSlidersHorizontal size={18} />,
        route: '/tools/adjustments',
        description: 'Corrección de existencias del inventario. Realice conteos físicos y ajuste el sistema para que coincida con la realidad.',
        features: [
          'Inicio y cierre de sesiones de ajuste',
          'Búsqueda y selección de productos a ajustar',
          'Ingreso de cantidad real contada',
          'Cálculo automático de la diferencia (sobrante/faltante)',
          'Historial de ajustes previos',
          'Finalización del ajuste con confirmación',
        ],
        tips: [
          'Realice ajustes en horarios de baja actividad para evitar conflictos con ventas en curso.',
        ],
        warnings: [
          'Un ajuste finalizado modifica permanentemente las existencias del inventario.',
        ],
      },
      {
        id: 'tools-quotes',
        title: 'Cotizaciones',
        icon: <LuFileText size={18} />,
        route: '/tools/quotes',
        description: 'Generación y gestión de cotizaciones para clientes. Presente presupuestos formales sin afectar el inventario.',
        features: [
          'Creación de cotizaciones con productos y precios',
          'Seguimiento de estado de cada cotización',
          'Conversión de cotización a pedido confirmado',
          'Exportación de cotización en PDF',
          'Historial de cotizaciones enviadas',
        ],
        tips: [
          'Las cotizaciones no afectan el inventario hasta convertirlas en pedido.',
        ],
      },
      {
        id: 'tools-commissions',
        title: 'Comisiones',
        icon: <LuStar size={18} />,
        route: '/tools/commissions',
        description: 'Cálculo y gestión de comisiones de ventas para empleados.',
        features: [
          'Cálculo de comisiones por período',
          'Detalle por vendedor',
          'Configuración de porcentaje de comisión',
          'Exportación de liquidación',
        ],
      },
    ],
  },
  {
    id: 'restaurant',
    label: 'Restaurante',
    icon: <LuUtensilsCrossed size={16} />,
    color: 'text-accent',
    subsections: [
      {
        id: 'restaurant-menu',
        title: 'Gestión de Menú',
        icon: <LuConciergeBell size={18} />,
        route: '/restaurant/menu',
        description: 'Editor del menú del restaurante. Administre platillos, categorías, precios, imágenes y opciones de personalización.',
        features: [
          'Creación y edición de platillos con imagen',
          'Organización por categorías y subcategorías',
          'Gestión de modificadores y opciones (extras, variantes)',
          'Control de disponibilidad por platillo',
          'Vinculación con productos del inventario',
          'Precios y costos por platillo',
          'Activar/desactivar ítems del menú',
        ],
        tips: [
          'Vincule cada platillo del menú a los productos de inventario para descontar ingredientes automáticamente.',
        ],
      },
      {
        id: 'restaurant-orders',
        title: 'Órdenes de Restaurante',
        icon: <LuClipboardList size={18} />,
        route: '/restaurant/orders',
        description: 'Gestión del flujo de órdenes activas. Monitoree el estado de cada orden en el restaurante.',
        features: [
          'Vista de órdenes activas por tipo (mesa, delivery, para llevar)',
          'Estado de preparación (pendiente, en cocina, listo)',
          'Tiempo transcurrido por orden',
          'Detalles de cada orden',
          'Acciones rápidas de gestión',
        ],
      },
      {
        id: 'restaurant-screen',
        title: 'Pantalla de Cocina',
        icon: <LuMonitor size={18} />,
        route: '/restaurant/screen',
        description: 'Sistema de visualización para cocina (KDS). Muestra las órdenes activas para que el equipo de cocina las prepare.',
        features: [
          'Vista simplificada de órdenes en preparación',
          'Actualización en tiempo real vía WebSocket',
          'Marcado de órdenes como completadas',
          'Indicadores de tiempo por orden',
          'Optimizado para pantallas de cocina',
        ],
        tips: [
          'Configure una pantalla dedicada en cocina para este módulo para un flujo óptimo.',
        ],
      },
    ],
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: <LuSettings size={16} />,
    color: 'text-text-muted',
    subsections: [
      {
        id: 'settings-general',
        title: 'Configuración General',
        icon: <LuSettings size={18} />,
        route: '/settings/general',
        description: 'Ajustes globales del sistema. Configure el comportamiento del software según las necesidades de su negocio.',
        features: [
          'Módulo de inventario: control de lotes, vencimientos, mínimos de stock',
          'Módulo de ventas: descuentos, comentarios, cambio de precios',
          'Módulo de facturación: tipos de documentos habilitados',
          'Módulo de impresión: formato y contenido de comprobantes',
          'Módulo de caja: apertura obligatoria, control de cortes',
          'Módulo de restaurante: tipos de servicio habilitados',
        ],
        warnings: [
          'Los cambios en configuración general afectan a todos los usuarios del sistema inmediatamente.',
        ],
      },
      {
        id: 'settings-users',
        title: 'Usuarios',
        icon: <LuUsers size={18} />,
        route: '/settings/users',
        description: 'Administración de usuarios del sistema. Cree cuentas, asigne roles y gestione contraseñas.',
        features: [
          'Creación de nuevos usuarios con nombre y contraseña',
          'Asignación de rol: Gerencia, Administración, Cajero, Contador',
          'Edición de nombre de usuario',
          'Cambio de contraseña',
          'Activación y desactivación de usuarios',
          'Filtro de usuarios activos/todos',
        ],
        tips: [
          'Asigne el rol mínimo necesario a cada usuario según sus responsabilidades.',
        ],
        warnings: [
          'La contraseña de administrador principal debe mantenerse segura. Cámbiela periódicamente.',
        ],
      },
      {
        id: 'settings-permissions',
        title: 'Permisos',
        icon: <LuShield size={18} />,
        route: '/settings/permissions',
        description: 'Control granular de permisos por rol. Defina qué acciones puede realizar cada tipo de usuario.',
        features: [
          'Matriz de permisos por rol',
          'Permisos por módulo (ver, crear, editar, eliminar)',
          'Configuración diferente por rol',
          'Actualización en tiempo real de permisos',
        ],
        tips: [
          'Revise los permisos después de crear un nuevo rol para asegurarse de que tenga acceso correcto.',
        ],
      },
      {
        id: 'settings-products',
        title: 'Configuración de Productos',
        icon: <LuTag size={18} />,
        route: '/settings/products',
        description: 'Catálogos relacionados con productos: marcas, categorías, ubicaciones y unidades de medida.',
        features: [
          'Gestión de categorías de productos',
          'Registro y edición de marcas',
          'Configuración de ubicaciones/bodegas',
          'Unidades de medida disponibles',
        ],
      },
      {
        id: 'settings-branches',
        title: 'Sucursales',
        icon: <LuBuilding2 size={18} />,
        route: '/settings/branches',
        description: 'Configuración de sucursales para negocios con múltiples ubicaciones.',
        features: [
          'Registro de sucursales con dirección y datos fiscales',
          'Configuración por sucursal',
          'Asociación de usuarios a sucursales',
          'Gestión de inventarios por sucursal',
        ],
      },
    ],
  },
  {
    id: 'annexes',
    label: 'Anexos',
    icon: <LuPaperclip size={16} />,
    color: 'text-info',
    subsections: [
      {
        id: 'annexes-iva',
        title: 'Anexos de IVA',
        icon: <LuPaperclip size={18} />,
        route: '/annexes/annexes',
        description: 'Generación de anexos mensuales de IVA para presentación ante el Ministerio de Hacienda.',
        features: [
          'Generación de libro de ventas mensual',
          'Generación de libro de compras mensual',
          'Selección de mes y año a reportar',
          'Selección de sucursal',
          'Descarga en formato compatible con MH',
        ],
        tips: [
          'Genere los anexos antes del día 10 de cada mes para cumplir con el plazo de presentación.',
        ],
      },
      {
        id: 'annexes-json',
        title: 'Lector de Facturas JSON',
        icon: <LuFileJson size={18} />,
        route: '/annexes/json-reader',
        description: 'Visor de documentos electrónicos en formato JSON. Importe y visualice cualquier DTE de forma legible.',
        features: [
          'Importación de archivo JSON por arrastre o selección',
          'Soporte para todos los tipos de DTE: facturas, CCF, notas de crédito, facturas de sujeto excluido, exportación',
          'Visualización estructurada: emisor, receptor/sujeto excluido, productos, resumen',
          'Validación de estructura del JSON al importar',
          'Historial de archivos importados en la sesión',
          'Visualización del sello del Ministerio de Hacienda',
          'Indicador de ambiente (pruebas / producción)',
        ],
        tips: [
          'Puede arrastrar el archivo JSON directamente a la zona de importación.',
          'Use este lector para verificar el contenido de DTEs recibidos de proveedores.',
        ],
      },
      {
        id: 'annexes-purchases',
        title: 'Compras',
        icon: <LuDownload size={18} />,
        route: '/annexes/purchases',
        description: 'Registro y consulta de compras realizadas a proveedores.',
        features: [
          'Historial de compras por proveedor',
          'Montos y fechas de cada compra',
          'Asociación con documentos fiscales',
          'Exportación de datos',
        ],
      },
    ],
  },
];

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-text-base">
      <LuCircleCheckBig size={14} className="text-success mt-0.5 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-xs text-text-muted">
      <LuLightbulb size={13} className="text-warning mt-0.5 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function WarningItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-xs text-danger">
      <LuCircleAlert size={13} className="mt-0.5 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function SubsectionCard({ sub }: { sub: HelpSubsection }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-bg-content border border-bg-subtle rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-subtle/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-primary">{sub.icon}</span>
          <span className="font-bold text-text-base text-sm">{sub.title}</span>
          {sub.route && (
            <span className="hidden sm:inline text-[10px] font-mono bg-bg-subtle text-text-muted px-2 py-0.5 rounded-full">
              {sub.route}
            </span>
          )}
        </div>
        <LuChevronDown
          size={16}
          className={`text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-bg-subtle/60">
          <p className="text-sm text-text-muted pt-3 leading-relaxed">{sub.description}</p>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Funcionalidades</p>
            <ul className="space-y-1.5">
              {sub.features.map((feature, i) => (
                <FeatureItem key={i} text={feature} />
              ))}
            </ul>
          </div>

          {sub.tips && sub.tips.length > 0 && (
            <div className="bg-warning/5 border border-warning/20 rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-warning mb-1.5 flex items-center gap-1.5">
                <LuLightbulb size={11} /> Consejos
              </p>
              <ul className="space-y-1">
                {sub.tips.map((tip, i) => (
                  <TipItem key={i} text={tip} />
                ))}
              </ul>
            </div>
          )}

          {sub.warnings && sub.warnings.length > 0 && (
            <div className="bg-danger/5 border border-danger/20 rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-danger mb-1.5 flex items-center gap-1.5">
                <LuCircleAlert size={11} /> Advertencias
              </p>
              <ul className="space-y-1">
                {sub.warnings.map((warning, i) => (
                  <WarningItem key={i} text={warning} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const { tenant } = useConfigStore();
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const systemIsRestaurant = isRestaurant(tenant?.system);
  const systemIsProducts = isProducts(tenant?.system);

  const visibleSections = useMemo(() => {
    return SECTIONS
      .filter((s) => {
        if (s.id === 'restaurant') return systemIsRestaurant;
        return true;
      })
      .map((s) => {
        if (s.id !== 'orders') return s;
        return {
          ...s,
          subsections: s.subsections.filter((sub) => {
            if (sub.id === 'orders-products') return systemIsProducts;
            if (sub.id === 'orders-restaurant') return systemIsRestaurant;
            return true;
          }),
        };
      });
  }, [systemIsRestaurant, systemIsProducts]);

  const currentSection = useMemo(
    () => visibleSections.find((s) => s.id === activeSection) ?? visibleSections[0],
    [activeSection, visibleSections]
  );

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return visibleSections;
    const term = searchTerm.toLowerCase();
    return visibleSections.map((section) => ({
      ...section,
      subsections: section.subsections.filter(
        (sub) =>
          sub.title.toLowerCase().includes(term) ||
          sub.description.toLowerCase().includes(term) ||
          sub.features.some((f) => f.toLowerCase().includes(term))
      ),
    })).filter((s) => s.subsections.length > 0 || s.label.toLowerCase().includes(term));
  }, [searchTerm, visibleSections]);

  const isSearching = searchTerm.trim().length > 0;

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (!isSearching) {
      const ref = sectionRefs.current[activeSection];
      if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection, isSearching]);

  return (
    <div className="bg-bg-base min-h-screen pb-8">
      <div className="px-4 py-3 border-b border-bg-subtle bg-bg-content">
        <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2.5">
            <LuBookOpen size={20} className="text-primary" />
            <h1 className="text-lg font-extrabold uppercase text-primary tracking-wide">
              Guía de Ayuda
            </h1>
          </div>
          <div className="relative w-full max-w-xs">
            <LuSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar en la guía..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input !pl-8 pr-3 py-1.5 text-sm w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-danger"
              >
                <LuX size={13} />
              </button>
            )}
          </div>
          <button
            className="md:hidden shrink-0 p-2 rounded-lg border border-bg-subtle text-text-muted hover:bg-bg-subtle"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <LuSlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto flex gap-0 md:gap-6 px-0 md:px-4 pt-4">
        <aside
          className={`
            fixed md:static inset-0 z-30 md:z-auto bg-bg-base/95 md:bg-transparent
            transition-transform duration-300 md:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            w-64 shrink-0
          `}
        >
          <div className="md:sticky md:top-4 bg-bg-content border border-bg-subtle rounded-lg overflow-hidden">
            <div className="px-3 py-2.5 border-b border-bg-subtle flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Módulos</p>
              <button
                className="md:hidden text-text-muted hover:text-danger"
                onClick={() => setSidebarOpen(false)}
              >
                <LuX size={15} />
              </button>
            </div>
            <nav className="py-1">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                    activeSection === section.id && !isSearching
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-base hover:bg-bg-subtle'
                  }`}
                >
                  <span className={section.color}>{section.icon}</span>
                  <span className="truncate">{section.label}</span>
                  {activeSection === section.id && !isSearching && (
                    <LuChevronRight size={13} className="ml-auto text-primary" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 px-4 md:px-0 space-y-6">
          {isSearching ? (
            <>
              {filteredSections.length === 0 ? (
                <div className="text-center py-16 text-text-muted">
                  <LuSearch size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No se encontraron resultados para <strong>&ldquo;{searchTerm}&rdquo;</strong></p>
                </div>
              ) : (
                filteredSections.map((section) => (
                  <div key={section.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={section.color}>{section.icon}</span>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">
                        {section.label}
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {section.subsections.map((sub) => (
                        <SubsectionCard key={sub.id} sub={sub} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <div
              ref={(el) => { sectionRefs.current[currentSection.id] = el; }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className={`${currentSection.color} text-xl`}>{currentSection.icon}</span>
                <h2 className="text-xl font-extrabold uppercase tracking-wide text-primary">
                  {currentSection.label}
                </h2>
                <span className="text-xs text-text-muted bg-bg-subtle px-2 py-0.5 rounded-full">
                  {currentSection.subsections.length} {currentSection.subsections.length === 1 ? 'sección' : 'secciones'}
                </span>
              </div>

              <div className="space-y-3">
                {currentSection.subsections.map((sub) => (
                  <SubsectionCard key={sub.id} sub={sub} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <LuLightbulb size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-primary mb-1">¿Necesita más ayuda?</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Si tiene dudas que no están cubiertas en esta guía, contacte a su administrador del sistema
                  o al equipo de soporte técnico. Describa detalladamente el módulo y la acción que está intentando realizar.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
