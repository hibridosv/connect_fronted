
import { createService } from "@/services/services";
import useStateStore from "@/stores/stateStorage";
import useToastMessageStore from "@/stores/toastMessageStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Preset } from "../button/button";
import Modal from "../modal/Modal";

export interface SendEmailDocumentModalProps {
  onClose: () => void;
  isShow: boolean;
  document: any | null;
}

export function SendEmailDocumentModal(props: SendEmailDocumentModalProps) {
    const { onClose, isShow, document } = props;
    const { register, handleSubmit, resetField } = useForm();
    const [showEmailDefault, setShowEmailDefault] = useState<boolean>(true);
    const { openLoading, closeLoading, loading } = useStateStore()
    const isSending = loading.sendingMail ?? false;


    if (!isShow || !document) return null;

  const onSubmit = async(data: any) => {
    if (!data.email) {
        useToastMessageStore.getState().setError({ message: "Ingrese un email"});
        return;
    }
    sendMail(data.email)
  }

    const sendMail = async (email: string | null) => { 
            let payload = {
                codigo: document?.codigo_generacion,
                email
            }
            openLoading("sendingMail");
            try {
                const response = await createService('electronic/documents/email', payload);
                useToastMessageStore.getState().setMessage(response);
                resetField("email");
            } catch (error) {
                useToastMessageStore.getState().setError(error);
                console.error(error);
            } finally {
                closeLoading("sendingMail");
            }
    };


  return (
    <Modal show={isShow} onClose={onClose} size="md" headerTitle="Enviar Documento por Email" closeOnOverlayClick={false}>
      <Modal.Body>
        <div className="p-4 bg-bg-content text-text-base">
          {/* --- Pestañas con nuevos estilos --- */ }
          <div className="flex border-b border-bg-subtle mb-4">
            <button
              onClick={() => setShowEmailDefault(true)}
              className={`w-full p-3 text-center font-medium transition-colors ${
                showEmailDefault
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-muted hover:bg-bg-subtle'
              }`}
            >
              Enviar al Cliente
            </button>
            <button
              onClick={() => setShowEmailDefault(false)}
              className={`w-full p-3 text-center font-medium transition-colors ${
                !showEmailDefault
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-muted hover:bg-bg-subtle'
              }`}
            >
              Enviar a Otro
            </button>
          </div>

          {/* --- Contenido con nuevos estilos --- */ }
          <div>
            {showEmailDefault ? (
              <div className="p-4 text-center">
                 <p className="text-text-muted mb-4">
                  Se enviará el documento al correo electrónico del cliente.
                </p>
                <Button
                  disabled={isSending}
                  isFull
                  preset={isSending ? Preset.saving : Preset.save}
                  text={isSending ? "Enviando..." : "Reenviar Email"}
                  onClick={() => sendMail(null)}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                <div>
                  <label htmlFor="email" className="input-label">
                    Ingrese el correo electrónico de destino *
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="input"
                    placeholder="ejemplo@correo.com"
                    disabled={isSending}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    isFull
                    disabled={isSending}
                    preset={isSending ? Preset.saving : Preset.save}
                    text={isSending ? "Enviando..." : "Enviar Email"}
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full">
          <Button onClick={onClose} preset={Preset.close} text="Cerrar" disabled={isSending} />
        </div>
      </Modal.Footer>
    </Modal>
  );
}
