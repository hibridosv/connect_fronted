import { LuBuilding2, LuCreditCard, LuMessageCircle, LuPackage, LuSettings, LuShield, LuUserCog } from 'react-icons/lu';
import { HelpSection } from './types';

export const configuraciones: HelpSection = {
  id: 'configuraciones',
  label: 'Configuraciones',
  icon: <LuSettings size={16} />,
  color: 'text-text-muted',
  description: 'Ajustes del negocio: funciones activadas, catálogos de productos, usuarios, permisos, sucursales, pagos del servicio y chatbot.',
  subsections: [
    {
      id: 'config-principal',
      title: 'Principal',
      icon: <LuSettings size={18} />,
      route: '/settings/general',
      menu: 'Configuraciones › Principal',
      description: 'Enciende o apaga las funciones del sistema para todo el negocio.',
      guides: [
        {
          title: 'Activar o desactivar una función',
          steps: [
            'Elija la categoría: Sistema, Configuraciones, Inventario, Ventas, Facturación o Impresiones.',
            'Busque la función en la lista (por ejemplo, descuentos, venta especial, cotizaciones, lotes o vencimientos).',
            'Haga clic en su interruptor. El cambio se guarda al instante ("Actualizando...").',
          ],
        },
      ],
      tips: [
        'Muchas opciones de esta guía (Asignar Vendedor, Otras Ventas, Multiprecio, Notas de Remisión, etc.) solo aparecen si están activadas aquí.',
        'Los usuarios pueden necesitar recargar la página para ver los cambios.',
      ],
    },
    {
      id: 'config-productos',
      title: 'Productos',
      icon: <LuPackage size={18} />,
      route: '/settings/products',
      menu: 'Configuraciones › Productos',
      description: 'Catálogos y ajustes que usan los productos, la venta y los créditos.',
      features: [
        'Categorías: categorías principales y subcategorías de productos.',
        'Unidades de Medida: unidades disponibles para los productos.',
        'Marcas: con proveedor opcional (si el negocio usa marcas).',
        'Ubicaciones: lugares físicos donde se guardan los productos (si el negocio usa ubicaciones).',
        'Documentos: tipos de documento del negocio, si son electrónicos o imprimibles, y su estado. Desde aquí se pueden deshabilitar.',
        'Cajas de Cobro: cajas registradas con su apertura y estado.',
        'Créditos (con permiso): días del crédito libre, si se permiten créditos por cuotas, frecuencias permitidas (diaria, semanal, cada 15 días, mensual), número máximo de cuotas, tipo de interés, mora y plantillas de plan.',
      ],
      guides: [
        {
          title: 'Configurar los créditos por cuotas',
          steps: [
            'Elija la opción "Créditos".',
            'Indique los días de vencimiento del crédito libre.',
            'Active el crédito por cuotas y marque las frecuencias permitidas y el límite de cuotas.',
            'Elija el interés: Sin interés, Simple (sobre el monto inicial) o Sobre saldo.',
            'Elija la mora: Sin mora, Monto fijo por cuota vencida o Porcentaje de la cuota vencida, y los días de gracia.',
            'Opcional: cree plantillas (por ejemplo, "6 meses") con frecuencia y número de cuotas para elegirlas rápido al cobrar.',
          ],
        },
      ],
      tips: [
        'El interés, la mora y la regla de domingos se copian al crédito al otorgarlo: los cambios solo afectan créditos nuevos.',
      ],
    },
    {
      id: 'config-usuarios',
      title: 'Usuarios',
      icon: <LuUserCog size={18} />,
      route: '/settings/users',
      menu: 'Configuraciones › Usuarios',
      description: 'Crea y administra las cuentas de las personas que usan el sistema.',
      guides: [
        {
          title: 'Crear un usuario',
          steps: [
            'En "Ingresar Usuario" escriba el nombre, el email y la contraseña (dos veces).',
            'Elija el tipo de usuario: Gerencia, Administración, Cajero o Contador.',
            'Opcional (Gerencia y Administración): número de WhatsApp para usar el chatbot.',
            'Guarde. El usuario aparece en el "Listado de Usuarios".',
          ],
        },
        {
          title: 'Modificar un usuario',
          steps: [
            'En el listado (filtre "Activos" o "Todos"), abra el menú del usuario.',
            'Elija "Editar" (nombre y WhatsApp), "Cambiar password", "Cambiar rol" o "Eliminar".',
          ],
        },
      ],
    },
    {
      id: 'config-permisos',
      title: 'Permisos de Usuario',
      icon: <LuShield size={18} />,
      route: '/settings/permissions',
      menu: 'Configuraciones › Permisos de Usuario',
      description: 'Define qué puede hacer cada rol. Los permisos se aplican a todos los usuarios de ese rol.',
      guides: [
        {
          title: 'Cambiar los permisos de un rol',
          steps: [
            'Elija el rol en "Roles".',
            'Espere a que cargue la lista ("Obteniendo permisos...").',
            'Active o desactive cada permiso. El cambio se guarda al instante.',
          ],
        },
      ],
      warnings: [
        'Quitar un permiso del rol al que pertenece su propio usuario no es reversible desde su sesión: podría perder acceso a esta pantalla.',
      ],
    },
    {
      id: 'config-sucursales',
      title: 'Sucursales',
      icon: <LuBuilding2 size={18} />,
      route: '/settings/branches',
      menu: 'Configuraciones › Sucursales',
      description: 'Información del negocio y de las sucursales vinculadas, que permiten transferencias y cambio rápido de sistema.',
      features: [
        'INFORMACION: nombre, responsable, documento, teléfono, email, dirección y país de cada sucursal.',
        'CAMBIAR SISTEMA: entra a otra sucursal vinculada ingresando su contraseña.',
        'VINCULAR SISTEMA (solo usuario root): vincula una nueva sucursal.',
      ],
    },
    {
      id: 'config-pagos',
      title: 'Pagos',
      icon: <LuCreditCard size={18} />,
      route: '/settings/payments',
      menu: 'Configuraciones › Pagos',
      description: 'Facturas del servicio de Pulse y formas de pagarlas.',
      guides: [
        {
          title: 'Pagar una factura del servicio',
          steps: [
            'Revise el "SALDO PENDIENTE" y las "ULTIMAS FACTURAS" (haga clic en una para ver su detalle).',
            'Para pagar con tarjeta, haga clic en "Pagar factura": se genera un enlace de pago seguro (Wompi, Banco Agrícola).',
            'Para pagar por transferencia, use el número de cuenta indicado e incluya el concepto mostrado para identificar su factura.',
          ],
        },
      ],
    },
    {
      id: 'config-chatbot',
      title: 'Chatbot',
      icon: <LuMessageCircle size={18} />,
      route: '/settings/chatbot',
      menu: 'Configuraciones › Chatbot',
      description: 'Consulte su negocio por WhatsApp: ventas, estadísticas, inventario, finanzas, impuestos, DTE, catálogo, compras, diagnóstico y gráficas.',
      guides: [
        {
          title: 'Vincular su WhatsApp',
          steps: [
            'Escriba su número de WhatsApp y guárdelo.',
            'Escanee el código desde su celular o use "Escribir desde la web" para abrir el chat.',
            'Escriba su pregunta, por ejemplo "¿Cuánto vendí hoy?".',
            'Para usar otro número, haga clic en "Cambiar número".',
          ],
        },
      ],
      tips: [
        'El chatbot solo responde a números vinculados a un usuario del sistema, por seguridad.',
      ],
    },
  ],
};
