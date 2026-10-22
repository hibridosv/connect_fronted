'use client';

import { Contact } from '@/interfaces/contact';
import { formatDateAsDMY } from '@/lib/date-formats';
import { formatDuiWithAll } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import { FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';

export interface ContactProfileCardProps {
  contact: Contact;
  onShowDetails: () => void;
}

const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();

export function ContactProfileCard({ contact, onShowDetails }: ContactProfileCardProps) {
  const { system } = useConfigStore();

  const tags = [
    { active: contact.is_client, label: 'Cliente' },
    { active: contact.is_provider, label: 'Proveedor' },
    { active: contact.is_employee, label: 'Repartidor' },
    { active: contact.is_referred, label: 'Referido' },
  ].filter((tag) => tag.active);

  const rows = [
    { icon: FiPhone, value: contact.phone },
    { icon: FiMail, value: contact.email },
    { icon: FiMapPin, value: contact.address },
    { icon: FiUser, value: contact.employee?.name ? `Vendedor: ${contact.employee.name}` : undefined },
  ].filter((row) => row.value);

  return (
    <div className="relative bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-5 overflow-hidden animate-fade-in">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary/60 via-accent/40 to-transparent" />
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
          {initials(contact.name)}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-text-base leading-tight break-words">{contact.name}</h2>
          {contact.taxpayer && contact.taxpayer !== contact.name && (
            <p className="text-xs text-text-muted truncate">{contact.taxpayer}</p>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span key={tag.label} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">{tag.label}</span>
          ))}
          {contact.excluded == 1 && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Exento</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        {contact.code && (
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{system?.system?.contact_search ?? 'Código'}</p>
            <p className="font-semibold text-text-base break-words">{contact.code}</p>
          </div>
        )}
        {contact.id_number && (
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Documento</p>
            <p className="font-semibold text-text-base break-words">{formatDuiWithAll(contact.id_number)}</p>
          </div>
        )}
        {contact.register && (
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Registro</p>
            <p className="font-semibold text-text-base break-words">{formatDuiWithAll(contact.register)}</p>
          </div>
        )}
        {contact.birthday && (
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Cumpleaños</p>
            <p className="font-semibold text-text-base">{formatDateAsDMY(contact.birthday)}</p>
          </div>
        )}
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Registrado</p>
          <p className="font-semibold text-text-base">{formatDateAsDMY(contact.created_at)}</p>
        </div>
      </div>

      {rows.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm border-t border-bg-subtle pt-3">
          {rows.map((row, index) => (
            <li key={index} className="flex items-start gap-2 text-text-base">
              <row.icon className="shrink-0 mt-0.5 text-text-muted" size={14} />
              <span className="break-words min-w-0">{row.value}</span>
            </li>
          ))}
        </ul>
      )}

      {contact.roar && (
        <p className="mt-3 text-xs text-text-muted"><span className="font-semibold">Giro:</span> {contact.roar}</p>
      )}

      <button type="button" onClick={onShowDetails} className="mt-4 w-full text-xs font-semibold text-primary hover:underline">
        Ver ficha completa
      </button>
    </div>
  );
}
