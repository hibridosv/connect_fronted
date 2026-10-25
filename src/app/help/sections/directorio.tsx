import { LuChartBar, LuUsers } from 'react-icons/lu';
import { HelpSection } from './types';

export const directorio: HelpSection = {
  id: 'directorio',
  label: 'Directorio',
  icon: <LuUsers size={16} />,
  color: 'text-info',
  description: 'Clientes, proveedores, repartidores y referidos del negocio.',
  subsections: [
    {
      id: 'directorio-contactos',
      title: 'Contactos',
      icon: <LuUsers size={18} />,
      route: '/contacts/search',
      menu: 'Directorio › Contactos (o Clientes, Repartidores, Proveedores, Referidos)',
      description: 'Lista de contactos con búsqueda. Las opciones Clientes, Repartidores, Proveedores y Referidos del menú muestran solo ese tipo.',
      features: [
        'Menú de cada contacto: Ver Contacto, Ver Dashboard, Editar y Eliminar.',
        'Cantidad de contactos y descargas de la lista.',
        'El contacto predeterminado del sistema (consumidor final) solo permite cambiar su nombre.',
      ],
      guides: [
        {
          title: 'Registrar un cliente para Crédito Fiscal',
          steps: [
            'Haga clic en "Agregar Contacto".',
            'Marque el tipo: Cliente (puede marcar también Proveedor, Repartidor o Referido).',
            'Escriba el nombre completo, número de documento, teléfono, dirección y email.',
            'En "Datos de contribuyente" complete nombre del contribuyente, documento (NIT), registro (NRC), actividad económica (búsquela por código o nombre), departamento y municipio.',
            'Elija el tipo de contribuyente (Contribuyente o Gran Contribuyente) y, si aplica, marque "Cliente Exento".',
            'Opcional: límite de crédito (vacío es sin límite), "Bloquear Credito al cliente" y vendedor asignado.',
            'Para clientes del exterior use "+ Agregar datos de exportación" (régimen, recinto fiscal y país).',
            'Guarde.',
          ],
        },
        {
          title: 'Editar o eliminar un contacto',
          steps: [
            'Busque el contacto y abra su menú.',
            'Elija "Editar", cambie los datos y guarde; o "Eliminar" y confirme.',
          ],
        },
      ],
      tips: [
        'También puede registrar un cliente desde la pantalla de ventas: Opciones › Asignar Cliente › "Registrar Cliente".',
        'Los campos del formulario cambian según el país del negocio (por ejemplo NIT en Guatemala o RTN en Honduras).',
      ],
    },
    {
      id: 'directorio-dashboard',
      title: 'Dashboard del contacto',
      icon: <LuChartBar size={18} />,
      menu: 'Directorio › Contactos › menú del contacto › Ver Dashboard',
      description: 'Resumen comercial de un cliente para conocer sus hábitos de compra.',
      features: [
        'Selector de período para todas las cifras.',
        'Indicadores: total comprado, compras, ticket promedio, unidades, última compra, frecuencia, cliente desde y producto favorito.',
        'Gráfico de compras por mes y los 10 productos más comprados.',
        'Historial de compras: haga clic en un documento para ver su detalle.',
        'Devoluciones: notas de crédito, eventos de retorno y ventas anuladas.',
        'Crédito: saldo pendiente, vencido, límite y disponible, con acceso a cuentas por cobrar.',
      ],
    },
  ],
};
