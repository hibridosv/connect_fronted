import { LuArrowLeftRight, LuArrowUpDown, LuBuilding2, LuHistory, LuReceipt, LuWallet } from 'react-icons/lu';
import { HelpSection } from './types';

export const efectivo: HelpSection = {
  id: 'efectivo',
  label: 'Efectivo',
  icon: <LuWallet size={16} />,
  color: 'text-warning',
  description: 'Movimientos de dinero fuera de las ventas: gastos, remesas, cuentas bancarias y transferencias entre cuentas.',
  subsections: [
    {
      id: 'efectivo-gastos',
      title: 'Registro de Gastos',
      icon: <LuReceipt size={18} />,
      route: '/cash/expenses',
      menu: 'Efectivo › Registro de Gastos',
      description: 'Registra los gastos del negocio. Los pagados en efectivo se restan de la caja abierta y aparecen en el corte.',
      guides: [
        {
          title: 'Registrar un gasto',
          steps: [
            'Verifique que tiene una caja abierta.',
            'Escriba el "Nombre del Gasto" y, si quiere, una descripción.',
            'Elija "Sin Comprobante" o "Con Comprobante". Con comprobante, indique el tipo (Ticket, Factura, Crédito Fiscal) y su número.',
            'Elija el tipo de pago. Si no es efectivo, seleccione la cuenta de la que salió el dinero.',
            'Elija la categoría de gasto (el botón + crea una nueva, por ejemplo "Oficina" o "Transporte").',
            'Escriba la cantidad y guarde.',
          ],
        },
        {
          title: 'Adjuntar la foto del comprobante',
          steps: [
            'En "Ultimos movimientos", haga clic en el icono de imagen del gasto.',
            'Seleccione una imagen JPG, PNG o WEBP y guárdela. Desde la misma ventana puede verla o eliminarla.',
          ],
        },
      ],
      features: [
        '"Ultimos movimientos" lista los gastos de "Hoy" o "Todos", con hora, descripción, cantidad y tipo de pago, y el total al pie.',
      ],
      warnings: [
        'Sin caja abierta aparece "Debe aperturar caja para agregar gastos".',
      ],
    },
    {
      id: 'efectivo-remesas',
      title: 'Remesas de Efectivo',
      icon: <LuArrowUpDown size={18} />,
      route: '/cash/remittances',
      menu: 'Efectivo › Remesas de Efectivo',
      description: 'Registra el efectivo que se retira de la caja para depositarlo en una cuenta bancaria o guardarlo en otro lugar.',
      guides: [
        {
          title: 'Registrar una remesa',
          steps: [
            'Con la caja abierta, escriba el "Nombre de la remesa".',
            'Elija la "Cuenta a transferir" donde se deposita el dinero.',
            'Escriba la cantidad y guarde. La remesa se resta del efectivo de la caja y se suma a la cuenta.',
          ],
        },
      ],
    },
    {
      id: 'efectivo-cuentas',
      title: 'Cuentas Bancarias',
      icon: <LuBuilding2 size={18} />,
      route: '/cash/bank-accounts',
      menu: 'Efectivo › Cuentas Bancarias',
      description: 'Las cuentas donde el negocio guarda su dinero: caja chica, cuentas de banco, chequeras y tarjetas.',
      guides: [
        {
          title: 'Crear una cuenta',
          steps: [
            'En "Nueva Cuenta" escriba el nombre o número de cuenta y el nombre del banco.',
            'Elija el tipo: Caja Chica, Cuenta, Chequera o Tarjeta.',
            'Escriba la "Cantidad Inicial" (saldo actual) y guarde.',
          ],
        },
      ],
      features: [
        '"Listado de cuentas" muestra cuenta, banco, tipo y saldo de cada una, y el balance total.',
      ],
    },
    {
      id: 'efectivo-flujo',
      title: 'Flujo de Efectivo',
      icon: <LuArrowLeftRight size={18} />,
      route: '/cash/transfers',
      menu: 'Efectivo › Flujo de Efectivo',
      description: 'Registra entradas o salidas de dinero de las cuentas que no son ventas ni gastos (por ejemplo, un aporte de capital o un retiro del dueño).',
      guides: [
        {
          title: 'Registrar una entrada o salida',
          steps: [
            'Elija "Ingreso de efectivo" o "Salida de efectivo".',
            'Escriba una descripción, elija la cuenta y la cantidad.',
            'Guarde. El movimiento aparece en el "Listado de transacciones".',
          ],
        },
      ],
    },
    {
      id: 'efectivo-historial',
      title: 'Historial de Transferencias',
      icon: <LuHistory size={18} />,
      route: '/cash/history',
      menu: 'Efectivo › Historial de Transferencias',
      description: 'Historial de los movimientos entre cuentas y del total disponible en ellas.',
      guides: [
        {
          title: 'Transferir dinero entre cuentas',
          steps: [
            'Haga clic en "Transferir entre cuentas".',
            'Elija la cuenta origen y la cuenta destino (deben ser distintas).',
            'Escriba la cantidad a transferir (mayor a cero) y guarde.',
          ],
        },
      ],
    },
  ],
};
