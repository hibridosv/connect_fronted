import useTempStorage from "@/stores/useTempStorage";
import { Button, Preset } from "../button/button";

export interface ShowClientSearchedI {
  tempSelectedName?: string;
  onClose?: (item: any) => void;
}

export function ShowClientSearched(props: ShowClientSearchedI) {
  const { tempSelectedName = "clientSelectedBySearch", onClose } = props;
  const { getElement, clearElement } = useTempStorage();
  const elementSelected = getElement(tempSelectedName);

    if (!elementSelected) return null;

    const handleClose = () => {
      clearElement(tempSelectedName);
      onClose && onClose(elementSelected);
    }


    return (
          <div className="mt-2 p-3 flex justify-between text-text-base border border-bg-subtle rounded-lg bg-bg-content">
            <span className="font-semibold uppercase">{ elementSelected?.name}</span> 
            <Button preset={Preset.smallClose} onClick={handleClose} />
          </div>         
    );
}