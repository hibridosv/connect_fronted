import { Contact } from "./contact";
import { Order } from "./order";
import { User } from "./user";

export type MaintenanceFieldType = "text" | "textarea" | "number" | "date" | "boolean" | "select";

export interface MaintenanceFieldSchema {
    name:     string;
    label:    string;
    type:     MaintenanceFieldType;
    required: boolean;
    options?: string[];
}

export interface MaintenanceType {
    id:            string;
    name:          string;
    description?:  string;
    fields_schema: MaintenanceFieldSchema[];
    status:        number;
    maintenances?: Maintenance[];
    created_at:    string;
    updated_at:    string;
}

export interface MaintenanceImage {
    id:             string;
    maintenance_id: string;
    image:          string;
    description?:   string;
    status:         number;
}

export interface MaintenanceStatusHistory {
    id:             string;
    maintenance_id: string;
    status:         number;
    comment?:       string;
    // The backend eager-loads the `changedBy` relation, and Laravel snake-cases
    // it to `changed_by` on serialization — overwriting the raw FK column, so
    // this key always resolves to the User object (or null), not a uuid string.
    changed_by:     User | null;
    created_at:     string;
}

export interface Maintenance {
    id:                   string;
    maintenance_type_id:  string;
    contact_id:           string;
    employee_id?:         string;
    ticket_order_id?:      string | null;
    asset_label?:         string;
    custom_fields:        Record<string, any>;
    problem_description?: string;
    diagnosis?:           string | null;
    solution?:             string | null;
    total?:                number | null;
    status:               number;
    received_at:          string;
    delivered_at?:         string | null;
    type?:                 MaintenanceType;
    contact?:              Contact;
    employee?:             User;
    order?:                Order | null;
    images?:               MaintenanceImage[];
    // Serialized by Laravel as `status_history` (relation names are snake-cased).
    status_history?:       MaintenanceStatusHistory[];
    created_at:            string;
    updated_at:            string;
}
