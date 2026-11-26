// Tipos del manual de usuario de la pagina de ayuda (el contenido vive en help.json)

/** Sistema para el que aplica una seccion (si no se indica, aplica a todos) */
export type HelpSystem = 'products' | 'restaurant';

/** Procedimiento paso a paso */
export interface HelpGuide {
  title: string;
  steps: string[];
}

export interface HelpSubsection {
  id: string;
  title: string;
  /** Nombre del icono (ver icons.tsx) */
  icon: string;
  /** Ruta de la pagina; solo rutas sin parametros para poder abrirla desde la guia */
  route?: string;
  /** Donde se encuentra en el menu lateral */
  menu?: string;
  description: string;
  guides?: HelpGuide[];
  /** Lo que se ve en la pantalla */
  features?: string[];
  tips?: string[];
  warnings?: string[];
  system?: HelpSystem;
  /** Solo se muestra con esta configuracion principal activa (activeConfig), igual que el menu */
  feature?: string;
}

export interface HelpSection {
  id: string;
  label: string;
  /** Nombre del icono (ver icons.tsx) */
  icon: string;
  color: string;
  description?: string;
  system?: HelpSystem;
  /** Solo se muestra con esta configuracion principal activa (activeConfig), igual que el menu */
  feature?: string;
  subsections: HelpSubsection[];
}

export interface HelpContent {
  sections: HelpSection[];
}
