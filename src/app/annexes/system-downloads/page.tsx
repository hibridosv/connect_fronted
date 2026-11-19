'use client';
import { LinksList, LinkUrls } from "@/components/button/LinkList";
import { ViewTitle } from "@/components/ViewTitle";
import useConfigStore from "@/stores/configStore";

export default function Page() {
  const { activeConfig } = useConfigStore();

  // cada descarga declara la configuración principal que la habilita
  const downloads: (LinkUrls & { feature: string })[] = [
    { name: "Facturador (facturador.7z)", route: "download.file.facturador", isUrl: true, feature: "print-pusher" },
  ];
  const available = downloads.filter((d) => Array.isArray(activeConfig) && activeConfig.includes(d.feature));

  return (
    <div className="pb-4 md:pb-10">
      <ViewTitle text="Descargas del sistema" />
      <div className="px-4 max-w-2xl">
        {available.length > 0
          ? <LinksList links={available} text="Programas y archivos" />
          : <p className="my-5 text-text-muted">No hay descargas disponibles.</p>}
      </div>
    </div>
  );
}
