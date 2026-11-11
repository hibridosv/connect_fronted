import useTempStorage from "@/stores/useTempStorage";
import { Button, Preset } from "../button/button";



export function ShowProductSearched() {
  const { getElement, clearElement } = useTempStorage();
  const elementSelected = getElement('productSearched');

    if (!elementSelected) return null;


    return (
          <div className="mt-2 p-3 flex justify-between text-text-base border border-bg-subtle rounded-lg bg-bg-content">
            <span className="font-semibold uppercase">{ elementSelected?.description}</span> <Button preset={Preset.smallClose} onClick={()=> clearElement('productSearched')} />
          </div>
    );
}
