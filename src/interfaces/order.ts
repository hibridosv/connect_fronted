import { Contact } from "./contact"
import { InvoiceAssigned } from "./invoiceassigned"
import { Invoiceproduct } from "./Invoiceproduct"
import { User } from "./user"

export interface Order {
  id: string
  number: number
  order_type: number
  employee_id: string
  casheir_id: string
  delivery_id: string
  client_id: string
  referred_id: string
  delivery_type: number
  invoice: number
  invoice_type_id: string
  payment_type: number
  cash: any
  subtotal: any
  taxes: any
  discount: any
  total: any
  total_recorded: any
  total_no_recorded: any
  total_no_subject: any
  total_exempt: any
  change: any
  retention: any
  retention_rent: any
  charged_at: any
  canceled_at: any
  comment: string
  opened_by_id: string
  status: number
  active_station: number
  active_print: number
  created_at: string
  updated_at: string
  attributes: any
  products: Invoiceproduct[]
  invoiceproducts: Invoiceproduct[]
  deletedproducts?: { id: string }[] // solo restaurante: eliminados despues de mandarse a cocina
  delivery: Contact
  client: Contact
  invoice_assigned: InvoiceAssigned
  employee: User
  referred: Contact
}





