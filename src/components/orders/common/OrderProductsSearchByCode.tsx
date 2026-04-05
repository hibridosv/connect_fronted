'use client'
import { useOrderFnLogic } from '@/hooks/order/product/useOrderFnLogic';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';



interface FormData {
    cod: string;
}

export function OrderProductsSearchByCode() {
    const inputRef = useRef<HTMLInputElement>(null);
    const isLoading = false;
    const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm();
    const { addNew } = useOrderFnLogic();
    const { getElement } = useTempStorage();
    const typeOfSearch = getElement('typeOfSearch');
    const queueRef = useRef<{ cod: string }[]>([]);
    const processingRef = useRef(false);


    useEffect(() => {
        if (inputRef.current && !typeOfSearch) {
            inputRef.current.focus();
        }
    }, [inputRef, typeOfSearch]);

    if (typeOfSearch) return null;


    const processQueue = async () => {
        if (processingRef.current) return;
        processingRef.current = true;
        while (queueRef.current.length > 0) {
            const data = queueRef.current.shift()!;
            await addNew(data);
        }
        processingRef.current = false;
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputRef.current) {
          const cod = inputRef.current.value.trim();
          if (!cod) return;
          queueRef.current.push({ cod });
          inputRef.current.value = "";
          inputRef.current.focus();
          processQueue();
        }

    };

    return (
        <div>
            <form onSubmit={onSubmit} className="w-full">
                <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true"  className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" ></path>
                    </svg>
                </div>
                <input
                    type="text"
                    id="search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingrese el código del producto..."
                    autoComplete="off"
                    {...register("id_number", { required: true })}
                    ref={inputRef}
                />
                </div>
            </form> 
        </div>
    );
}