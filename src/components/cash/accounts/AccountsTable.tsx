import { DeleteButton } from "@/components/button/DeleteButton";
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { numberToMoney } from "@/lib/utils";
import cashAccountStore from "@/stores/cash/cashAccountStore";
import useConfigStore from "@/stores/configStore";
import { FaSpinner } from "react-icons/fa";
import { typeOfAccount } from "../utils";


export function AccountsTable() {
    const { system } = useConfigStore();
    const {  accounts, loading, deleting, deleteAccount} = cashAccountStore();


    if (accounts && loading) return <SkeletonTable rows={4} columns={7} />;
    if (!accounts) return null;
    if (accounts && accounts.length === 0) return (<NothingHere text="No se encuentran remesas" />)

    let total = 0;
    const listItems = accounts && accounts.map((record: any) => {
        if (record.status === 1) {
            total += record.balance;
        }
        return (
            <tr 
            key={record.id} 
            className={`whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${record.status === 0 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
            
            <td className="px-3 py-2 text-center" >
                { record?.account }
            </td>
            <td className="px-3 py-2 font-medium">
                { record?.bank }
            </td>
            <td className="px-3 py-2 text-center" >
                { typeOfAccount(record?.type) }
            </td>
            <td className={`px-3 py-2 text-center font-semibold`}>
                { numberToMoney(record.balance ? record.balance : 0, system) }
            </td>
            <td className="px-3 py-2 flex justify-center">
              { deleting ? <FaSpinner className="animate-spin" size={20} color="red" /> :
                <DeleteButton id={record.id} url="cash/accounts" onDeleteConfirm={deleteAccount} disabled={(record.status == 0 || record.is_principal == 1) ? true : false || deleting} />
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
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle flex">
        <div className="flex-1 flex flex-col items-center py-3 px-4">
          <span className="text-xs uppercase font-medium text-text-muted tracking-wider">Balance total</span>
          <span className="text-xl font-bold text-success mt-0.5">{numberToMoney(total, system)}</span>
        </div>
      </div>
    </div>
  );
}