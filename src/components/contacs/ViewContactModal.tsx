import Modal from "@/components/modal/Modal";
import { Button, Preset } from "@/components/button/button";
import useConfigStore from "@/stores/configStore";
import { ContactDetailsGT } from "./ContactDetailsGT";
import { ContactDetailsHN } from "./ContactDetailsHN";
import { ContactDetailsSV } from "./ContactDetailsSV";

export interface ViewContactModalProps {
  onClose: () => void;
  isShow: boolean;
  record: any;
}

export function ViewContactModal(props: ViewContactModalProps) {
  const { onClose, isShow, record } = props;
  const { system } = useConfigStore();

  if (!isShow) return null;

  return (
    <Modal show={isShow} onClose={onClose} size="xl" headerTitle="Detalles del contacto">
      <Modal.Body>
        <div className="p-2">
          {system?.country == 1 &&
            <ContactDetailsSV isShow={isShow} record={record} />
          }
          {system?.country == 2 &&
            <ContactDetailsHN isShow={isShow} record={record} />
          }
          {system?.country == 3 &&
            <ContactDetailsGT isShow={isShow} record={record} />
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}