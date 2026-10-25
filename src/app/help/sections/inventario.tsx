import { LuCalendarClock, LuHistory, LuLink2, LuPackage, LuPackageMinus, LuPackagePlus, LuPencil, LuPlus, LuTrendingDown } from 'react-icons/lu';
import { HelpSection } from './types';

export const inventario: HelpSection = {
  id: 'inventario',
  label: 'Inventario',
  icon: <LuPackage size={16} />,
  color: 'text-success',
  description: 'Registro de productos, ingresos de compras, salidas por averías u otros motivos, existencias y kardex.',
  subsections: [
    {
      id: 'inventario-lista',
      title: 'Ver Productos',
      icon: <LuPackage size={18} />,
      route: '/products',
      menu: 'Inventario › Ver Productos',
      description: 'El catálogo completo con precios, existencias, categoría, ubicación y marca.',
      features: [
        'Búsqueda por código o descripción.',
        'Estadísticas: total de registros, productos, servicios y relacionados.',
        'Menú de cada producto: Ver Producto, Actualizar Precios, Editar, Kardex y Eliminar (según permisos).',
        'Descargas (con permiso): listas del inventario en PDF o Excel, y "ACTUALIZAR PRECIOS" para recalcular la lista de precios.',
      ],
      guides: [
        {
          title: 'Configurar varios precios a un producto',
          steps: [
            'Busque el producto y abra su menú › "Actualizar Precios".',
            'Escriba la cantidad mínima y el precio (por ejemplo, desde 10 unidades a $1.50).',
            'Si el negocio usa precio mayorista o de promoción, elija el tipo de precio.',
            'Guarde. Para quitar un precio use el botón de eliminar de su fila.',
          ],
        },
      ],
      warnings: [
        'Eliminar un producto lo quita del catálogo; verifique antes que no tenga existencias ni ventas pendientes.',
      ],
    },
    {
      id: 'inventario-nuevo',
      title: 'Registrar Producto',
      icon: <LuPlus size={18} />,
      route: '/products/new',
      menu: 'Inventario › Registrar Producto',
      description: 'Crea un producto, servicio o producto relacionado (compuesto por otros productos).',
      guides: [
        {
          title: 'Registrar un producto nuevo',
          steps: [
            'En "Tipo de Registro" elija Producto, Servicio o Relacionado.',
            'Escriba el "Codigo" (o escanéelo) y la "Descripción".',
            'Ingrese la "Cantidad" inicial, el "Minimo de Stock" (para las alertas de bajas existencias), el "Precio Costo" y el "Precio de venta".',
            'Elija si es Gravado o Exento de impuestos.',
            'Haga clic en "Categoria (Click para agregar)" y, si aplica, en Proveedor, Ubicación y Marca. Puede crearlos desde la misma ventana.',
            'Elija la "Unidad de Medida" y complete los campos opcionales activados para su negocio: medida, descuento y comisión por defecto, lote, fecha de vencimiento o "Solicitar Receta".',
            'Guarde. El producto aparece en "Ultimos Productos" a la derecha.',
          ],
        },
        {
          title: 'Registrar un producto relacionado (combo o kit)',
          steps: [
            'Elija "Relacionado" en "Tipo de Registro" y complete los datos del producto.',
            'Al guardar se abre "Productos vinculados": busque cada producto que forma el combo e indique la "Cantidad a vincular".',
            'Para cerrar la ventana debe tener al menos un producto vinculado. Al vender el combo se descuentan sus componentes.',
          ],
        },
      ],
    },
    {
      id: 'inventario-editar',
      title: 'Editar Producto',
      icon: <LuPencil size={18} />,
      menu: 'Inventario › Editar Producto',
      description: 'Modifica los datos de un producto existente y administra sus imágenes.',
      guides: [
        {
          title: 'Editar un producto',
          steps: [
            'Abra Inventario › Editar Producto y busque el producto por código o descripción.',
            'Haga clic en el producto para abrir el formulario "Editar Producto".',
            'Cambie los datos necesarios (descripción, mínimo de stock, costo, impuesto, categoría, proveedor, etc.) y guarde.',
            'Use "Editar Precios" para los precios de venta y la sección "Imágenes" para agregar fotos con su descripción.',
          ],
        },
      ],
      tips: [
        'También puede llegar aquí desde Ver Productos › menú del producto › Editar.',
      ],
    },
    {
      id: 'inventario-agregar',
      title: 'Agregar Productos (ingreso de compras)',
      icon: <LuPackagePlus size={18} />,
      route: '/products/add',
      menu: 'Inventario › Agregar Productos',
      description: 'Registra la entrada de mercadería al inventario, normalmente al recibir una compra. Opcionalmente registra la compra como gasto o como cuenta por pagar.',
      guides: [
        {
          title: 'Ingresar una compra al inventario',
          steps: [
            'Complete los datos del documento: número, tipo (Ninguno, Ticket, Factura, Crédito Fiscal), proveedor y comentario.',
            'Si pagó la compra con dinero de la caja o una cuenta, marque "Registrar como Gasto" y complete nombre, cantidad, tipo de pago y categoría.',
            'Si la compra es al crédito, marque "Crear Cuenta por Pagar" con su nombre y fecha de vencimiento.',
            'Marque "Sumar Impuestos" si los costos que ingresará no incluyen impuestos. Continúe.',
            'Busque cada producto, escriba la cantidad, el precio de costo y, si aplica, el lote y la fecha de vencimiento. Haga clic en "Añadir producto".',
            'Revise el "Resumen de la Compra" y la lista de productos agregados.',
            'Haga clic en "Guardar Todo" para aplicar el ingreso, o "Cancelar" para descartarlo.',
          ],
        },
      ],
      warnings: [
        'Si agrega un producto que ya estaba en el mismo ingreso, el sistema lo avisa: revise los lotes antes de continuar.',
        'El ingreso afecta el inventario y el costo promedio al guardar. Los errores de costo o lote se corrigen en Reportes › Productos Ingresados (con permiso).',
      ],
    },
    {
      id: 'inventario-descontar',
      title: 'Descontar Productos',
      icon: <LuPackageMinus size={18} />,
      route: '/products/remove',
      menu: 'Inventario › Descontar Productos',
      description: 'Registra salidas de inventario que no son ventas: averías, traslados, devoluciones, cambios u otros.',
      guides: [
        {
          title: 'Registrar una salida de inventario',
          steps: [
            'Elija el "Tipo de Salida": Avería, Traslado, Devolución, Cambio u Otros, y escriba un comentario.',
            'Busque el producto. Se muestran su código y existencia.',
            'Si el producto maneja lotes, elija el lote del que sale.',
            'Escriba la cantidad (no puede ser mayor a la existencia) y agréguelo.',
            'Repita con los demás productos y haga clic en "Guardar todo".',
          ],
        },
      ],
      features: [
        '"Ultimos Registros" muestra las salidas anteriores; haga clic en una para ver su detalle.',
      ],
    },
    {
      id: 'inventario-relacionados',
      title: 'Productos Relacionados',
      icon: <LuLink2 size={18} />,
      route: '/products/linked',
      menu: 'Inventario › Productos Relacionados',
      description: 'Lista de los productos compuestos (combos o kits) y de los productos que los forman.',
      guides: [
        {
          title: 'Revisar o cambiar los componentes de un combo',
          steps: [
            'Busque el producto relacionado.',
            'Haga clic en él para ver los "Productos Vinculados" con su cantidad.',
            'Agregue, cambie o quite componentes desde la ventana de productos vinculados.',
          ],
        },
      ],
    },
    {
      id: 'inventario-bajas',
      title: 'Bajas Existencias',
      icon: <LuTrendingDown size={18} />,
      route: '/products/stock',
      menu: 'Inventario › Bajas Existencias',
      description: 'Productos cuya existencia está en el mínimo de stock o por debajo. Úsela para preparar sus pedidos a proveedores.',
      tips: [
        'Configure el "Minimo de Stock" de cada producto al registrarlo o editarlo para que aparezca aquí a tiempo.',
      ],
    },
    {
      id: 'inventario-vencimientos',
      title: 'Próximos Vencimientos',
      icon: <LuCalendarClock size={18} />,
      route: '/products/expiring',
      menu: 'Inventario › Proximos Vencimientos',
      description: 'Lotes vencidos o próximos a vencer, con proveedor, cantidad, costo y fecha de expiración.',
      features: [
        'Estadísticas: total mostrado, expirados y próximos a expirar.',
        'Estado de cada lote: "Expirado" o "Por Expirar". Haga clic en un producto para ver sus detalles.',
      ],
      tips: [
        'Para vender primero un lote próximo a vencer, use el icono de lote en la orden de venta.',
      ],
    },
    {
      id: 'inventario-kardex',
      title: 'Kardex',
      icon: <LuHistory size={18} />,
      menu: 'Inventario › Kardex',
      description: 'Historial de todos los movimientos de un producto con entradas, salidas y saldo, valorizado por costo promedio ponderado.',
      guides: [
        {
          title: 'Consultar el kardex de un producto',
          steps: [
            'Abra Inventario › Kardex y busque el producto.',
            'Haga clic en el producto y elija el rango de fechas en "Busqueda".',
            'Revise cada movimiento: fecha, detalle, entradas, salidas y saldo (cantidad, costo y total).',
            'Haga clic en un movimiento para ver su origen: venta, ingreso, inventario inicial, avería, ajuste de inventario, retorno o transferencia.',
          ],
        },
      ],
    },
  ],
};
