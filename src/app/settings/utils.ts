export const canViewRole = (userRole: string, roleName: string): boolean => {
  if (userRole === "Root") return true;
  if (userRole === "Gerencia" && roleName !== "Root") return true;
  if (userRole === "Administracion" && roleName !== "Root" && roleName !== "Gerencia") return true;
  return false;
};

// el servidor no deja cambiar el rol ni eliminar al usuario propio ni a uno de rol superior (RoleHierarchy)
export const canManageUser = (userRole: string, currentUserId: string | undefined, target: any): boolean =>
  target?.id !== currentUserId && canViewRole(userRole, target?.roles?.[0]?.name ?? '');

// editar nombre o password: lo propio siempre, a otros como canManageUser (UserUpdateRequest)
export const canEditUser = (userRole: string, currentUserId: string | undefined, target: any): boolean =>
  target?.id === currentUserId || canViewRole(userRole, target?.roles?.[0]?.name ?? '');