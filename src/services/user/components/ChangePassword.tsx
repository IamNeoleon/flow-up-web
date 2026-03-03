import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useChangePasswordMutation } from "../api/hooks/";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { Label } from "@/shared/ui/shadcn/label";

export const ChangePassword = () => {
   const { t } = useTranslation();

   const [changePassword] = useChangePasswordMutation()

   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");

   const [showOld, setShowOld] = useState(false);
   const [showNew, setShowNew] = useState(false);

   const disabledChangeBtn = oldPassword.length < 8 || newPassword.length < 8;

   const handleChangePassword = async () => {
      try {
         await changePassword({
            body: {
               oldPassword,
               newPassword
            }
         }).unwrap()

         toast.success(t('user.changePasswordSuccess'))
      } catch (error) {
         toast.error(t('user.changePasswordError'))
      }

      setOldPassword('')
      setNewPassword('')
   }

   return (
      <div>
         <h2 className="font-medium text-base mb-2">{t("user.changePassword")}</h2>
         <div className="flex flex-col gap-2 mb-2">
            <div>
               <Label className="mb-1">{t("user.oldPassword")}</Label>
               <div className="relative">
                  <Input
                     type={showOld ? "text" : "password"}
                     value={oldPassword}
                     onChange={(e) => setOldPassword(e.target.value)}
                     className="pr-10"
                     autoComplete="current-password"
                  />
                  <button
                     type="button"
                     onClick={() => setShowOld((v) => !v)}
                     className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                     aria-label={showOld ? t("common.hidePassword") : t("common.showPassword")}
                  >
                     {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
               </div>
            </div>
            <div>
               <Label className="mb-1">{t("user.newPassword")}</Label>
               <div className="relative">
                  <Input
                     type={showNew ? "text" : "password"}
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     className="pr-10"
                     autoComplete="new-password"
                  />
                  <button
                     type="button"
                     onClick={() => setShowNew((v) => !v)}
                     className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                     aria-label={showNew ? t("common.hidePassword") : t("common.showPassword")}
                  >
                     {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
               </div>
            </div>
         </div>
         <div className="flex justify-end">
            <Button onClick={handleChangePassword} disabled={disabledChangeBtn}>{t("common.change")}</Button>
         </div>
      </div>
   );
};