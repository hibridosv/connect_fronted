'use client';
import { CHATBOT_PHONE, WHATSAPP_MESSAGE } from '@/app/settings/chatbot/chatbotConfig';
import { Button, Preset } from '@/components/button/button';
import { buildPhoneNumber, formatPhoneDisplay, PHONE_COUNTRY_CODES } from '@/lib/phone';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaLock, FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_LINK = `https://wa.me/${CHATBOT_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const WHATSAPP_WEB_LINK = `https://web.whatsapp.com/send?phone=${CHATBOT_PHONE}&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

interface ChatbotPhoneCardProps {
  phoneNumber: string | null;
  loadingPhone: boolean;
  saving: boolean;
  canManagePhone: boolean;
  onSavePhone: (phoneNumber: string) => Promise<boolean>;
}

export function ChatbotPhoneCard({ phoneNumber, loadingPhone, saving, canManagePhone, onSavePhone }: ChatbotPhoneCardProps) {
  const { register, handleSubmit, reset } = useForm();
  const [showForm, setShowForm] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!phoneNumber) return;
    QRCode.toDataURL(WHATSAPP_LINK, { width: 170, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [phoneNumber]);

  const handleFormSubmit = async (data: any) => {
    const success = await onSavePhone(buildPhoneNumber(data.country_code, data.phone_local));
    if (success) {
      reset();
      setShowForm(false);
    }
  };

  if (loadingPhone) {
    return <div className="text-sm text-text-muted">Buscando número registrado...</div>;
  }

  if (!phoneNumber || showForm) {
    if (!canManagePhone) {
      return (
        <div className="flex items-start gap-2 text-sm text-warning bg-warning/10 border border-warning/30 rounded-md p-3 animate-fade-in">
          <FaLock size={14} className="shrink-0 mt-0.5" />
          <span>No tienes permiso para configurar el número del chatbot. Verifica con tu gerente.</span>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full animate-fade-in">
        <p className="text-sm text-text-muted mb-2">
          Registra tu número de WhatsApp para poder escribirle al chatbot.
        </p>
        <div className="flex gap-2">
          <div className="w-40 shrink-0">
            <select id="country_code" {...register('country_code')} className="input-select" defaultValue={PHONE_COUNTRY_CODES[0].code}>
              {PHONE_COUNTRY_CODES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} +{country.code}
                </option>
              ))}
            </select>
          </div>
          <input
            type="tel"
            id="phone_local"
            placeholder="Ej. 60625689"
            {...register('phone_local', { required: true })}
            className="input flex-1 min-w-0"
          />
        </div>
        <div className="flex justify-end gap-3 mt-3">
          {!!phoneNumber && (
            <Button type="button" onClick={() => setShowForm(false)} preset={Preset.danger} text="Cancelar" disabled={saving} />
          )}
          <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-success/10 text-success text-sm font-medium mb-3 animate-slide-up">
        <FaWhatsapp size={14} />
        {formatPhoneDisplay(phoneNumber)}
      </div>

      {qrDataUrl && (
        <div className="relative mb-2 animate-scale-in">
          <div className="absolute inset-0 rounded-xl bg-success/40 blur-lg animate-pulse-glow" />
          <div className="relative bg-bg-content border border-bg-subtle rounded-xl p-2 shadow-sm">
            <img src={qrDataUrl} alt="QR para escribirle al chatbot" width={170} height={170} />
          </div>
          <FaWhatsapp
            size={22}
            className="absolute -top-2 -right-2 text-success bg-bg-content rounded-full p-1 shadow-sm animate-float"
          />
        </div>
      )}
      <p className="text-xs text-text-muted">
        Escanea el código desde tu celular
      </p>
      <p className="text-[11px] text-text-muted/70 mb-3">
        ¿No puedes escanear? Escríbele directo al{' '}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-success font-semibold hover:underline"
        >
          {formatPhoneDisplay(CHATBOT_PHONE)}
        </a>
      </p>

      <a href={WHATSAPP_WEB_LINK} target="_blank" rel="noopener noreferrer" className="w-full">
        <button type="button" className="button-green !py-1.5 !text-sm w-full rounded-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-[1.02]">
          <FaWhatsapp size={15} />
          Escribir desde la web
        </button>
      </a>

      {canManagePhone && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-xs text-text-muted hover:text-text-base underline mt-3"
        >
          Cambiar número
        </button>
      )}
    </div>
  );
}
