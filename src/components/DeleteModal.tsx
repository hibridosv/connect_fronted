import { useModalBehavior } from "@/hooks/useModalBehavior";
import { useRef } from "react";

export interface DeleteModalProps {
  text?: string;
  onDelete: (id: any) => void;
  onClose: () => void;
  isShow: boolean;
  isSending?: boolean;
  header?: string;
  textDelete?: string;
}

export function DeleteModal(props: DeleteModalProps) {
  const { onDelete,  onClose, text = "Esta seguro que desea eliminar este elemento?", textDelete = "Si, Eliminar", isShow, isSending = false, header = "Eliminar Elemento" } = props;

  const cancelRef = useRef<HTMLButtonElement>(null);
  // Escape equivale a "No, Cancelar"; mientras borra no se cierra
  useModalBehavior(isShow, onClose, !isSending, cancelRef);

  if (!isShow) return null;

  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-bg-content text-left shadow-lg transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-danger/10 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-danger"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-text-base" id="modal-title"> {header} </h3>
                  <div className="mt-2">
                    <p className="text-sm text-text-muted">{text}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-bg-subtle bg-bg-subtle/40 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button type="button"
                className="inline-flex w-full justify-center rounded-md bg-danger px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-danger/90 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 sm:ml-3 sm:w-auto"
                onClick={onDelete} disabled={isSending} >
                { textDelete }
              </button>

              <button
                ref={cancelRef}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-bg-subtle bg-bg-content px-4 py-2 text-sm font-medium text-text-muted shadow-sm hover:bg-bg-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:mt-0 sm:w-auto"
                onClick={onClose} disabled={isSending} > No, Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
