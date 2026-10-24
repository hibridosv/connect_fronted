import { LuLayoutDashboard, LuMonitor } from 'react-icons/lu';
import { HelpSection } from './types';

export const panel: HelpSection = {
  id: 'panel',
  label: 'Panel y cajas',
  icon: <LuLayoutDashboard size={16} />,
  color: 'text-info',
  description: 'El resumen del negocio en tiempo real y la apertura y cierre de las cajas de cobro.',
  subsections: [
    {
      id: 'panel-dashboard',
      title: 'Panel Principal',
      icon: <LuLayoutDashboard size={18} />,
      route: '/dashboard',
      menu: 'Panel Principal',
      description: 'Vista general del negocio con los indicadores del día. Los datos se actualizan solos, sin recargar la página.',
      features: [
        'Tarjetas de indicadores (KPI) con las cifras principales del día.',
        'Ventas de la semana comparadas con la semana anterior.',
        'Métodos de pago: cómo se distribuyen los cobros del día (efectivo, tarjeta, transferencia, etc.).',
        'Movimientos del día: gráfico de ventas por hora, en tiempo real.',
        'Últimas órdenes: las transacciones más recientes con cliente, total, método y estado.',
        'Productos más vendidos del día.',
        'Cajas abiertas: ventas, gastos, órdenes, apertura y saldo de cada caja abierta.',
        'Botón "Código" (solo con permiso): muestra los códigos de autorización solicitados por los cajeros.',
      ],
      guides: [
        {
          title: 'Revisar cómo va el día',
          steps: [
            'Abra Panel Principal desde el menú.',
            'Revise las tarjetas superiores para ver el total vendido y los indicadores del día.',
            'Baje a "Movimientos del Día" para ver en qué horas se vende más.',
            'En "Cajas Abiertas" verifique cuánto efectivo debería haber en cada caja.',
          ],
        },
      ],
      tips: [
        'El indicador "Datos en tiempo real" confirma que el panel está recibiendo actualizaciones automáticas.',
      ],
    },
    {
      id: 'panel-cajas',
      title: 'Control de cajas',
      icon: <LuMonitor size={18} />,
      route: '/cashdrawers',
      menu: 'Control de cajas',
      description: 'Apertura y cierre de las cajas de cobro. Para cobrar ventas, registrar gastos o recibir abonos es obligatorio tener una caja abierta.',
      features: [
        'Cajas disponibles: cada caja muestra su estado. "Disponible" (verde) se puede abrir, "Aperturada" (azul) es la que usted tiene abierta y "Ocupada" (gris) la tiene abierta otro usuario.',
        'Últimos cortes: tabla con fecha de apertura y cierre, cajero y diferencia de cada corte. Puede filtrar "Todos" o "Míos".',
        'Detalle del corte: al hacer clic en un corte se ven las ventas en efectivo, total de ventas, gastos, remesas, cuentas por pagar y por cobrar, retenciones, propinas, efectivo en caja y diferencia.',
      ],
      guides: [
        {
          title: 'Abrir la caja al iniciar el turno',
          steps: [
            'Vaya a Control de cajas.',
            'Haga clic en una caja con estado "Disponible".',
            'En la ventana "Apertura de caja" escriba el efectivo con el que inicia (el fondo de caja).',
            'Haga clic en Guardar. La caja queda como "Aperturada" a su nombre y ya puede cobrar.',
          ],
        },
        {
          title: 'Cerrar la caja (hacer el corte)',
          steps: [
            'Cuente todo el efectivo que hay en la caja.',
            'Vaya a Control de cajas y haga clic en su caja "Aperturada".',
            'En la ventana de cierre escriba el efectivo contado y haga clic en Guardar.',
            'El sistema genera el corte y calcula la diferencia entre lo que debería haber y lo que usted contó.',
            'Revise el corte en la tabla "Últimos cortes" haciendo clic sobre él.',
          ],
        },
      ],
      tips: [
        'Una diferencia positiva indica que sobra efectivo; una negativa, que falta. Revise gastos, remesas o cobros que no se hayan registrado.',
        'Solo puede tener una caja abierta a la vez.',
      ],
      warnings: [
        'No cierre la caja con órdenes sin cobrar: las ventas que se cobren después quedarán en el siguiente corte.',
        'Si tiene facturas del servicio vencidas, aquí aparecerá el aviso "Facturas vencidas" con un acceso para consultarlas.',
      ],
    },
  ],
};
