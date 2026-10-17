import { Indicator } from "../Indicators";

  export const status = (expiration: number) => {
    return (expiration == 1) ? 
    <Indicator text="ACTIVO" type="success" /> : 
    <Indicator text="PAGADO" type="danger" />;
  }


  export const statusPayment = (expiration: number) => {
    return (expiration == 1) ? 
    <Indicator text="Pagado" type="success" /> : 
    <Indicator text="Eliminado" type="danger" />;
  }

  // lo que el cliente paga: el gran contribuyente retiene el 1 %
  export const creditTotal = (order: any): number => Number(order?.total ?? 0) - Number(order?.retention ?? 0);

  export function calculateNewBalance( total: number, balance: number, quantity: number ): number {
    return (Number(total) - Number(balance) + Number(quantity));
  }