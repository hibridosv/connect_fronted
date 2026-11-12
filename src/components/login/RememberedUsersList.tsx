'use client';
import { RememberedUser } from "@/lib/rememberedUsers";
import { FaUserPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// Usuario sin el dominio por defecto, como se escribe en el login
export const displayUsername = (username: string) => username.replace(/@hibridosv\.com$/i, '');

const initials = (user: RememberedUser) => {
  const base = (user.name || displayUsername(user.username)).trim();
  const parts = base.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
};

export function RememberedUserAvatar({ user, size = 'md' }: { user: RememberedUser; size?: 'md' | 'lg' }) {
  const sizes = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-11 h-11 text-sm';
  return (
    <div className={`${sizes} shrink-0 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20`}>
      {initials(user)}
    </div>
  );
}

interface Props {
  users: RememberedUser[];
  onSelect: (user: RememberedUser) => void;
  onRemove: (user: RememberedUser) => void;
  onOtherAccount: () => void;
}

export function RememberedUsersList({ users, onSelect, onRemove, onOtherAccount }: Props) {
  return (
    <div className="space-y-3 animate-slide-up">
      {users.map((user) => (
        <div key={user.username} className="group relative">
          <button
            type="button"
            onClick={() => onSelect(user)}
            className="w-full flex items-center gap-3 p-3 pr-11 rounded-xl border border-bg-subtle bg-bg-base hover:border-primary/40 hover:bg-primary/5 transition-colors duration-200 text-left"
          >
            <RememberedUserAvatar user={user} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-base truncate">{user.name || displayUsername(user.username)}</p>
              <p className="text-xs text-text-muted truncate">
                {user.name ? displayUsername(user.username) : ''}
                {user.name && user.business ? ' · ' : ''}
                {user.business ?? ''}
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onRemove(user)}
            title="Quitar esta cuenta"
            className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 rounded-full text-text-muted/60 hover:text-danger hover:bg-danger/10 transition-colors duration-200"
          >
            <IoClose size={18} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={onOtherAccount}
        className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-bg-subtle hover:border-primary/40 hover:bg-primary/5 transition-colors duration-200 text-left"
      >
        <div className="w-11 h-11 shrink-0 rounded-full bg-bg-subtle/60 text-text-muted flex items-center justify-center">
          <FaUserPlus size={16} />
        </div>
        <p className="text-sm font-medium text-text-muted">Usar otra cuenta</p>
      </button>
    </div>
  );
}
