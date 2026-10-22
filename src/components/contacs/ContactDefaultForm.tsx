'use client';
import { useContactsAddLogic } from "@/hooks/contacts/useContactsAddLogic";
import { Contact } from "@/interfaces/contact";
import useContactStore from "@/stores/ContactStore";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Preset } from "../button/button";
import { getParamString } from "./utils";

export interface ContactDefaultFormProps {
  isShow: boolean;
  record: Contact;
}

/** Contacto predeterminado del sistema: solo se le puede cambiar el nombre */
export function ContactDefaultForm(props: ContactDefaultFormProps) {
  const { isShow, record } = props;
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const { register, handleSubmit, setValue } = useForm();
  const { onSubmit } = useContactsAddLogic(isShow, record, setValue, null, null, null, getParamString(pageParam));
  const { saving } = useContactStore();

  if (!isShow) return null;

  return (
    <div className="p-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="mb-3 text-sm text-text-muted">
                Este es el contacto predeterminado del sistema. Solo se puede cambiar su nombre.
            </div>
            <div className="w-full mb-4">
                <label htmlFor="name" className="input-label">Nombre completo *</label>
                <input type="text" id="name" {...register("name", { required: true })} className="input" />
            </div>
            <div className="flex justify-center">
              <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
            </div>
        </form>
    </div>
  );
}
