import { Button, Preset } from "@/components/button/button";
import { SkeletonForm } from "@/components/skeleton/SkeletonForm";
import productRemovedStore from "@/stores/products/productRemovedStore";
import { useForm } from "react-hook-form";


export function RemoveInitialForm() {
    const { register, handleSubmit } = useForm();
    const { product, loading, createPrincipal } = productRemovedStore();

    if (loading) return <SkeletonForm />;
    if (product && !loading) return null;


  return (
        <div className="bg-bg-content rounded-2xl shadow-lg border border-bg-subtle p-4 w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(createPrincipal)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="md:col-span-2">
                        <label htmlFor="type" className="block text-sm font-bold text-text-muted mb-1">Tipo de Salida</label>
                        <select id="type" {...register("type")} className="input-select" >
                            <option value={1}> Averia </option>
                            <option  value={2}> Traslado </option>
                            <option  value={3}> Devolución </option>
                            <option  value={4}> Cambio </option>
                            <option  value={5}> Otros ... </option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="reason" className="block text-sm font-bold text-text-muted mb-1">Comentario</label>
                        <textarea {...register("reason")} rows={2} id="reason" className="input" />
                    </div>
                </div>

                <div className="flex justify-center pt-6 border-t border-bg-subtle">
                    <Button type="submit" disabled={loading} preset={loading ? Preset.saving : Preset.save} />
                </div>
            </form>
        </div>
  );
}
