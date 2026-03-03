import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/shadcn/button";
import { AlertDialogBlock } from "@/shared/ui/AlertDialogBlock";
import type { IUser } from "../types/user";

interface IProps {
   user: IUser
}

export const AccountSettings = ({ user }: IProps) => {
   const { t } = useTranslation()

   const handleDeleteAccount = () => { }

   return (
      <div>
         <div>
            <h2 className="font-medium text-base mb-1">{t('user.generalInfo')}</h2>
            <ul className="flex flex-col text-sm mb-2 gap-1">
               <li className="flex justify-between items-center">
                  <span>{t('auth.email')}:</span>
                  <span className="font-medium">{user.email}</span>
               </li>
               <li className="flex justify-between items-center">
                  <span>{t('auth.username')}:</span>
                  <span className="font-medium">{user.username}</span>
               </li>
            </ul>
         </div>
         <div>
            <h2 className="font-medium text-base mb-1">{t('common.dangerZone')}</h2>
            <div>
               <AlertDialogBlock
                  title={t('user.deleteAccountTitle')}
                  description={t('user.deleteAccountDescription')}
                  cancelLabel={t('common.no')}
                  actionLabel={t('common.yes')}
                  onClickAction={handleDeleteAccount}
               >
                  <Button className="bg-red-600 hover:bg-red-400">{t('user.deleteAccount')}</Button>
               </AlertDialogBlock>
            </div>
         </div>
      </div>
   );
};