import { LuBell, LuCompass, LuKeyRound, LuLogIn, LuMenu, LuRoute, LuShieldCheck } from 'react-icons/lu';
import { HelpSection } from './types';

export const inicio: HelpSection = {
  id: 'inicio',
  label: 'Primeros pasos',
  icon: <LuCompass size={16} />,
  color: 'text-primary',
  description: 'Lo básico para empezar a trabajar en Pulse: cómo entrar, moverse por el sistema y entender los permisos y códigos de autorización.',
  subsections: [
    {
      id: 'inicio-login',
      title: 'Iniciar y cerrar sesión',
      icon: <LuLogIn size={18} />,
      description: 'Cada persona entra con su propio usuario. Lo que puede ver y hacer depende del rol y los permisos que le asignó el administrador.',
      guides: [
        {
          title: 'Entrar al sistema',
          steps: [
            'Abra la dirección de Pulse en su navegador.',
            'En "Usuario" escriba su nombre de usuario o su email.',
            'En "Contraseña" escriba su contraseña y presione Enter o el botón para iniciar sesión.',
            'Espere el mensaje "Preparando tu espacio de trabajo...". El sistema lo lleva a la pantalla de ventas o al panel principal, según su rol.',
          ],
        },
        {
          title: 'Cerrar sesión',
          steps: [
            'Haga clic en el icono de menú (tres líneas) en la esquina superior izquierda.',
            'Al final del menú lateral haga clic en "Cerrar Sesión".',
          ],
        },
      ],
      tips: [
        'Si comparte la computadora con otros cajeros, cierre sesión al terminar su turno: todas las ventas quedan registradas a nombre del usuario que inició sesión.',
        'Si olvidó su contraseña, pida al administrador que la cambie desde Configuraciones › Usuarios.',
      ],
    },
    {
      id: 'inicio-navegacion',
      title: 'Moverse por el sistema',
      icon: <LuMenu size={18} />,
      description: 'La barra superior siempre está visible y desde el menú lateral se llega a todos los módulos.',
      features: [
        'Icono de menú (izquierda): abre el menú lateral con todos los módulos a los que tiene acceso. Al final del menú puede cambiar el tema (claro u oscuro) y cerrar sesión.',
        'Centro de la barra: su nombre de usuario y el nombre del negocio o sucursal en la que está trabajando.',
        'Campana: notificaciones del sistema (avisos, mantenimientos programados, novedades). Puede marcarlas todas como leídas.',
        'Lupa (solo negocios de productos): busca rápidamente un producto por código o descripción y muestra su precio, existencia y detalles sin salir de la pantalla en la que está.',
        'Casa: lo regresa directamente a la pantalla de ventas.',
        'Punto blanco parpadeante: aparece cuando hay una factura del servicio pendiente de pago; al hacer clic lo lleva a Configuraciones › Pagos.',
        'Flecha circular: aparece si no se pudo cargar la configuración del negocio; haga clic para recargar.',
      ],
      tips: [
        'Si una opción del menú no le aparece, es porque su usuario no tiene el permiso o porque la función no está activada para su negocio.',
        'Las tablas largas tienen paginación al pie; los botones "DESCARGAS" generan el mismo reporte en PDF o Excel.',
      ],
    },
    {
      id: 'inicio-permisos',
      title: 'Permisos y funciones activadas',
      icon: <LuShieldCheck size={18} />,
      description: 'Pulse se adapta a cada negocio. Hay dos cosas que deciden qué ve cada usuario: los permisos de su rol y las funciones activadas en la configuración del negocio.',
      features: [
        'Permisos: se asignan por rol (Gerencia, Administración, Cajero, Contador) en Configuraciones › Permisos de Usuario. Controlan qué módulos y acciones puede usar cada persona.',
        'Funciones activadas: se encienden o apagan en Configuraciones › Principal. Por ejemplo, descuentos, venta especial, cotizaciones, vendedor, repartidor, multiprecio, lotes o vencimientos.',
        'Tipo de sistema: un negocio de productos vende desde una búsqueda de productos; un restaurante vende desde un menú con mesas, delivery y pantalla de cocina.',
      ],
      tips: [
        'Esta guía describe todas las funciones. Si algo de lo que lee aquí no le aparece, consulte con el administrador si está activado para su negocio o su usuario.',
      ],
    },
    {
      id: 'inicio-codigos',
      title: 'Códigos de autorización',
      icon: <LuKeyRound size={18} />,
      description: 'Algunas acciones delicadas (cambiar precios, aplicar descuentos, eliminar productos de una orden, otras ventas, cambiar el tipo de precio) pueden requerir un código que da el administrador.',
      guides: [
        {
          title: 'Usar una acción que pide código (cajero)',
          steps: [
            'Haga clic en la acción que desea realizar (por ejemplo, el precio de un producto en la orden).',
            'Si aparece la ventana "Autorización requerida", el sistema ya envió la solicitud al administrador.',
            'Pida el código al administrador. Tiene 15 minutos para ingresarlo.',
            'Escriba el código en la casilla y haga clic en "Acceder". La acción se abre normalmente.',
          ],
        },
        {
          title: 'Entregar un código (administrador)',
          steps: [
            'Vaya a Panel Principal. Si hay solicitudes pendientes, el botón "Código" muestra un número rojo.',
            'Haga clic en "Código" para ver los códigos activos.',
            'Copie el código con el botón de copiar y compártalo con el cajero.',
            'Si quiere que el cajero pueda usarlo varias veces, haga clic en "+15 min": el código se vuelve reutilizable hasta que venza.',
          ],
        },
      ],
      tips: [
        'Cada código es de un solo uso y vence a los 15 minutos, salvo que el administrador lo extienda.',
        'El candado junto al tipo de precio indica si cambiarlo requiere código (rojo) o no (verde).',
      ],
    },
    {
      id: 'inicio-flujo',
      title: 'Flujo de trabajo diario recomendado',
      icon: <LuRoute size={18} />,
      description: 'El orden típico de un día de trabajo en Pulse, de la apertura al cierre.',
      guides: [
        {
          title: 'Un día normal de trabajo',
          steps: [
            'Abra su caja en Control de cajas e ingrese el efectivo con el que inicia.',
            'Venda desde la pantalla de ventas (icono de casa). Sin caja abierta no se puede cobrar.',
            'Registre los gastos pagados con dinero de la caja en Efectivo › Registro de Gastos.',
            'Si retira efectivo para depositarlo, regístrelo en Efectivo › Remesas de Efectivo.',
            'Reciba los abonos de clientes con crédito en Cuentas › Cuentas por cobrar.',
            'Al terminar el turno, cuente el efectivo y cierre la caja en Control de cajas ingresando el monto contado.',
            'Revise el corte en Historiales › Cortes de Caja para verificar si hubo diferencia.',
          ],
        },
      ],
    },
    {
      id: 'inicio-avisos',
      title: 'Avisos de la cuenta',
      icon: <LuBell size={18} />,
      description: 'En algunos casos, al entrar el sistema muestra una pantalla de aviso antes de continuar.',
      features: [
        'Novedades del sistema: muestra las mejoras nuevas después de una actualización. Haga clic en "Continuar al sistema".',
        'Facturación pendiente de pago: hay pagos pendientes del servicio. El sistema sigue funcionando, pero algunas funciones (emisión de documentos, historiales y reportes) pueden quedar limitadas. Puede "Realizar Pago" o "Continuar".',
        'Suspensión inminente: el sistema está por suspenderse por facturas vencidas. Muestra las facturas pendientes y permite pagar o continuar.',
        'Servicio suspendido: no se puede usar el sistema hasta pagar. Haga clic en "Realizar Pago"; al pagar, la cuenta se restablece de inmediato.',
        'Sistema en mantenimiento: se están haciendo mejoras. Espere unos minutos y haga clic en "Reintentar".',
      ],
    },
  ],
};
