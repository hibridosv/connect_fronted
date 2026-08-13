import useUserStore from '@/stores/UserStore';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import { useCallback, useEffect } from 'react';

const USERS_URL = 'users?filterWhere[is_visible]=1&included=roles&sort=-created_at';

export function useUsersLogic() {
  const { loadUsers, createUser, deleteUser, updateUserName, updateUserPhone, updateUserPassword, updateUserRole, saving, deleting } = useUserStore();
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

  const onUpdateUser = async (userId: string, currentUser: any, data: any) => {
    const calls: Promise<boolean>[] = [];

    if (data.name && data.name !== currentUser.name) {
      calls.push(updateUserName(`users/${userId}/name`, { name: data.name }));
    }
    if (data.phone_number) {
      calls.push(updateUserPhone(`users/${userId}/phone_number`, { phone_number: data.phone_number }));
    }

    if (calls.length === 0) {
      closeModal('editUser');
      return true;
    }

    const results = await Promise.all(calls);
    closeModal('editUser');
    reload();
    return results.every(Boolean);
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

  return { onCreateUser, onDeleteUser, onUpdateUser, onUpdatePassword, onUpdateRole, userType, saving, deleting };
}
