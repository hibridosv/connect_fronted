'use client';
import { ViewTitle } from "@/components/ViewTitle";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Reordenar Iconos" />
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Categorias" />

    </div>
</div>
  );
}
