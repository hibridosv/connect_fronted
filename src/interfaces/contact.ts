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
    excluded?:        number;
    employee_id?:     null;
    employee?:        User;
    status:          number;
    comment?:         string;
    created_at:      Date;
    updated_at:      Date;
}