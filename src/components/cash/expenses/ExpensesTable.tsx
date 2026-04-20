import { DeleteButton } from "@/components/button/DeleteButton";
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import { getPaymentTypeName, numberToMoney } from "@/lib/utils";
import cashExpensesStore from "@/stores/cash/cashExpensesStore";
import useConfigStore from "@/stores/configStore";
import { FaSpinner } from "react-icons/fa";


export function ExpensesTable() {
    const { system } = useConfigStore();
    const { expenses, loading, deleting, deleteExpense } = cashExpensesStore();

    if (expenses && loading) return <SkeletonTable rows={4} columns={7} />;
    if (!expenses) return null;
    if (expenses && expenses.length === 0) return (<NothingHere text="No se encuentran gastos" />)

    let total = 0;
    const listItems = expenses && expenses.map((record: any) => {
        if (record.status === 1) {
            total += record.quantity;
        }
        return (
            <tr 
            key={record.id} 
            className={`whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${record.status === 0 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
            
            <td className="px-3 py-2 text-center" >
                { formatDate(record?.created_at) } { formatHourAsHM(record?.created_at) }
            </td>
            <td className="px-3 py-2 font-medium">
                <div className={`${record?.description && "text-xs font-light"}`}>{ record.name }</div>
                <div>{ record.description }</div>
            </td>
            <td className="px-3 py-2 text-center" >
                { numberToMoney(record?.quantity, system)}
            </td>
            <td className={`px-3 py-2 text-center font-semibold`}>
                { getPaymentTypeName(record?.payment_type) }
            </td>
            <td className="px-3 py-2  flex justify-center">
              { deleting ? <FaSpinner className="animate-spin" size={20} color="red" /> :
                <DeleteButton id={record.id} url="cash/expenses" onDeleteConfirm={deleteExpense} disabled={record.status === 0 || deleting} />
              }
            </td>
            </tr>
        )
      });


  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Hora</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Descripcion</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Cant</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Tipo Pago</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-center">Del</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {listItems}
          </tbody>
        </table>
      </div>
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle flex">
        <div className="flex-1 flex flex-col items-center py-3 px-4">
          <span className="text-xs uppercase font-medium text-text-muted tracking-wider">Total gastos</span>
          <span className="text-xl font-bold text-danger mt-0.5">{numberToMoney(total, system)}</span>
        </div>
      </div>
    </div>
  );
}