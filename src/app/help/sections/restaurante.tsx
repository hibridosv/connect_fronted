import { LuClipboardList, LuMonitor, LuPackageMinus, LuPackagePlus, LuUtensilsCrossed } from 'react-icons/lu';
import { HelpSection } from './types';

export const restaurante: HelpSection = {
  id: 'restaurante',
  label: 'Restaurante',
  icon: <LuUtensilsCrossed size={16} />,
  color: 'text-warning',
  system: 'restaurant',
  description: 'Administración del menú, la pantalla de cocina y el seguimiento de las órdenes del restaurante.',
  subsections: [
    {
      id: 'restaurante-nuevo',
      title: 'Registrar Producto',
      icon: <LuPackagePlus size={18} />,
      route: '/restaurant/new',
      menu: 'Restaurante › Registrar Producto',
      description: 'Crea un producto del menú con su precio, categoría, modificadores, estación de cocina e imagen.',
      guides: [
        {
          title: 'Agregar un platillo o bebida al menú',
          steps: [
            'Escriba el "Nombre del producto".',
            'Ingrese el "Precio de costo" y el "Precio de venta".',
            'Haga clic en "Categoria (Click para agregar)" y elija la categoría donde aparecerá en el menú. Si no existe, créela desde esa misma ventana.',
            'Si el producto lleva opciones (término, salsa, tamaño), haga clic en "Modificadores (Click para agregar)" y elíjalos.',
            'En "Espacio de trabajo" elija la estación de cocina que lo prepara (cocina, bar, etc.) o "Ninguno" si no pasa por cocina.',
            'Haga clic en "Seleccionar Imagen" y elija el icono o imagen que verá el cajero.',
            'Opcional: escriba información adicional y haga clic en "Registrar Producto".',
          ],
        },
      ],
    },
    {
      id: 'restaurante-menu',
      title: 'Productos de Menú',
      icon: <LuUtensilsCrossed size={18} />,
      route: '/restaurant/menu',
      menu: 'Restaurante › Productos de Menu',
      description: 'Lista de todos los productos del menú y administración de categorías y modificadores.',
      features: [
        'Tabla con imagen, nombre, categoría, modificadores, panel (estación), precio y costo. Los productos inhabilitados se indican.',
        'Menú de cada producto: Cambiar Precio, Cambiar Costo, Cambiar Nombre, Cambiar Modificadores, Cambiar Categorias, Cambiar Panel, Cambiar Imagen, Productos a descontar y Eliminar Producto.',
        'Productos a descontar: indica qué productos del inventario se descuentan al vender el platillo (receta).',
        'Botones "Modificadores" y "Categorias": abren la administración de cada uno.',
        'Botón "Ordenar iconos": cambia el orden en que aparecen las categorías y productos en la pantalla de ventas.',
      ],
      guides: [
        {
          title: 'Crear un modificador con variantes',
          steps: [
            'Haga clic en "Modificadores".',
            'Escriba el "Nombre del modificador" (por ejemplo, "Término de la carne") y guárdelo.',
            'Abra el modificador y agregue sus variantes con nombre, precio (0 si no tiene costo extra) e imagen.',
            'Asigne el modificador a los productos con "Cambiar Modificadores".',
          ],
        },
        {
          title: 'Reordenar los iconos del menú',
          steps: [
            'Haga clic en "Ordenar iconos".',
            'Seleccione una categoría (o "Principal" para el orden de las categorías).',
            'Arrastre los iconos al orden deseado y guarde. Use "Regresar" para volver.',
          ],
        },
      ],
      warnings: [
        'Eliminar un producto no se puede deshacer.',
      ],
    },
    {
      id: 'restaurante-pantalla-cocina',
      title: 'Pantalla de cocina',
      icon: <LuMonitor size={18} />,
      route: '/restaurant/screen',
      menu: 'Restaurante › Pantalla',
      description: 'Muestra en tiempo real las comandas que se envían al guardar o cobrar órdenes. Pensada para una pantalla en la cocina o el bar.',
      features: [
        'Cada tarjeta muestra el número de orden, la mesa o el cliente, la hora y el tiempo de espera, el comentario, los productos con sus opciones, quién atiende y el tipo de entrega.',
        'Botones de estación (abajo a la derecha): filtran las comandas de cocina, bar u otra estación.',
        'Tarjetas "ELIMINADA": la orden se eliminó después de enviarse.',
      ],
      guides: [
        {
          title: 'Despachar comandas',
          steps: [
            'Elija su estación con los botones de abajo a la derecha.',
            'Al terminar un producto, tóquelo para marcarlo como despachado.',
            'Para despachar toda la orden de una vez, toque el encabezado de la tarjeta.',
            'Si la orden tiene productos de varias estaciones (candado junto al número), cada estación debe despachar sus productos por separado.',
          ],
        },
      ],
    },
    {
      id: 'restaurante-ordenes',
      title: 'Listado de Órdenes',
      icon: <LuClipboardList size={18} />,
      route: '/restaurant/orders',
      menu: 'Restaurante › Listado de Ordenes',
      description: 'Las órdenes del día con su estado, para dar seguimiento al servicio.',
      features: [
        'Datos generales: órdenes pendientes, servicio en mesa y delivery.',
        'Tabla de órdenes: número, clientes, quién atiende, servicio, si es para llevar, tiempo y estado (Activo, Guardado, Pagado, Anulado, Eliminada).',
        'Al hacer clic en una orden se ve su detalle: cliente, quién atendió, productos, descuentos y total. La propina no se incluye en el total.',
      ],
    },
    {
      id: 'restaurante-eliminados',
      title: 'Productos Eliminados',
      icon: <LuPackageMinus size={18} />,
      route: '/restaurant/deleted',
      menu: 'Restaurante › Productos Eliminados',
      description: 'Registro de los productos quitados de las órdenes, para controlar pérdidas o abusos.',
      guides: [
        {
          title: 'Revisar productos eliminados',
          steps: [
            'En "Seleccionar fechas" elija el rango y haga clic en "Aplicar".',
            'Revise fecha, hora, orden, cantidad, producto, total, usuario y quién lo eliminó.',
            'Al pie se ven el total de productos y el monto eliminado. Use "DESCARGAS" para exportar.',
          ],
        },
      ],
    },
  ],
};
