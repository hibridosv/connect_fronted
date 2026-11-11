import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import cashTransferStore from "@/stores/cash/cashTransferStore";
import { Indicator } from "@/components/Indicators";
import { formatDateAsDMY } from "@/lib/date-formats";


export function HistoryTable() {
    const { system } = useConfigStore();
    const { history: response, loading } = cashTransferStore();
    const history = response?.data;



    if (history && loading) return <SkeletonTable rows={10} columns={7} />;
    if (!history) return null;
    if (history && history.length === 0) return (<NothingHere text="No se encuentran remesas" />)

    const listItems = history && history.map((record: any) => {
        return (
            <tr 
            key={record.id} 
            className={`whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${record.status === 0 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
            
            <td className="px-3 py-2" title={`Fecha: ${formatDateAsDMY(record.created_at)}`}>
            { <Indicator text={record?.name} type={record?.from_cash_accounts_id ? 'danger' : 'success'} /> }
            </td>
            <td className="px-3 py-2 text-center font-semibold" >
            {record?.from_cash_accounts_id ?  record?.account_from?.bank  :
            <span className="ml-4 text-danger font-semibold text-center">N/A</span> }
            </td>
            <td className={`px-3 py-2 text-center font-semibold`}>
            { record?.to_cash_accounts_id ? record?.account_to?.bank  :
            <span className="ml-4 text-danger font-semibold text-center">N/A</span> }
            </td>       
            <td className="px-3 py-2 text-center" >
                { numberToMoney(record?.quantity ? record?.quantity : 0, system) }
            </td>
            <td className="px-3 py-2 flex justify-center">
                { record?.employee?.name }
            </td>
            </tr>
        )
      });


  return (
    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Nombre</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Origen</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Destino</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Cantidad</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-center">Usuario</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {listItems}
          </tbody>
        </table>
      </div>
  );
}