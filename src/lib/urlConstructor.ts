import { DateRangeValues } from "@/components/button/DateRange";

export const urlConstructor = <T extends DateRangeValues>(
  data: T,
  baseUrl: string
): string => {
  const params = new URLSearchParams();

  // Agrega todos los pares clave/valor de forma dinámica
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${params.toString()}`;
};
