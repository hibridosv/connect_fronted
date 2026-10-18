import { useEffect, useState } from "react";

export interface EconomicActivity {
  code: string;
  activity: string;
  section: string;
}

// Catalogo CAT-019 del Ministerio de Hacienda (codigo de actividad economica)
export const useEconomicActivities = () => {
  const [activities, setActivities] = useState<EconomicActivity[] | null>(null);


  useEffect(() => {
    // Llamar al archivo JSON desde la carpeta public
    fetch('/economic-activities.json')
      .then((response) => response.json())
      .then((jsonData) => setActivities(jsonData))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  return { activities };
};
