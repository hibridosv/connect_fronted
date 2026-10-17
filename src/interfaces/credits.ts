export interface CreditSettings {
    free_credit_days:       number;
    installments_enabled:   boolean;
    installments_available: boolean;
    allow_daily:            boolean;
    allow_weekly:           boolean;
    allow_biweekly:         boolean;
    allow_monthly:          boolean;
    max_installments:       number;
    interest_method:        number;
    interest_rate:          number;
    late_fee_type:          number;
    late_fee_value:         number;
    grace_days:             number;
    skip_sundays:           boolean;
}

export interface CreditPlanInstallment {
    number:    number;
    due_date:  string;
    principal: number;
    interest:  number;
    amount:    number;
}

export interface CreditPlan {
    period_rate:        number;
    principal:          number;
    interest_total:     number;
    total_amount:       number;
    installment_amount: number;
    amount:             number;
    down_payment:       number;
    frequency:          number;
    interest_method:    number;
    interest_rate:      number;
    late_fee_type:      number;
    late_fee_value:     number;
    grace_days:         number;
    installments:       CreditPlanInstallment[];
}

export interface CreditInstallment extends CreditPlanInstallment {
    id:             string;
    receivable_id:  string;
    late_fee:       number;
    late_fee_waived: number;
    paid_principal: number;
    paid_interest:  number;
    paid_late_fee:  number;
    balance:        number;
    status:         number;
    paid_at:        string | null;
}
