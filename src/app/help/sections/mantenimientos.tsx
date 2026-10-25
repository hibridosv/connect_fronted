import { LuClipboardList, LuPlus, LuSettings, LuWrench } from 'react-icons/lu';
import { HelpSection } from './types';

export const mantenimientos: HelpSection = {
  id: 'mantenimientos',
  label: 'Mantenimientos',
  icon: <LuWrench size={16} />,
  color: 'text-warning',
  description: 'Órdenes de servicio o reparación (vehículos, equipos, etc.) con técnico, estados, imágenes y factura asociada.',
  subsections: [
    {
      id: 'mantenimientos-tipos',
      title: 'Tipos de Mantenimiento',
      icon: <LuSettings size={18} />,
      route: '/maintenance/types',
      menu: 'Mantenimientos › Tipos de Mantenimiento',
      description: 'Define los servicios que ofrece (por ejemplo, "Cambio de aceite") y los campos extra que se piden en cada orden.',
      guides: [
        {
          title: 'Crear un tipo de mantenimiento',
          steps: [
            'Haga clic en el botón para agregar tipo.',
            'Escriba el nombre y una descripción breve.',
            'En "Campos del formulario" haga clic en "Agregar campo" por cada dato que necesite (por ejemplo, "Kilometraje actual"): etiqueta, nombre interno, tipo y opciones. Marque "Campo obligatorio" si no puede quedar vacío.',
            'Guarde. Los campos aparecerán al crear una orden de este tipo.',
          ],
        },
      ],
    },
    {
      id: 'mantenimientos-nueva',
      title: 'Nueva Orden',
      icon: <LuPlus size={18} />,
      route: '/maintenance/new',
      menu: 'Mantenimientos › Nueva Orden',
      description: 'Registra la recepción de un bien para mantenimiento, en dos pasos.',
      guides: [
        {
          title: 'Recibir un bien para mantenimiento',
          steps: [
            'Paso "Cliente y tipo": busque el cliente y elija el tipo de mantenimiento. A la derecha verá el historial de órdenes anteriores del cliente. Haga clic en "Continuar".',
            'Paso "Detalles": describa el bien o activo (por ejemplo, "Toyota Corolla 2018 - Placa P123-456"), asigne el técnico y escriba la descripción del problema.',
            'Complete los campos adicionales del tipo de mantenimiento.',
            'Revise el resumen y guarde. Use "Atrás" para corregir el paso anterior.',
          ],
        },
      ],
    },
    {
      id: 'mantenimientos-ordenes',
      title: 'Órdenes de Mantenimiento',
      icon: <LuClipboardList size={18} />,
      route: '/maintenance',
      menu: 'Mantenimientos › Órdenes de Mantenimiento',
      description: 'Lista de órdenes con pestañas por estado, filtro por tipo y búsqueda por bien o activo.',
      guides: [
        {
          title: 'Dar seguimiento a una orden',
          steps: [
            'Busque la orden y abra su menú › "Ver Orden".',
            'Use "Cambiar estado" para avanzarla; agregue un comentario opcional. Cada cambio queda en el "Historial de Estados".',
            'En "Detalles de la orden" › "Editar" registre el diagnóstico, la solución y el total.',
            'En "Imágenes" agregue fotos (JPG, PNG o WEBP de hasta 3 MB) con su descripción, por ejemplo del estado al ingresar.',
            'Cuando el cliente pague, use "Asociar factura": escriba el número de factura pagada del cliente y búsquela.',
          ],
        },
      ],
      warnings: [
        'Eliminar una orden borra también sus imágenes y su historial de estados.',
      ],
    },
  ],
};
