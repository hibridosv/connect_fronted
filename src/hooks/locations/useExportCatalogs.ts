import { useEffect, useState } from "react";

export interface CatalogEntry {
  code: string;
  name: string;
}

// Catalogo CAT-027 del Ministerio de Hacienda (recinto fiscal: aduanas y zonas francas)
export const useRecintosFiscales = () => {
  const [recintos, setRecintos] = useState<CatalogEntry[] | null>(null);

  useEffect(() => {
    fetch('/recinto-fiscal.json')
      .then((response) => response.json())
      .then((jsonData) => setRecintos(jsonData))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return { recintos };
};

// Catalogo CAT-028 del Ministerio de Hacienda (regimen de exportacion)
export const useRegimenesExportacion = () => {
  const [regimenes, setRegimenes] = useState<CatalogEntry[] | null>(null);

  useEffect(() => {
    fetch('/regimen-exportacion.json')
      .then((response) => response.json())
      .then((jsonData) => setRegimenes(jsonData))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return { regimenes };
};
