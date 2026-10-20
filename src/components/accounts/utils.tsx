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

  // lo que el cliente paga: total menos retencion y notas de credito (amount); en cuotas, la prima mas las cuotas con su interes y la mora
  export const creditTotal = (credit: any): number => isInstallments(credit)
    ? Number(credit?.down_payment ?? 0) + Number(credit?.total_amount ?? 0)
      + (credit?.installments ?? []).reduce((total: number, installment: any) => total + Number(installment.late_fee ?? 0), 0)
    : credit?.amount != null ? Number(credit.amount) : Number(credit?.order?.total ?? 0) - Number(credit?.order?.retention ?? 0);

  const today = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  export const pendingInstallments = (credit: any): any[] => (credit?.installments ?? []).filter((installment: any) => Number(installment.balance) > 0);

  export const overdueInstallments = (credit: any): any[] => pendingInstallments(credit).filter((installment: any) => installment.due_date < today());

  // las que vencen hoy o antes: el abono las cubre primero; lo demas es adelanto y va a las ultimas cuotas
  export const dueInstallments = (credit: any): any[] => pendingInstallments(credit).filter((installment: any) => installment.due_date <= today());

  export const nextInstallment = (credit: any): any | null => pendingInstallments(credit)[0] ?? null;

  // lo que liquida el credito hoy: lo vencido mas el capital pendiente de las cuotas que aun no vencen (su interes se condona)
  export const payoffAmount = (credit: any): number => {
    const cents = pendingInstallments(credit).reduce((total: number, installment: any) => total + (installment.due_date <= today()
      ? Math.round(Number(installment.balance) * 100)
      : Math.round(Number(installment.principal) * 100) - Math.round(Number(installment.paid_principal ?? 0) * 100)), 0);
    return cents / 100;
  };

  export const sumBalance = (installments: any[]): number => Math.round(installments.reduce((total, installment) => total + Number(installment.balance), 0) * 100) / 100;

  // frecuencia => campo de la configuracion de creditos que la habilita
  export const frequencySettings: Record<number, 'allow_daily' | 'allow_weekly' | 'allow_biweekly' | 'allow_monthly'> = {
    1: 'allow_daily',
    2: 'allow_weekly',
    3: 'allow_biweekly',
    4: 'allow_monthly',
  };

  export const frequencyName = (frequency: number): string => ({ 1: 'Diaria', 2: 'Semanal', 3: 'Cada 15 días', 4: 'Mensual' } as Record<number, string>)[frequency] ?? '';

  export const installmentStatus = (installment: any) => {
    if (Number(installment.status) === 5) return <Indicator text="REESTRUCTURADA" type="inactive" />;
    if (Number(installment.status) === 4) return <Indicator text="CONDONADA" type="inactive" />;
    if (Number(installment.balance) <= 0) return <Indicator text="PAGADA" type="success" />;
    if (installment.due_date < today()) return <Indicator text="VENCIDA" type="danger" />;
    if (Number(installment.status) === 2) return <Indicator text="PARCIAL" type="warning" />;
    return <Indicator text="PENDIENTE" type="info" />;
  };

  export function calculateNewBalance( total: number, balance: number, quantity: number ): number {
    return (Number(total) - Number(balance) + Number(quantity));
  }