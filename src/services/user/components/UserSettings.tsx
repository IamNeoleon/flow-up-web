import { useTranslation } from "react-i18next";
import { ProfileSettings } from "./ProfileSettings";
import { AccountSettings } from "./AccountSettings";
import { SecuritySettings } from "./SecuritySettings";
import { useGetMeQuery } from "../api/hooks/";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs";

interface IProps {
   close: () => void;
}

export const UserSettings = ({ }: IProps) => {
   const { t } = useTranslation()
   const { data: user } = useGetMeQuery()

   if (!user) return <div>{t("user.notFound")}</div>

   return (
      <Tabs>
         <TabsList>
            <TabsTrigger value="profile">{t('user.profile')}</TabsTrigger>
            <TabsTrigger value="account">{t('user.account')}</TabsTrigger>
            <TabsTrigger value="security">{t('user.security')}</TabsTrigger>
         </TabsList>
         <TabsContent value="profile">
            <ProfileSettings user={user} />
         </TabsContent>
         <TabsContent value="account">
            <AccountSettings user={user} />
         </TabsContent>
         <TabsContent value="security">
            <SecuritySettings user={user} />
         </TabsContent>
      </Tabs>
   );
};
