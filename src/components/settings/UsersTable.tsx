'use client';
import { NothingHere } from '@/components/NothingHere';
import { Button, Preset } from '@/components/button/button';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import useUserStore from '@/stores/UserStore';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';

interface UsersTableProps {
  showAll: boolean;
}

export function UsersTable({ showAll }: UsersTableProps) {
  const { users, loading } = useUserStore();
  const { setElement } = useTempStorage();
  const { openModal } = useModalStore();

  if (!users && loading) return <SkeletonTable rows={6} columns={4} />;
  if (!users) return null;

  const data = users?.data ?? users;
  if (!data || data.length === 0) return <NothingHere text="No se encontraron usuarios" />;

  const filteredUsers = showAll ? data : data.filter((u: any) => u.status !== 0);

  const handleAction = (user: any, modal: string) => {
    if (user.status === 0) return;
    setElement(modal, user);
    openModal(modal);
  };

  const getDisplayEmail = (email: string) => {
    const asteriskIndex = email?.lastIndexOf('*') ?? -1;
    return asteriskIndex === -1 ? email : email.slice(asteriskIndex + 1);
  };

  return (
    <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
      <table className="w-full text-sm text-left table-fixed">
        <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
          <tr className="border-b-2 border-bg-subtle">
            <th scope="col" className="px-2 py-3 font-bold tracking-wider border-r border-bg-subtle">Nombre</th>
            <th scope="col" className="px-2 py-3 font-bold tracking-wider border-r border-bg-subtle">Email</th>
            <th scope="col" className="px-2 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Rol</th>
            <th scope="col" className="px-2 py-3 font-bold tracking-wider text-center w-16">Acc.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-subtle">
          {filteredUsers.map((user: any) => (
            <tr
              key={user.id}
              className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${user.status === 0 ? 'opacity-50 bg-danger/10' : ''}`}
            >
              <td
                className="px-2 py-1 font-medium clickeable-table truncate"
                onClick={() => handleAction(user, 'editUserName')}
                title="Cambiar nombre"
              >
                {user.name}
              </td>
              <td
                className="px-2 py-1 clickeable-table truncate"
                onClick={() => handleAction(user, 'editUserPassword')}
                title="Cambiar password"
              >
                {getDisplayEmail(user.email)}
              </td>
              <td
                className="px-2 py-1 uppercase text-center clickeable-table"
                onClick={() => handleAction(user, 'editUserRole')}
                title="Cambiar rol"
              >
                {user.roles?.[0]?.name}
              </td>
              <td className="px-2 py-1 flex justify-center items-center text-center">
                <Button
                  preset={user.status === 1 ? Preset.smallClose : Preset.smallCloseDisable}
                  disabled={user.status === 0}
                  noText
                  onClick={() => handleAction(user, 'deleteUser')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
