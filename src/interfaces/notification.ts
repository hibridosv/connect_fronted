export interface Notification {
  id: string;
  title: string;
  content: string;
  importance: 'info' | 'warning' | 'critical' | 'maintenance';
  target_type: 'all' | 'specific';
  visible_to_roles: string[] | null;
  is_active: boolean;
  scheduled_at: string | null;
  expires_at: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  is_read?: boolean;
}
