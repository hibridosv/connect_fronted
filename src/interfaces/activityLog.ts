// Historial de acciones sensibles (connect: GET histories/activity)
export interface ActivityLogChanges {
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
  extra?: Record<string, any> | null;
}

// properties en texto para mostrar (connect: ActivityLog::getDetailsAttribute)
export interface ActivityLogDetails {
  changes: { label: string; before: string | null; after: string | null }[];
  data: { label: string; value: string }[];
  tables: { label: string; columns: string[]; rows: string[][] }[];
}

export interface ActivityLog {
  id: string;
  event: string;
  event_label: string;
  module: string;
  module_label: string;
  description: string;
  subject_type: string | null;
  subject_id: string | null;
  user_id: string;
  is_root: boolean;
  // Codigo de autorizacion usado para desbloquear la accion (ya va en la descripcion)
  code_request_id: string | null;
  code_request?: { id: string; permission: string } | null;
  properties: ActivityLogChanges | null;
  details?: ActivityLogDetails;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  user?: { id: string; name: string } | null;
}

export interface ActivityLogFilters {
  modules: { id: string; name: string }[];
  events: { id: string; module: string; name: string }[];
  users: { id: string; name: string }[];
}
