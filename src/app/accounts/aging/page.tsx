'use client';
import { AccountsAgingTable } from "@/components/accounts/AccountsAgingTable";
import { ButtonDownloadGet } from "@/components/button/button-download-get";
import { ClientsSearch } from "@/components/search/ClientsSearch";
import { ShowClientSearched } from "@/components/search/ShowClientSearched";
import { ShowTotal } from "@/components/ShowTotal";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useAccountAgingLogic } from "@/hooks/accounts/useAccountAgingLogic";

export default function Page() {
  const { aging, loading, downloadHref } = useAccountAgingLogic();
  const totals = aging?.totals;
  const overdue = totals ? totals.total - totals.current : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Cartera por antigüedad" />
        <AccountsAgingTable aging={aging} isLoading={loading} />
      </div>
      <div className="md:col-span-3">
        <ViewTitle text="Resumen" />
        <div className="p-4">
          <ShowTotal quantity={totals?.total ?? 0} text="Total por cobrar" number={false} />
        </div>
        <div className="p-4">
          <ShowTotal quantity={overdue} text="Total vencido" number={false} />
        </div>
        <div className="p-4">
          <ClientsSearch param="customers" placeholder="Buscar Cliente" />
          <ShowClientSearched />
        </div>
        <div className="flex justify-center p-4">
          <ButtonDownloadGet autoclass={false} href={downloadHref}>
            <span className="px-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/80 transition-colors">Descargar Excel</span>
          </ButtonDownloadGet>
        </div>
      </div>
      <ToasterMessage />
    </div>
  );
}
