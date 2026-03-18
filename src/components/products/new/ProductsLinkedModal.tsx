import { Button, Preset } from "@/components/button/button";
import { LiComponent } from "@/components/button/LiComponent";
import Modal from "@/components/modal/Modal";
import { SearchInput } from "@/components/Search";
import { useProductLinkedLogic } from "@/hooks/products/useProductsLinkedLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { Product } from "@/interfaces/products";
import useStateStore from "@/stores/stateStorage";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useForm } from "react-hook-form";
import { LuPackage, LuTrash2 } from "react-icons/lu";
import { productTypeIcon } from "../utils";

export interface ProductsLinkedModalProps {
  onClose: () => void;
  isShow: boolean;
  product: Product;
  requiredLink?: boolean;
}

export function ProductsLinkedModal(props: ProductsLinkedModalProps) {
  const { onClose, isShow, product, requiredLink = true } = props;
  const { register, handleSubmit, resetField } = useForm();
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const { currentPage, handlePageNumber } = usePagination("&page=1");
  const sortBy = "-updated_at";
  const { products, onSubmit, onDeleteLinked, isDeleting, productsLinked, loading: isSending } = useProductLinkedLogic(currentPage, searchTerm, sortBy, product, isShow);
  const { loading } = useStateStore();
  const isLoading = loading["productSearch"] ? true : false;
  const { setElement, getElement, clearElement } = useTempStorage();
  const elementSelected = getElement("product");

  if (!isShow || !product) return null;

  const handleClose = () => {
    if (requiredLink) {
        if (productsLinked && productsLinked.length > 0) {
        resetField("quantity");
        onClose();
        return;
     }
        useToastMessageStore.getState().setError({ message: "Para cerrar debe tener al menos un producto vinculado." });
    } else {
      onClose();
    }

  };

  const linkedRows = productsLinked && productsLinked.map((item: any) => {
    console.log(item);
    return (
    <tr key={item.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
      <td className="px-3 py-2 whitespace-nowrap">{item?.composed?.cod}</td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          {productTypeIcon(item?.composed?.product_type)}
          <span className="truncate max-w-[400px]" title={item?.composed?.description}>{item?.composed?.description}</span>
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">{item?.composed?.quantity}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap tabular-nums font-semibold">
        {item.quantity}
      </td>
      <td className="px-3 py-2 text-center">
        <button onClick={() => onDeleteLinked(item.id)} disabled={isDeleting} className="text-text-muted hover:text-danger transition-colors clickeable disabled:opacity-40">
          <LuTrash2 size={14} />
        </button>
      </td>
    </tr>
  )
  });

  const searchResults = products.data && products.data.map((productMap: Product) => {
    if (product.id === productMap.id) return null;
    return (
      <LiComponent key={productMap.id} text={`${productMap.cod} - ${productMap.description}`} onClick={() => setElement("product", productMap)} />
    );
  });

  return (
    <Modal show={isShow} onClose={handleClose} size="xl2" headerTitle="Administrar Productos Vinculados" closeOnOverlayClick={false} hideCloseButton={true}>
      <Modal.Body>

        {/* Producto principal */}
        <div className="flex items-center justify-between px-3 py-2 bg-bg-subtle/60 rounded-lg border border-bg-subtle mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <LuPackage size={14} className="shrink-0 text-text-muted" />
            <span className="text-xs font-mono text-text-muted shrink-0">{product?.cod}</span>
            <span className="text-sm font-semibold text-text-base truncate">{product?.description}</span>
          </div>
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold ml-3">
            Stock: {product?.quantity}
          </span>
        </div>

        {/* Tabla de vinculados */}
        <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden mb-3">
          <div className="px-3 py-2 bg-bg-subtle/60 border-b border-bg-subtle">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Productos vinculados</span>
          </div>
          {productsLinked && productsLinked.length > 0 ? (
            <div className="overflow-y-auto max-h-40 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b border-bg-subtle sticky top-0">
                  <tr>
                    <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Cod</th>
                    <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Producto</th>
                    <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Stock</th>
                    <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle text-center w-16">Cant</th>
                    <th className="px-3 py-2 font-bold tracking-wider text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-subtle/50">
                  {linkedRows}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-3 text-text-muted">
              <LuPackage size={14} className="opacity-40 shrink-0" />
              <p className="text-xs">Sin productos vinculados aún</p>
            </div>
          )}
        </div>

        {/* Buscar y vincular */}
        <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
          <div className="px-3 py-2 bg-bg-subtle/60 border-b border-bg-subtle">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {elementSelected ? 'Confirmar vínculo' : 'Agregar producto'}
            </span>
          </div>
          {elementSelected ? (
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/8 border border-success/30 mb-3">
                <span className="text-xs text-text-muted shrink-0">Seleccionado:</span>
                <span className="text-sm font-semibold text-text-base truncate">{elementSelected.cod} — {elementSelected.description}</span>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="input-label" htmlFor="quantity">Cantidad a vincular</label>
                  <input
                    type="number"
                    id="quantity"
                    {...register("quantity", { required: true, min: 1, max: product ? product.quantity : 1 })}
                    className="input"
                    defaultValue={1}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => clearElement("product")} text="Cancelar" preset={Preset.cancel} />
                  <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
                </div>
              </form>
            </div>
          ) : (
            <div className="p-3">
              <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar por código o descripción..." />
              <ul className="mt-2 max-h-36 overflow-y-auto custom-scrollbar">
                {isLoading
                  ? <p className="text-center text-text-muted text-xs py-3">Buscando...</p>
                  : searchResults
                }
              </ul>
            </div>
          )}
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} preset={Preset.close} disabled={isSending || isDeleting} />
      </Modal.Footer>
    </Modal>
  );
}
