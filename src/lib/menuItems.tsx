import { ReactElement } from "react";
import { BiDownload, BiFingerprint, BiHelpCircle, BiHistory, BiMoney, BiMoneyWithdraw, BiUserPin } from "react-icons/bi";
import { FaCashRegister, FaFileInvoice, FaTools } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import { MdInventory, MdReport, MdTransferWithinAStation } from "react-icons/md";
import { LuUtensilsCrossed } from "react-icons/lu";

export interface MenuItem {
  label: string;
  href?: string;
  icon?: ReactElement;
  permission?: string;
  children?: MenuItem[];
  permissions?: string[];
}

export const menuItems: MenuItem[] = [
  { label: "Panel Principal", href: "/dashboard", icon: <BiFingerprint size={15} />, permission: "dashboard" },
  { label: "Control de cajas", href: "/cashdrawers", icon: <FaCashRegister size={15} />, permission: "cashdrawer" },
  {
    label: "Restaurante", icon: <LuUtensilsCrossed size={15} />,
    permissions: ["restaurant-add-product", "restaurant-producs", "restaurant-screen", "restaurant-counter", "restaurant-orders"],
    children: [
      { label: "Registrar Producto", href: "/restaurant/new", permission: "restaurant-add-product" },
      { label: "Productos de Menu", href: "/restaurant/menu", permission: "restaurant-producs" },
      { label: "Pantalla", href: "/restaurant/screen", permission: "restaurant-screen" },
      { label: "Pantalla Despacho", href: "/restaurant/counter", permission: "restaurant-counter" },
      { label: "Listado de Ordenes", href: "/restaurant/orders", permission: "restaurant-orders" },
      { label: "Ordenes Eliminadas", href: "/restaurant/deleted", permission: "restaurant-orders" },
    ],
  },
  {
    label: "Inventario", icon: <MdInventory size={15} />,
    permissions: ["inventory", "inventory-register", "inventory-edit", "inventory-add", "inventory-failure", "inventory-linked", "inventory-stock", "inventory-expiration", "inventory-karex"],
    children: [
      { label: "Ver Productos", href: "/products", permission: "inventory" },
      { label: "Registrar Producto", href: "/products/new", permission: "inventory-register" },
      { label: "Editar Producto", href: "/products/search?page=edit", permission: "inventory-edit" },
      { label: "Agregar Productos", href: "/products/add", permission: "inventory-add" },
      { label: "Descontar Productos", href: "/products/remove", permission: "inventory-failure" },
      { label: "Productos Relacionados", href: "/products/linked", permission: "inventory-linked" },
      { label: "Bajas Existencias", href: "/products/stock", permission: "inventory-stock" },
      { label: "Proximos Vencimientos", href: "/products/expiring", permission: "inventory-expiration" },
      { label: "Kardex", href: "/products/search?page=kardex", permission: "inventory-karex" },
    ],
  },
  {
    label: "Efectivo", icon: <BiMoney size={15} />,
    permissions: ["cash-bills", "cash-remittance", "cash-accounts", "cash-inout", "cash-history"],
    children: [
      { label: "Registro de Gastos", href: "/cash/expenses", permission: "cash-bills" },
      { label: "Remesas de Efectivo", href: "/cash/remittances", permission: "cash-remittance" },
      { label: "Cuentas Bancarias", href: "/cash/bank-accounts", permission: "cash-accounts" },
      { label: "Flujo de Efectivo", href: "/cash/transfers", permission: "cash-inout" },
      { label: "Historial de Transferencias", href: "/cash/history", permission: "cash-history" },
    ],
  },
  {
    label: "Cuentas", icon: <BiMoneyWithdraw size={15} />,
    permissions: ["credits-receivable", "credits-payable"],
    children: [
      { label: "Cuentas por cobrar", href: "/accounts/receivable", permission: "credits-receivable" },
      { label: "Cuentas por Pagar", href: "/accounts/payable", permission: "credits-payable" },
    ],
  },
  {
    label: "Directorio", icon: <BiUserPin size={15} />,
    permissions: ["directory"],
    children: [
      { label: "Contactos", href: "/contacts/search", permission: "directory" },
      { label: "Clientes", href: "/contacts/search?page=customers", permission: "directory" },
      { label: "Repartidores", href: "/contacts/search?page=drivers", permission: "directory" },
      { label: "Proveedores", href: "/contacts/search?page=suppliers", permission: "directory" },
      { label: "Referidos", href: "/contacts/search?page=referrals", permission: "directory" },
    ],
  },
  {
    label: "Historiales", icon: <BiHistory size={15} />,
    permissions: ["histories-sales", "histories-bills", "histories-remittance", "histories-cut", "histories-discount", "histories-list", "histories-by-user", "histories-by-client", "histories-deleted", "histories-cost", "histories-shipping-notes", "histories-payments", "histories-commission-pay"],
    children: [
      { label: "Ventas", href: "/history/sales", permission: "histories-sales" },
      { label: "Gastos", href: "/history/expenses", permission: "histories-bills" },
      { label: "Remesas", href: "/history/remittances", permission: "histories-remittance" },
      { label: "Cortes de Caja", href: "/history/cash-closures", permission: "histories-cut" },
      { label: "Ventas con descuento", href: "/history/discounted", permission: "histories-discount" },
      { label: "Listado de Ventas", href: "/history/list", permission: "histories-list" },
      { label: "Ventas por Usuario", href: "/history/by-user", permission: "histories-by-user" },
      { label: "Ventas por Cliente", href: "/history/by-customer", permission: "histories-by-client" },
      { label: "Ventas por Producto", href: "/history/by-product", permission: "histories-by-client" },
      { label: "Ventas por Dia", href: "/history/by-day", permission: "histories-by-client" },
      { label: "Ordenes Eliminadas", href: "/history/deleted", permission: "histories-deleted" },
      { label: "Listado de costos", href: "/history/costs", permission: "histories-cost" },
      { label: "Notas de Envio", href: "/history/shipping-notes", permission: "histories-shipping-notes" },
      { label: "Abonos Recibidos", href: "/history/payments", permission: "histories-payments" },
      { label: "Comisiones Pagadas", href: "/history/commissions", permission: "histories-commission-pay" },
    ],
  },
  {
    label: "Herramientas", icon: <FaTools size={15} />,
    permissions: ["tools-quotes", "tools-commissions", "tools-adjustment"],
    children: [
      { label: "Cotizaciones", href: "/tools/quotes", permission: "tools-quotes" },
      { label: "Detalle de Comisiones", href: "/tools/commissions", permission: "tools-commissions" },
      { label: "Puntos de Oro", href: "/tools/gold-points", permission: "tools-commissions" },
      { label: "Ajustar Inventario", href: "/tools/adjustments", permission: "tools-adjustment" },
    ],
  },
  {
    label: "Reportes", icon: <MdReport size={15} />,
    permissions: ["reports-sales", "reports-bills", "reports-products"],
    children: [
      { label: "Detalle de Ventas", href: "/reports/sales", permission: "reports-sales" },
      { label: "Detalle de Gastos", href: "/reports/expenses", permission: "reports-bills" },
      { label: "Productos Ingresados", href: "/reports/entered", permission: "reports-products" },
      { label: "Productos por lote", href: "/reports/by-batch", permission: "reports-products" },
      { label: "Productos Averiados", href: "/reports/damaged", permission: "reports-products" },
    ],
  },
  {
    label: "Facturación", icon: <FaFileInvoice size={15} />,
    permissions: ["invoices-documents", "invoices-correlative", "invoices-electronic", "invoices-search"],
    children: [
      { label: "Documentos Emitidos", href: "/invoicing/documents", permission: "invoices-documents" },
      { label: "Correlativo de Documentos", href: "/invoicing/correlatives", permission: "invoices-correlative" },
      { label: "Documentos Electrónicos", href: "/invoicing/electronic", permission: "invoices-electronic" },
      { label: "Documentos Rechazados", href: "/invoicing/rejected", permission: "invoices-electronic" },
      { label: "Notas de Remisión", href: "/invoicing/remission-notes", permission: "invoices-electronic" },
      { label: "Buscar Documentos", href: "/invoicing/search", permission: "invoices-search" },
    ],
  },
  {
    label: "Transferencias", icon: <MdTransferWithinAStation size={15} />,
    permissions: ["transfers-send", "transfers-receive", "transfers-request", "histories-transfers"],
    children: [
      { label: "Crear Transferencia", href: "/transfers/new", permission: "transfers-send" },
      { label: "Aceptar Transferencia", href: "/transfers/accept", permission: "transfers-receive" },
      { label: "Solicitar Transferencia", href: "/transfers/request", permission: "transfers-request" },
      { label: "Listado de Transferencias", href: "/transfers/list", permission: "histories-transfers" },
    ],
  },
  {
    label: "Anexos y Descargas", icon: <BiDownload size={15} />,
    permissions: ["reports-attaches"],
    children: [
      { label: "Anexos de IVA", href: "/annexes/annexes", permission: "reports-attaches" },
      { label: "Libros de compras", href: "/annexes/purchases", permission: "reports-attaches" },
      { label: "Descargas de Documentos", href: "/annexes/downloads", permission: "reports-attaches" },
      { label: "Lector de JSON", href: "/annexes/json-reader" },
    ],
  },
  {
    label: "Configuraciones", icon: <GrConfigure size={15} />,
    permissions: ["config", "config-products", "config-user", "config-permissions", "config-transfers"],
    children: [
      { label: "Principal", href: "/settings/general", permission: "config" },
      { label: "Productos", href: "/settings/products", permission: "config-products" },
      { label: "Usuarios", href: "/settings/users", permission: "config-user" },
      { label: "Permisos de Usuario", href: "/settings/permissions", permission: "config-permissions" },
      { label: "Sucursales", href: "/settings/branches", permission: "config-transfers" },
      { label: "Pagos", href: "/settings/payments" },
    ],
  },
  { label: "Ayuda", href: "/help", icon: <BiHelpCircle size={15} /> },
];
