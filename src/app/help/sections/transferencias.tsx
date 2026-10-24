import { LuArrowLeftRight, LuCircleCheckBig, LuClipboardList, LuSend } from 'react-icons/lu';
import { HelpSection } from './types';

export const transferencias: HelpSection = {
  id: 'transferencias',
  label: 'Transferencias',
  icon: <LuArrowLeftRight size={16} />,
  color: 'text-primary',
  description: 'Envío de productos entre sucursales vinculadas, con solicitud, envío y recepción.',
  subsections: [
    {
      id: 'transferencias-crear',
      title: 'Crear Transferencia',
      icon: <LuSend size={18} />,
      route: '/transfers/new',
      menu: 'Transferencias › Crear Transferencia',
      description: 'Envía productos de esta sucursal a otra.',
      guides: [
        {
          title: 'Enviar productos a otra sucursal',
          steps: [
            'En "Seleccionar destino" elija la sucursal y haga clic en "Transferir a esta sucursal".',
            'Busque cada producto, escriba la cantidad y guárdelo. Se agrega a "Productos Agregados".',
            'Corrija cantidades o elimine productos desde la tabla si hace falta.',
            'Haga clic en "Guardar" para dejarla pendiente o en "Enviar" para despacharla. "Cancelar" la descarta.',
            'Use el icono de descarga para obtener el PDF de la transferencia y enviarlo con la mercadería.',
          ],
        },
      ],
      tips: [
        'Las solicitudes que otras sucursales le hacen aparecen en "Últimas Transferencias": haga clic en una para preparar el envío con los productos solicitados.',
      ],
      warnings: [
        'Si no aparece ninguna sucursal, el negocio no tiene sucursales vinculadas (Configuraciones › Sucursales).',
      ],
    },
    {
      id: 'transferencias-aceptar',
      title: 'Aceptar Transferencia',
      icon: <LuCircleCheckBig size={18} />,
      route: '/transfers/accept',
      menu: 'Transferencias › Aceptar Transferencia',
      description: 'Recibe las transferencias que otras sucursales enviaron a esta. Los productos se suman al inventario al aceptarlos.',
      guides: [
        {
          title: 'Recibir una transferencia',
          steps: [
            'En "Últimas Transferencias" haga clic en "Ver detalles" de la transferencia recibida.',
            'Cuente la mercadería y compárela con la lista.',
            'Si algún producto no existe en su inventario, use el botón para crear su registro.',
            'Haga clic en "Aceptar todo" si todo está correcto, o en "Rechazar" en un producto específico. También puede rechazar toda la transferencia.',
          ],
        },
      ],
    },
    {
      id: 'transferencias-solicitar',
      title: 'Solicitar Transferencia',
      icon: <LuClipboardList size={18} />,
      route: '/transfers/request',
      menu: 'Transferencias › Solicitar Transferencia',
      description: 'Pide productos a otra sucursal. La otra sucursal ve la solicitud y la convierte en envío.',
      guides: [
        {
          title: 'Pedir productos a otra sucursal',
          steps: [
            'Elija la sucursal en "Enviar solicitud a".',
            'Busque los productos y escriba la cantidad de cada uno.',
            'Haga clic en "Enviar solicitud".',
          ],
        },
      ],
    },
    {
      id: 'transferencias-listado',
      title: 'Listado de Transferencias',
      icon: <LuArrowLeftRight size={18} />,
      route: '/transfers/list',
      menu: 'Transferencias › Listado de Transferencias',
      description: 'Historial de transferencias enviadas y recibidas, con filtros por sucursal y estado.',
      features: [
        'Filtros: sucursal, Todas / Enviadas / Recibidas y rango de fechas.',
        'Estados: Activo, Aceptado, Parcial, Rechazado, En Progreso, Solicitado, Guardado y Eliminado.',
        'Detalle: información general, trazabilidad (quién solicitó, envió, recibió o canceló y cuándo) y cantidades solicitadas, enviadas y aceptadas por producto.',
      ],
    },
  ],
};
