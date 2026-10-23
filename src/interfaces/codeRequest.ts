export interface CodeRequest {
  id: string;
  permission: string;
  permission_description: string | null;
  expires_at: string;
  created_at: string;
  // Extendido por el administrador: no se consume al usarlo y sirve hasta que vence
  reusable: boolean;
  extensions: number;
  // El usuario ya valido el codigo reutilizable; pasa sin volver a escribirlo
  verified: boolean;
  // Solo viene en el listado del administrador (code-view)
  code?: string;
  user?: { id: string; name: string } | null;
}
