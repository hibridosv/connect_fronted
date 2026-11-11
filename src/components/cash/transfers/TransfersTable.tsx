import { Spinner } from "@/components/Spinner";
import { DeleteButton } from "@/components/button/DeleteButton";
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import cashTransferStore from "@/stores/cash/cashTransferStore";
import { Indicator } from "@/components/Indicators";


export function TransfersTable() {
    const { system } = useConfigStore();
    const {  transfers: response, loading, deleteTransfer, deleting} = cashTransferStore();
    const transfers = response?.data;

    if (transfers && loading) return <SkeletonTable rows={10} columns={7} />;
    if (!transfers) return null;
    if (transfers && transfers.length === 0) return (<NothingHere text="No se encuentran remesas" />)


    const transactionType = (type: number)=>{
        if (type == 1) return <Indicator text="Ingreso de Efectivo" type="success" />
        if (type == 0) return <Indicator text="Salida de Efectivo" type="danger" />        
    }

    const listItems = transfers && transfers.map((record: any) => {
        return (
            <tr 
            key={record.id} 
            className={`whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${record.status === 0 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
            
            <td className="px-3 py-2 text-left" >
               { transactionType(record?.transaction_type) }
            </td>
            <td className="px-3 py-2 font-medium">
                { record?.description }
            </td>
            <td className="px-3 py-2 text-center" >
               { record?.employee?.name }
            </td>
            <td className={`px-3 py-2 text-center font-semibold`}>
                { numberToMoney(record.quantity ? record.quantity : 0, system) }
            </td>
            <td className="px-3 py-2 flex justify-center">
              { deleting ? <Spinner size={20} /> :
                <DeleteButton id={record.id} url="cash/transfers" onDeleteConfirm={deleteTransfer} disabled={(record.status == 0 ? true : false) || deleting} />
              }
            </td>
            </tr>
        )
      });


  return (
    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
            <tr className="border-b-2 border-bg-subtle">
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Cuenta</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Banco</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Tipo</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Saldo</th>
              <th scope="col" className="px-4 py-3 font-bold tracking-wider text-center">Del</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle">
            {listItems}
          </tbody>
        </table>
      </div>
  );
}