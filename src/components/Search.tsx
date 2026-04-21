'use client'; 

import { useEffect, useRef, useState } from "react";

export interface SearchInputProps {
    handleSearchTerm: (term: string) => void;
    placeholder?: string;
    animating?: boolean;
}

export function SearchInput(props: SearchInputProps) {
  const { handleSearchTerm, placeholder = "Buscar...", animating = false } = props;
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setInputValue(newTerm);
    handleSearchTerm(newTerm);
  };

  const clearSearch = () => {
    if (inputValue === '') return; 
    setInputValue('');
    handleSearchTerm('');
    inputRef.current?.focus(); 
  };
  
  return (
    <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {animating ? (
              <svg aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 018-8V2.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12a8 8 0 01-8 8v1.5" opacity="0.3" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            )}
          </div>
          <input
            type="text"
            id="search"
            className="block w-full p-3 sm:p-4 pl-9 sm:pl-10 text-sm text-text-base border-2 border-bg-subtle rounded-lg bg-bg-content focus:ring-primary focus:border-primary"
            placeholder={placeholder}
            autoComplete="off"
            required
            value={inputValue}
            onChange={handleInputChange}
            ref={inputRef}
          />

          {inputValue && (
            <button
              type="button"
              onClick={clearSearch}
              title="Limpiar búsqueda"
              className="absolute inset-y-0 right-0 flex items-center pr-3 group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted/40 group-hover:text-text-base" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          )}
        </div>
    </div>
  );
}