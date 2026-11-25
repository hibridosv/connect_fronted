// Fila de GET inventory/history: saldo del kardex de un producto al cierre de la fecha consultada
export interface InventoryHistoryRecord {
  id: string;
  cod: string;
  description: string;
  unit_cost: number;
  qty_balance: number;
  total_balance: number;
}
