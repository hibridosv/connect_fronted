'use client';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';

export interface FieldOptionsTagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function FieldOptionsTagsInput({ value, onChange }: FieldOptionsTagsInputProps) {
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitDraft();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeAt = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="bg-bg-content border-2 border-bg-subtle rounded-md w-full px-2 py-1.5 flex flex-wrap items-center gap-1.5 focus-within:border-primary">
      {value.map((opt, i) => (
        <span key={opt + i} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-0.5">
          {opt}
          <button type="button" onClick={() => removeAt(i)} className="hover:text-danger">
            <MdClose size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={value.length === 0 ? 'Escribe una opción y presiona Enter' : ''}
        className="flex-1 min-w-[120px] bg-transparent text-sm text-text-base outline-none py-0.5"
      />
    </div>
  );
}
