// Tipos del manual de usuario de la pagina de ayuda

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
  icon: React.ReactNode;
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
}

export interface HelpSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  system?: HelpSystem;
  subsections: HelpSubsection[];
}
