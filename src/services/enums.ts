export enum PaymentType {
  efectivo = 1,
  tarjeta = 2,
  tranferencia = 3,
  cheque = 4,
  credito = 5,
  btc = 6,
  otro = 0,
}


export enum PaymentTypeNames {
  efectivo = "Efectivo",
  tarjeta = "Tarjeta",
  tranferencia = "Transferencia",
  cheque = "Cheque",
  credito = "Credito",
  btc = "BTC",
  otro = "Otro",
}

export enum DocumentTypes {
  ninguno = 0,
  ticket = 1,
  factura = 2,
  creditoFiscal = 3,
}

export enum DocumentTypesNames {
  ninguno = "Ninguno",
  ticket = 'Ticket',
  factura = "Factura",
  creditoFiscal = "Credito Fiscal",
}


  export enum TypeOfPrice {
    normal = 1,
    wholesaler = 2,
    promotion = 3,
  }
