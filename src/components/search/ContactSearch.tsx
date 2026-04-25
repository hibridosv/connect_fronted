'use client';

import { useContactSearchLogic } from "@/hooks/search/useContactSearchLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { Contact } from "@/interfaces/contact";
import useContactStore from "@/stores/ContactStore";
import useDefaultContactStore from "@/stores/defaultContactStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect, useRef } from "react";
import { LiComponent } from "../button/LiComponent";
import { getParamString } from "../contacs/utils";

export interface ContactSearchProps {
  param: 'customers' | 'suppliers' | 'drivers' | 'referrals';
  placeholder?: string;
  pagination?: number;
  tempSelectedName?: string;
  onSelect?: (contact: Contact) => void;
  onClear?: () => void;
  useDefaultWhenEmpty?: boolean;
}

export function ContactSearch({
  param,
  placeholder = "Buscar",
  pagination = 10,
  tempSelectedName = "contactSelectedBySearch",
  onSelect,
  onClear,
  useDefaultWhenEmpty = false,
}: ContactSearchProps) {
  const { contacts, loading } = useContactStore();
  const { setElement, getElement, clearElement } = useTempStorage();
  const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number", "code", "phone"], 500);
  const { currentPage } = usePagination("&page=1");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { defaultContact, loadDefaultContact } = useDefaultContactStore();
  useContactSearchLogic(currentPage, searchTerm, "-updated_at", getParamString(param), pagination);

  useEffect(() => {
    if (useDefaultWhenEmpty) {
      loadDefaultContact();
    }
  }, [useDefaultWhenEmpty, loadDefaultContact]);

  useEffect(() => {
    if (!useDefaultWhenEmpty) return;
    const form = containerRef.current?.closest('form');
    if (!form) return;

    const handleFormSubmit = () => {
      const currentSelected = getElement(tempSelectedName);
      const currentDefault = useDefaultContactStore.getState().defaultContact;
      if (!currentSelected && currentDefault) {
        setElement(tempSelectedName, currentDefault);
        onSelect?.(currentDefault);
      }
    };

    form.addEventListener('submit', handleFormSubmit);
    return () => form.removeEventListener('submit', handleFormSubmit);
  }, [useDefaultWhenEmpty, tempSelectedName, getElement, setElement, onSelect]);

  const selectedContact = getElement(tempSelectedName);

  const handleSelectContact = (contact: Contact) => {
    setElement(tempSelectedName, contact);
    handleSearchTerm('');
    onSelect && onSelect(contact);
  };

  const handleClear = () => {
    clearElement(tempSelectedName);
    onClear && onClear();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchTerm(e.target.value);
  };

  const clearInput = () => {
    handleSearchTerm('');
    inputRef.current?.focus();
  };

  if (selectedContact) {
    return (
      <div ref={containerRef} className="bg-bg-content border-2 border-bg-subtle rounded-md w-full py-2 px-4 text-text-base leading-tight shadow-sm flex items-center gap-2">
        <span className="truncate flex-1">{selectedContact.name}</span>
        <button
          type="button"
          onClick={handleClear}
          className="flex-shrink-0 text-text-muted/40 hover:text-danger transition-colors duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {loading ? (
            <svg aria-hidden="true" className="w-4 h-4 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 018-8V2.5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12a8 8 0 01-8 8v1.5" opacity="0.3" />
            </svg>
          ) : (
            <svg aria-hidden="true" className="w-4 h-4 text-text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          onChange={handleInputChange}
          className="bg-bg-content appearance-none border-2 border-bg-subtle rounded-md w-full py-2 pl-10 pr-8 text-text-base leading-tight focus:outline-none focus:bg-bg-content focus:border-primary shadow-sm"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute inset-y-0 right-0 flex items-center pr-3 group"
          >
            <svg className="w-4 h-4 text-text-muted/40 group-hover:text-text-base" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        )}
      </div>
      {searchTerm && contacts?.data && contacts.data.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-bg-content rounded-lg shadow-lg border border-bg-subtle/50">
          <ul className="divide-y divide-bg-subtle max-h-80 overflow-y-auto custom-scrollbar">
            {contacts.data.map((contact: Contact) => (
              <LiComponent
                key={contact.id}
                text={contact.name}
                onClick={() => handleSelectContact(contact)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
