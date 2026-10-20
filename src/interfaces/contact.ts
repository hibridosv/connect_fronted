import { User } from "./user";

export interface Contact {
    id:              string;
    name:            string;
    id_number?:       any;
    address?:         string;
    code?:            string;
    email?:           string;
    phone?:           string;
    birthday?:        Date;
    taxpayer?:        string;
    taxpayer_type?:   number;
    document?:        string;
    register?:        string;
    roar?:            string;
    activity_code?:   string | null;
    departament_doc?: string;
    town_doc?:        string;
    address_doc?:     string;
    country?:         null;
    is_client?:       number;
    is_provider?:     number;
    is_employee?:     number;
    is_referred?:     number;
    is_credit_block?: number;
    credit_limit?:    number | null;
    excluded?:        number;
    employee_id?:     null;
    employee?:        User;
    status:          number;
    comment?:         string;
    created_at:      Date;
    updated_at:      Date;
}

export interface ContactSummaryKpis {
    orders_count:      number;
    total_sum:         number;
    average_ticket:    number;
    discount_sum:      number;
    units_sum:         number;
    first_purchase_at: string | null;
    last_purchase_at:  string | null;
    days_since_last:   number | null;
    frequency_days:    number | null;
}

export interface ContactSummaryMonth {
    month:        string;
    orders_count: number;
    total_sum:    number;
}

export interface ContactTopProduct {
    product_id:     string | null;
    cod:            string;
    product:        string;
    quantity_sum:   number;
    total_sum:      number;
    orders_count:   number;
    last_bought_at: string;
}

export interface ContactActiveCredit {
    id:                 string;
    invoice:            number | null;
    order_id:           string | null;
    modality:           number;
    balance:            number;
    expiration:         string | null;
    installments_count: number | null;
    created_at:         string;
}

export interface ContactSummaryCredit {
    credit_limit:    number | null;
    balance:         number;
    available:       number | null;
    overdue:         number;
    is_credit_block: number;
    active_count:    number;
    total_count:     number;
    active:          ContactActiveCredit[];
}

export interface ContactSummaryReturns {
    credit_notes_count: number;
    credit_notes_total: number;
    returns_count:      number;
    returns_total:      number;
    canceled_count:     number;
    canceled_total:     number;
}

export interface ContactSummary {
    contact:      Contact;
    kpis:         ContactSummaryKpis;
    by_month:     ContactSummaryMonth[];
    top_products: ContactTopProduct[];
    credit:       ContactSummaryCredit;
    returns:      ContactSummaryReturns;
}
