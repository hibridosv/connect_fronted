import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useAccountPayableLogic } from "@/hooks/accounts/useAccountPayableLogic";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useAccountPayableStore from "@/stores/accounts/accountPayableStore";
import useConfigStore from "@/stores/configStore";
import useTempStorage from "@/stores/useTempStorage";
import { useForm } from "react-hook-form";
import { DeleteButton } from "../button/DeleteButton";

export interface AddPayableCreditNoteModalI {
  onClose: () => void;
  isShow: boolean;
}

export function AddPayableCreditNoteModal({ onClose, isShow }: AddPayableCreditNoteModalI) {
        const { getElement } = useTempStorage();

        const { register, handleSubmit, reset } = useForm();
        const payableRecord = getElement('paymentPayableAdd');
        const { saveCreditNote, delCreditNote } = useAccountPayableLogic();
        const { sending, deleting } = useAccountPayableStore();
        const { system } = useConfigStore();
        // una cuenta puede tener varias notas; se agregan mientras quede saldo
        const notes = payableRecord?.notes ?? [];
        const balance = Number(payableRecord?.balance ?? 0);



  const onSubmit = async (data: any) => {
      await saveCreditNote(data);
      reset();
  }


  const listNotes = notes.map((note: any) => (
    <tr key={note.id} className="whitespace-nowrap transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
      <td className="px-3 py-2 text-center">{note.number}</td>
      <td className="px-3 py-2 text-center">{note.invoice}</td>
      <td className="px-3 py-2 text-center">{formatDateAsDMY(note.emited_at)}</td>
      <td className="px-3 py-2 text-right font-semibold">{numberToMoney(note.quantity, system)}</td>
      <td className="px-3 py-2 flex justify-center">
        <DeleteButton id={note.id} url="accounts/notes" onDeleteConfirm={delCreditNote} disabled={deleting} text="Seguro que desea eliminar la nota de credito?" />
      </td>
    </tr>
  ));


  return (
    <Modal show={isShow} onClose={onClose} size="md" headerTitle="notas de credito">
      <Modal.Body>
        <div className="p-6 space-y-4">
              { notes.length > 0 &&
                    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                                <tr>
                                    <th scope="col" className="px-3 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Nota</th>
                                    <th scope="col" className="px-3 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Factura</th>
                                    <th scope="col" className="px-3 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Emisión</th>
                                    <th scope="col" className="px-3 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Monto</th>
                                    <th scope="col" className="px-3 py-3 font-bold tracking-wider text-center">Del</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-bg-subtle">
                                {listNotes}
                            </tbody>
                        </table>
                    </div>
              }

              { balance > 0 &&
                    <form onSubmit={handleSubmit(onSubmit)} className="pb-4 border-2 shadow-lg rounded-md pt-3">
                        <div className="flex flex-wrap mx-3 mb-2 ">

                            <div className="w-full md:w-full px-3 mb-2">
                                <label htmlFor="number" className="input-label"> Numero de Nota de credito *</label>
                                <input type="number" id="number" {...register("number", {required: true})} className="input" step="any" min={0} />
                            </div>

                            <div className="w-full md:w-full px-3 mb-2">
                                <label htmlFor="invoice" className="input-label"> Factura afectada *</label>
                                <input type="number" id="invoice" {...register("invoice", {required: true})} className="input" step="any" min={0} />
                            </div>

                            <div className="w-full md:w-full px-3 mb-2">
                                <label htmlFor="emited_at" className="input-label"> Fecha emisión *</label>
                                <input type="date" id="emited_at" {...register("emited_at", {required: true})} className="input" />
                            </div>

                            <div className="w-full md:w-full px-3 mb-2">
                                <label htmlFor="quantity" className="input-label"> Cantidad * (saldo {numberToMoney(balance, system)})</label>
                                <input type="number" id="quantity" {...register("quantity", {required: true})} className="input" step="any" min={0} max={balance} />
                            </div>

                        </div>
                        <div className="flex justify-center">
                        <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
                        </div>
                    </form>
              }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={deleting} />
        </div>
      </Modal.Footer>
    </Modal>
  );
}
