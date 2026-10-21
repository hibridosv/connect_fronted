export interface CodeRequest {
  id: string;
  permission: string;
  permission_description: string | null;
  expires_at: string;
  created_at: string;
  // Solo viene en el listado del administrador (code-view)
  code?: string;
  user?: { id: string; name: string } | null;
}
