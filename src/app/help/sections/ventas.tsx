import { LuBanknote, LuConciergeBell, LuCreditCard, LuFileText, LuShoppingCart, LuSlidersHorizontal, LuTag } from 'react-icons/lu';
import { HelpSection } from './types';

export const ventas: HelpSection = {
  id: 'ventas',
  label: 'Ventas',
  icon: <LuShoppingCart size={16} />,
  color: 'text-success',
  system: 'products',
  description: 'La pantalla de ventas para negocios de productos: agregar productos, ajustar la orden, asignar cliente y cobrar.',
  subsections: [
    {
      id: 'ventas-pantalla',
      title: 'Pantalla de ventas',
      icon: <LuShoppingCart size={18} />,
      route: '/orders/products',
      menu: 'Icono de casa en la barra superior',
      description: 'Desde aquí se crean y cobran las ventas. A la izquierda se buscan y agregan productos; a la derecha están las órdenes pendientes, el total y los botones de la orden.',
      features: [
        'Buscador: por código (ideal para lector de código de barras) o por código y descripción. El icono a la derecha del buscador cambia entre los dos modos.',
        'Tabla de la orden: cantidad, producto, precio, descuento, total y botones para sumar (+), restar (−) o quitar (x) cada producto.',
        'Órdenes pendientes: cuando no hay una orden abierta, se listan las órdenes guardadas. Al pasar sobre una se ven sus productos, y el icono de descarga genera su PDF.',
        'Tipo de documento: el nombre del documento (Ticket, Factura, Crédito Fiscal, etc.) aparece sobre el total; al hacer clic se puede cambiar.',
        'Tipo de precio (si el negocio tiene multiprecio): al hacer clic cambia entre Precio Normal, Mayorista y Promoción. Si no es el normal, aparece un aviso en rojo.',
        'Productos exentos: se marcan con (E) en rojo junto al nombre.',
        'Cantidad en rojo: el producto no tiene existencia suficiente.',
      ],
      guides: [
        {
          title: 'Hacer una venta paso a paso',
          steps: [
            'Verifique que tiene una caja abierta (Control de cajas). Sin caja no se puede cobrar.',
            'Escriba o escanee el código del producto y presione Enter. Si no conoce el código, cambie el modo del buscador con el icono de la derecha y busque por descripción; luego haga clic en el producto.',
            'Repita para cada producto. Si agrega el mismo producto otra vez, se suma a la cantidad.',
            'Revise la tabla: use + y − para ajustar cantidades o haga clic en la cantidad para escribir una nueva.',
            'Si el documento debe ir a nombre de un cliente, abra "Opciones" › "Asignar Cliente".',
            'Haga clic en el nombre del documento (sobre el total) si necesita cambiar el tipo de documento.',
            'Haga clic en "Cobrar", elija el método de pago y complete el cobro (ver "Cobrar una orden").',
          ],
        },
        {
          title: 'Guardar una orden para después',
          steps: [
            'Con la orden abierta, haga clic en "Guardar".',
            'La orden se cierra y aparece en "Órdenes Pendientes".',
            'Para retomarla, haga clic en el nombre del cliente o usuario de la lista de pendientes.',
          ],
        },
        {
          title: 'Cancelar una orden',
          steps: [
            'Con la orden abierta, haga clic en "Cancelar".',
            'Confirme en la ventana "¿Estas seguro de eliminar esta orden?". La orden se elimina y los productos no se descuentan del inventario.',
          ],
        },
      ],
      tips: [
        'Haga clic en el nombre de un producto de la orden para ver sus detalles (precios, existencia, categoría, etc.).',
        'Con un lector de código de barras, deje el buscador en modo "código": el cursor regresa solo al campo después de cada producto.',
      ],
    },
    {
      id: 'ventas-ajustes',
      title: 'Ajustar productos de la orden',
      icon: <LuTag size={18} />,
      menu: 'Pantalla de ventas › tabla de la orden',
      description: 'Cada fila de la orden tiene acciones para corregir cantidades, precios, descuentos y otros datos. Algunas solo aparecen si están activadas para el negocio y pueden pedir código de autorización.',
      guides: [
        {
          title: 'Cambiar la cantidad',
          steps: [
            'Haga clic en el número de la columna "Cant".',
            'Escriba la nueva cantidad y guarde. También puede usar los botones + y −.',
          ],
        },
        {
          title: 'Cambiar el precio de un producto',
          steps: [
            'Haga clic en el precio del producto.',
            'Si se pide, ingrese el código de autorización.',
            'Escriba el "Nuevo Precio" y guarde.',
          ],
        },
        {
          title: 'Aplicar un descuento',
          steps: [
            'Para un solo producto: haga clic en el valor de la columna "Descuento" de ese producto.',
            'Para toda la orden: abra "Opciones" › "Agregar Descuento".',
            'Elija si el descuento es por "Cantidad" (monto fijo) o por "Porcentaje".',
            'Revise el resumen: precio sin descuento, descuento aplicado y total con descuento. Guarde.',
          ],
        },
        {
          title: 'Otros ajustes de la fila (si están activados)',
          steps: [
            'Lápiz junto al nombre: cambia el nombre del producto solo para esta venta.',
            'Segundo lápiz (verde si ya tiene): agrega un comentario al producto.',
            'Icono de lote: elige de qué lote se descuenta el producto (útil con vencimientos). Rojo indica que ya tiene un lote asignado.',
            'Columna "Comisión": define el porcentaje de comisión de ese producto.',
          ],
        },
      ],
      warnings: [
        'Los productos con lote asignado y las "Otras Ventas" no se pueden sumar o restar con + y −; cambie la cantidad haciendo clic en ella o elimínelos y agréguelos de nuevo.',
      ],
    },
    {
      id: 'ventas-opciones',
      title: 'Menú "Opciones" de la orden',
      icon: <LuSlidersHorizontal size={18} />,
      menu: 'Pantalla de ventas › botón Opciones',
      description: 'El botón "Opciones", junto a Guardar, agrupa las acciones sobre la orden completa. Solo aparecen las que están activadas para su negocio.',
      features: [
        'Agregar Descuento: descuento sobre toda la orden.',
        'Asignar Cliente: busca un cliente o lo registra en el momento con "Registrar Cliente". Los clientes con crédito bloqueado se indican.',
        'Asignar Vendedor: atribuye la venta a otro usuario (para comisiones o control).',
        'Asignar Referido: asocia la venta a un referido para calcular su comisión.',
        'Asignar Repartidor: indica quién entrega el pedido.',
        'Otras Ventas: agrega un producto o servicio que no está en el inventario, con cantidad, precio, descripción, tipo de operación (Gravado, Exento, No Sujeto) y tipo de venta (Producto o Servicio).',
        'Venta Especial: agrupa varios productos del inventario en una sola línea con la descripción y el precio que usted indique. Los productos se descuentan del inventario, pero el documento muestra solo la descripción especial.',
        'Agregar comentario: nota de 5 a 250 caracteres que se imprime en el documento.',
        'Guardar como Cotización: guarda la orden como cotización (necesita cliente). Se consulta luego en Herramientas › Cotizaciones.',
        'Crear Nota de Remisión: genera una nota de remisión (necesita cliente) eligiendo el motivo: Depósito, Propiedad, Consignación, Traslado u Otros.',
      ],
      guides: [
        {
          title: 'Registrar una venta especial',
          steps: [
            'Abra "Opciones" › "Venta Especial".',
            'En la ventana, busque y agregue los productos que forman la venta (se descontarán del inventario).',
            'Escriba la "Descripción" que verá el cliente en el documento y el "Precio" total.',
            'Elija el tipo de operación (Gravado, Exento o No Sujeto) y guarde.',
          ],
        },
        {
          title: 'Vender algo que no está en el inventario',
          steps: [
            'Abra "Opciones" › "Otras Ventas" (o el icono verde bajo la orden cuando está vacía). Puede pedir código.',
            'Escriba la cantidad, el precio y la descripción.',
            'Elija el tipo de operación y si es producto o servicio. Guarde.',
          ],
        },
      ],
    },
    {
      id: 'ventas-cobro',
      title: 'Cobrar una orden',
      icon: <LuBanknote size={18} />,
      menu: 'Pantalla de ventas › botón Cobrar',
      description: 'Al cobrar se emite el documento, se descuenta el inventario y el dinero entra a la caja abierta.',
      guides: [
        {
          title: 'Cobro en efectivo',
          steps: [
            'Haga clic en "Cobrar".',
            'En la parte inferior de la ventana verifique que esté seleccionado "Efectivo".',
            'Escriba la cantidad de efectivo que entrega el cliente.',
            'Haga clic en "Cobrar". La ventana final muestra subtotal, impuestos, descuentos, total y el CAMBIO a devolver.',
            'Haga clic en "Imprimir" si necesita el comprobante impreso.',
          ],
        },
        {
          title: 'Cobro con tarjeta, transferencia u otro método',
          steps: [
            'Haga clic en "Cobrar".',
            'En la parte inferior elija el método (Tarjeta, Transferencia, Cheque, etc.).',
            'Haga clic en "Pagar con ..." para completar.',
            'Para pagos mixtos (efectivo y tarjeta), elija el método mixto: escriba el monto en efectivo y el resto se cobra con tarjeta.',
          ],
        },
        {
          title: 'Venta al crédito',
          steps: [
            'Asigne primero el cliente a la orden (Opciones › Asignar Cliente).',
            'Haga clic en "Cobrar" y elija el método "Crédito".',
            'Elija el tipo de crédito: "Libre (abonos)" para que el cliente abone cualquier monto hasta pagar, o "Por cuotas" para un plan de pagos con fechas.',
            'En "Por cuotas": elija una plantilla (opcional), la frecuencia, el número de cuotas, la fecha de la primera cuota y, si aplica, la prima y su forma de pago. Espere a que se calcule el plan.',
            'Haga clic en "Asignar Credito". Verá el mensaje "Crédito Otorgado Correctamente".',
          ],
        },
      ],
      features: [
        'Si el cliente supera su límite de crédito, aparece un aviso con su saldo, el total de esta venta y su límite.',
        'Un cliente con crédito bloqueado no puede recibir crédito.',
        'Si el tipo de documento es Nota de Envío, el botón dice "Crear nota de Envío": no afecta el efectivo de la caja.',
      ],
      warnings: [
        'El botón "Cobrar" queda deshabilitado si no hay caja abierta, si la cuenta está suspendida o si el documento es Crédito Fiscal y falta el cliente o alguno de sus datos fiscales. Los mensajes sobre la orden indican qué falta.',
      ],
    },
    {
      id: 'ventas-documentos',
      title: 'Tipos de documento y mensajes',
      icon: <LuFileText size={18} />,
      menu: 'Pantalla de ventas › nombre del documento',
      description: 'El tipo de documento define qué se emite al cobrar. Se cambia haciendo clic en su nombre, sobre el total de la orden.',
      features: [
        'Ticket o Factura (consumidor final): no necesitan cliente.',
        'Crédito Fiscal: necesita un cliente con sus datos fiscales completos (documento, registro, actividad, dirección, etc.).',
        'Nota de Envío: registra la salida de productos sin afectar el efectivo.',
        'Mensaje "Faltan los siguientes campos del cliente para facturar": edite el cliente en Directorio y complete los datos indicados.',
        'Mensaje "Factura con retención del 1%": el cliente es gran contribuyente y se aplica la retención.',
        'Mensaje "Cliente Exento de impuestos": la venta se emite sin impuestos.',
      ],
    },
    {
      id: 'ventas-busqueda',
      title: 'Consultar un producto desde cualquier pantalla',
      icon: <LuCreditCard size={18} />,
      menu: 'Barra superior › lupa',
      description: 'La lupa de la barra superior permite consultar precio y existencias sin interrumpir la venta.',
      guides: [
        {
          title: 'Consultar precio y existencia',
          steps: [
            'Haga clic en la lupa de la barra superior.',
            'Escriba el código o la descripción del producto y haga clic en el resultado.',
            'Revise código, precios, existencia, categoría y demás detalles.',
            'Haga clic en "Ver Disponibilidad" para ver la existencia del producto en cada sucursal.',
          ],
        },
      ],
    },
  ],
};

export const ventasRestaurante: HelpSection = {
  id: 'ventas-restaurante',
  label: 'Ventas restaurante',
  icon: <LuConciergeBell size={16} />,
  color: 'text-success',
  system: 'restaurant',
  description: 'La pantalla de ventas del restaurante: venta rápida, servicio a mesa y delivery, con envío de comandas a cocina.',
  subsections: [
    {
      id: 'restaurante-pantalla',
      title: 'Pantalla de ventas del restaurante',
      icon: <LuConciergeBell size={18} />,
      route: '/orders/restaurant',
      menu: 'Icono de casa en la barra superior',
      description: 'A la izquierda se elige la mesa o el cliente y se marcan los productos del menú; a la derecha se ve la orden, su total y los botones para guardar o cobrar.',
      features: [
        'Tipo de servicio (arriba a la derecha): "Venta Rapida", "Servicio Mesa" y "Delivery", según lo activado para el negocio y los permisos del usuario.',
        'Menú: iconos de categorías y productos. Al tocar una categoría se abren sus productos.',
        'Orden: cantidad, producto, precio y total de lo marcado. Los productos con opciones o de venta especial tienen su propio icono.',
        'Barra de opciones bajo los botones: tipo de entrega (Comer aquí, Para llevar, Delivery), tipo de documento y método de pago. Haga clic en cada uno para cambiarlo.',
        'Campo de efectivo: aparece cuando el método es efectivo; puede mostrar un teclado numérico en pantalla táctil si está activado.',
      ],
      guides: [
        {
          title: 'Venta rápida (para llevar o mostrador)',
          steps: [
            'Seleccione "Venta Rapida" arriba a la derecha.',
            'Toque la categoría y luego los productos que pide el cliente. Si el producto tiene opciones (por ejemplo, término de la carne o tipo de bebida), elija la opción o toque "Saltar Opción".',
            'Revise la orden a la derecha; toque la cantidad de un producto para agregar más unidades.',
            'Verifique abajo el tipo de entrega, el documento y el método de pago.',
            'Si paga en efectivo, escriba la cantidad recibida.',
            'Toque "Cobrar". La ventana final muestra el total y el cambio; toque "Imprimir" si necesita el comprobante.',
          ],
        },
        {
          title: 'Atender una mesa',
          steps: [
            'Seleccione "Servicio Mesa". Se muestran las mesas por zona: verde "Disponible", roja ocupada con el tiempo transcurrido.',
            'Toque una mesa disponible y marque los productos del menú.',
            'Toque "Guardar" para enviar las comandas a cocina; la mesa queda ocupada y puede seguir atendiendo otras.',
            'Para agregar más productos después, toque la mesa ocupada: se abre su orden.',
            'Cuando el cliente pida la cuenta, use "Opciones" › "Imprimir pre cuenta".',
            'Para cobrar, abra la mesa, elija documento y método de pago y toque "Cobrar". La mesa vuelve a quedar disponible.',
          ],
        },
        {
          title: 'Pedido a domicilio (Delivery)',
          steps: [
            'Seleccione "Delivery".',
            'Busque el cliente en "Buscar Cliente Delivery" o regístrelo si es nuevo.',
            'Marque los productos del pedido.',
            'Si cobra envío, use "Opciones" › "Agregar envío" y escriba el monto.',
            'Guarde o cobre el pedido. Los pedidos pendientes se listan con su estado: Pendiente, Preparando, En camino o Entregado.',
          ],
        },
      ],
      tips: [
        'Al cambiar de tipo de servicio con una orden abierta, el sistema la guarda automáticamente. En venta rápida debe cobrar o eliminar la orden antes de cambiar.',
        'Eliminar un producto que ya se envió a cocina puede pedir código de autorización y queda registrado en Restaurante › Productos Eliminados.',
      ],
    },
    {
      id: 'restaurante-opciones',
      title: 'Opciones de la orden del restaurante',
      icon: <LuSlidersHorizontal size={18} />,
      menu: 'Pantalla de ventas › botón Opciones',
      description: 'El botón "Opciones" reúne las acciones sobre la orden. Algunas solo aparecen en servicio a mesa o delivery, o si están activadas para el negocio.',
      features: [
        'Agregar Descuento: por monto o porcentaje sobre la orden.',
        'Asignar Propina: por cantidad o porcentaje. La propina no se incluye en el total de la venta y se reporta aparte en el corte.',
        'Asignar Cliente, Vendedor, Referido o Repartidor.',
        'Otras Ventas y Venta Especial: igual que en la venta de productos.',
        'Agregar comentario: nota general para la orden (también se muestra en cocina).',
        'Agregar/Quitar opciones: agrega o quita modificadores a productos ya marcados. Al agregar una opción se separa una unidad del producto.',
        'Imprimir pre cuenta: guarda la orden e imprime la precuenta para el cliente.',
        'Agregar envío (delivery): suma el costo de envío.',
        'Agregar cliente a la mesa (mesa): crea "Cliente 2", "Cliente 3", etc. para llevar la cuenta de cada persona.',
        'Agregar nombre a la mesa (mesa): identifica la orden con un nombre (por ejemplo, el del cliente).',
        'Dividir Cuenta (mesa con varios clientes): abre la pantalla para cobrar a cada cliente por separado.',
      ],
      guides: [
        {
          title: 'Dividir la cuenta de una mesa',
          steps: [
            'Mientras marca productos, use "Opciones" › "Agregar cliente a la mesa" para cada comensal y seleccione el cliente activo arriba antes de marcar sus productos.',
            'Cuando pidan la cuenta, abra "Opciones" › "Dividir Cuenta".',
            'En la pantalla de división, asigne cada producto al cliente correspondiente.',
            'Seleccione el cliente, revise su total, elija método de pago y toque "Cobrar". Repita con cada cliente.',
            'Use "Imprimir Precuenta" si el cliente quiere ver su parte antes de pagar, y "Regresar" para volver a la mesa.',
          ],
        },
      ],
    },
    {
      id: 'restaurante-mesas',
      title: 'Unir, cambiar y renombrar mesas',
      icon: <LuTag size={18} />,
      menu: 'Servicio Mesa › tres puntos de cada mesa',
      description: 'Cada mesa tiene un menú de tres puntos con acciones según su estado. Una mesa unida comparte la orden y el tiempo de la mesa principal.',
      guides: [
        {
          title: 'Unir mesas (grupo grande)',
          steps: [
            'Toque los tres puntos de la mesa ocupada que será la principal y elija "Unir mesas".',
            'En la ventana, cambie de zona si hace falta y toque las mesas libres que quiere unir.',
            'Las mesas unidas muestran "Unida a ..." y todo se cobra en la orden de la principal.',
            'Desde una mesa libre también puede usar "Unir a una mesa ocupada" y elegir la mesa principal.',
          ],
        },
        {
          title: 'Cambiar la orden de mesa',
          steps: [
            'Toque los tres puntos de la mesa ocupada y elija "Cambiar de mesa".',
            'Toque la mesa libre de destino (o "Mover aquí" en una de sus mesas unidas). La orden conserva su tiempo.',
          ],
        },
        {
          title: 'Separar o renombrar',
          steps: [
            'Para separar una mesa unida: tres puntos › "Separar mesa" (o "Separar" en la ventana de unir mesas).',
            'Para ir a la orden desde una mesa unida: tres puntos › "Ir a la mesa principal".',
            'Para renombrar: tres puntos de la mesa ocupada › "Renombrar mesa", escriba el nombre y guarde.',
          ],
        },
        {
          title: 'Ver los detalles de la orden',
          steps: [
            'Tres puntos de la mesa ocupada (o unida) › "Detalles de la orden": muestra los productos, el total, el mesero y si la orden está aperturada.',
            'Si está aperturada, indica qué usuario la tiene abierta. Si está guardada, puede abrirla desde ahí con "Abrir orden".',
          ],
        },
      ],
    },
  ],
};
