import useUserStore from '@/stores/UserStore';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import { useCallback, useEffect } from 'react';

const USERS_URL = 'users?filterWhere[is_visible]=1&included=roles&sort=-created_at';

export function useUsersLogic() {
  const { loadUsers, createUser, deleteUser, updateUserName, updateUserPassword, updateUserRole, saving, deleting } = useUserStore();
  const { closeModal } = useModalStore();
  const { tenant } = useConfigStore();

  const userType = tenant?.system === 2 || tenant?.system === 4 ? 'Mesero' : 'Usuario';

  useEffect(() => {
    loadUsers(USERS_URL);
  }, [loadUsers]);

  const reload = useCallback(() => {
    loadUsers(USERS_URL);
  }, [loadUsers]);

  const onCreateUser = async (data: any) => {
    const success = await createUser(data);
    if (success) reload();
    return success;
  };

  const onDeleteUser = async (id: string) => {
    closeModal('deleteUser');
    const success = await deleteUser(`users/${id}`);
    if (success) reload();
  };

  const onUpdateName = async (userId: string, data: any) => {
    const success = await updateUserName(`users/${userId}/name`, data);
    if (success) {
      closeModal('editUserName');
      reload();
    }
    return success;
  };

  const onUpdatePassword = async (userId: string, data: any) => {
    const success = await updateUserPassword(`users/${userId}/password`, data);
    if (success) {
      closeModal('editUserPassword');
    }
    return success;
  };

  const onUpdateRole = async (userId: string, roleName: string) => {
    const success = await updateUserRole({ role: roleName, user: userId });
    if (success) {
      closeModal('editUserRole');
      reload();
    }
    return success;
  };

  return { onCreateUser, onDeleteUser, onUpdateName, onUpdatePassword, onUpdateRole, userType, saving, deleting };
}
