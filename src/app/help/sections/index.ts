import { anexos } from './anexos';
import { configuraciones } from './configuraciones';
import { cuentas } from './cuentas';
import { directorio } from './directorio';
import { efectivo } from './efectivo';
import { facturacion } from './facturacion';
import { herramientas } from './herramientas';
import { historiales } from './historiales';
import { inicio } from './inicio';
import { inventario } from './inventario';
import { mantenimientos } from './mantenimientos';
import { panel } from './panel';
import { reportes } from './reportes';
import { restaurante } from './restaurante';
import { transferencias } from './transferencias';
import { HelpSection } from './types';
import { ventas, ventasRestaurante } from './ventas';

export * from './types';

// mismo orden que el menu lateral
export const SECTIONS: HelpSection[] = [
  inicio,
  panel,
  ventas,
  ventasRestaurante,
  restaurante,
  inventario,
  efectivo,
  cuentas,
  directorio,
  historiales,
  herramientas,
  mantenimientos,
  reportes,
  facturacion,
  transferencias,
  anexos,
  configuraciones,
];
