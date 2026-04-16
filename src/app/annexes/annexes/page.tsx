'use client';
import { ViewTitle } from "@/components/ViewTitle";
import { ANEXO_OPTIONS, SUCURSAL_OPTIONS, useTaxAnnexesLogic } from "@/hooks/reports/useTaxAnnexesLogic";
import { LuDownload } from "react-icons/lu";

export default function Page() {
  const { months, selectedSucursal, setSelectedSucursal, buildUrl } = useTaxAnnexesLogic();

  const downloadBtnClass = selectedSucursal === '0'
    ? 'bg-primary/5 text-primary hover:bg-primary/15'
    : 'bg-accent/10 text-accent hover:bg-accent/20';

  return (
    <div className="pb-4 md:pb-10">

      <div className="flex items-center justify-between pr-6">
        <ViewTitle text="Reporte de Anexos IVA" />
        <div className="flex rounded-lg border border-bg-subtle overflow-hidden bg-bg-content shrink-0">
          {SUCURSAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedSucursal(opt.value)}
              className={`px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                selectedSucursal === opt.value
                  ? 'bg-primary text-text-inverted'
                  : 'text-text-muted hover:bg-bg-subtle'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="m-4">
        <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
              <tr>
                <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">
                  Tipo de Anexo
                </th>
                {months.map((month) => (
                  <th key={`${month.monthName}-${month.year}`} className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap last:border-r-0 text-center">
                    {month.monthName}
                    <span className="ml-1 font-normal text-text-muted normal-case">{month.year}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-subtle/50">
              {ANEXO_OPTIONS.map((opt) => (
                <tr key={opt.value} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
                  <td className="px-6 py-3 whitespace-nowrap font-medium">
                    {opt.description}
                  </td>
                  {months.map((month) => (
                    <td key={`${month.monthName}-${month.year}`} className="px-4 py-3 whitespace-nowrap text-center">
                      <a
                        href={`${buildUrl(month, opt.value)}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium active:scale-95 transition-all duration-150 clickeable ${downloadBtnClass}`}
                      >
                        <LuDownload size={13} />
                        Descargar
                      </a>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
