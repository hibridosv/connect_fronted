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

  export const isInstallments = (credit: any): boolean => Number(credit?.modality) === 2;

  // lo que el cliente paga: el gran contribuyente retiene el 1 %; en cuotas, la prima mas las cuotas con su interes
  export const creditTotal = (credit: any): number => isInstallments(credit)
    ? Number(credit?.down_payment ?? 0) + Number(credit?.total_amount ?? 0)
    : Number(credit?.order?.total ?? 0) - Number(credit?.order?.retention ?? 0);

  const today = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  export const pendingInstallments = (credit: any): any[] => (credit?.installments ?? []).filter((installment: any) => Number(installment.balance) > 0);

  export const overdueInstallments = (credit: any): any[] => pendingInstallments(credit).filter((installment: any) => installment.due_date < today());

  export const nextInstallment = (credit: any): any | null => pendingInstallments(credit)[0] ?? null;

  export const sumBalance = (installments: any[]): number => Math.round(installments.reduce((total, installment) => total + Number(installment.balance), 0) * 100) / 100;

  export const frequencyName = (frequency: number): string => ({ 1: 'Diaria', 2: 'Semanal', 3: 'Cada 15 días', 4: 'Mensual' } as Record<number, string>)[frequency] ?? '';

  export const installmentStatus = (installment: any) => {
    if (Number(installment.balance) <= 0) return <Indicator text="PAGADA" type="success" />;
    if (installment.due_date < today()) return <Indicator text="VENCIDA" type="danger" />;
    if (Number(installment.status) === 2) return <Indicator text="PARCIAL" type="warning" />;
    return <Indicator text="PENDIENTE" type="info" />;
  };

  export function calculateNewBalance( total: number, balance: number, quantity: number ): number {
    return (Number(total) - Number(balance) + Number(quantity));
  }