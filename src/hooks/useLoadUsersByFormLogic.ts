import { AdditionalField } from '@/components/button/DateRange';
import useUserStore from '@/stores/UserStore';
import { User } from 'next-auth';
import { useEffect, useState } from 'react';


export function useLoadUsersByFormLogic(isShow: boolean, showAllUsers: boolean = false) {
    const { loadUsers, users } = useUserStore();
    const [ fieldUsers, setFieldUsers ] = useState<AdditionalField[]>()

  useEffect(() => {
    if (isShow) {
        loadUsers(`users?included=roles&filterWhere[is_visible]==1${showAllUsers ? '' : '&filterWhere[status]==1'}&sort=-created_at`);
    }
  }, [isShow, loadUsers, showAllUsers]);


    useEffect(() => {
    if (isShow && users) {
            const filterUser = users && users.map((user: User)=>{
              return {
                  value: user.id,
                  label: user.name
              }
            })
            const fieldUsersActive: AdditionalField[] = [{
              name: 'userId',
              label: 'Seleccione un usuario',
              type: 'select',
              options : filterUser
            }]

            setFieldUsers(fieldUsersActive);

    }
  }, [isShow, users]);

  return { fieldUsers } 

}
