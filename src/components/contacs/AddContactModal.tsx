import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import useConfigStore from "@/stores/configStore";
import { ContactAddSV } from "./ContactAddSV";

export interface AddContactModalProps {
  onClose: () => void;
  isShow: boolean;
  record?: any;
}



export function AddContactModal(props : AddContactModalProps) {
    const { onClose, isShow, record } = props;
    const { system } = useConfigStore();


    if (!isShow) return null;

    return (
        <Modal show={isShow} onClose={onClose} size="xl" headerTitle="Detalles del contacto">
        <Modal.Body>
            <div className="p-2">
                { system.country == 1 && 
                <ContactAddSV isShow={isShow} record={record} />
                }
                { system.country == 2 && 
                <div> Nuevo registro de contacto</div>
                }
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={onClose} preset={Preset.close} disabled={false} />
        </Modal.Footer>
        </Modal>
    );
}