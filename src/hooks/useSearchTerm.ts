import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';

export function useSearchTerm(searchRows: string[], delay = 300, minChars = 3) {
    const [inputValue, setInputValue] = useState("");
    const [debouncedValue] = useDebounce(inputValue, delay);

    const searchTerm = useMemo(() => {
        if (!debouncedValue || debouncedValue.length < minChars) {
            return "";
        }
        const filters = searchRows
            .map((field: string) => `filter[${field}]=${encodeURIComponent(debouncedValue)}`)
            .join('&');
        return `&${filters}`;
    }, [debouncedValue, searchRows, minChars]);

    const handleSearchTerm = (term: string) => {
        setInputValue(term);
    };

    return { searchTerm, handleSearchTerm };
}
