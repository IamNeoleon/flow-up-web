import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AvatarCropDialog } from "./AvatarCropDialog";
import { useCompleteUploadAvatarMutation, usePresignUploadAvatarMutation, } from "../api/hooks/";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { getUserInitials } from "@/shared/utils/get-user-initials";
import { MAX_SIZE_AVATAR } from "@/services/user/constants/max-size-avatar";
import { isImage } from "@/shared/utils/is-image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/shadcn/dialog";
import type { IUser } from "../types/user";

interface IProps {
   user: IUser;
}

export const AvatarBlock = ({ user }: IProps) => {
   const { t } = useTranslation();
   const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
   const [src, setSrc] = useState<string | null>(null);
   const [openCropDialog, setOpenCropDialog] = useState(false);

   const [presignAvatar] = usePresignUploadAvatarMutation();
   const [completeAvatar] = useCompleteUploadAvatarMutation();

   useEffect(() => {
      return () => {
         if (src) URL.revokeObjectURL(src);
      };
   }, [src]);

   const onLoadAvatar = async (file: File) => {
      if (!isImage(file)) {
         toast.error(t("user.avatarNotImage"));
         return;
      }

      if (file.size > MAX_SIZE_AVATAR) {
         toast.error(t("user.avatarTooLarge"));
         return;
      }

      const mimeType = file.type || "application/octet-stream";

      try {
         setIsLoadingAvatar(true);

         const presigned = await presignAvatar({ body: { mimeType } }).unwrap();

         const putRes = await fetch(presigned.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": mimeType },
            body: file,
         });

         if (!putRes.ok) throw new Error(`upload failed: ${putRes.status}`);

         await completeAvatar({ body: { key: presigned.key } }).unwrap();

         toast.success(t("user.avatarUpdateSuccess"));
      } catch (err) {
         console.error(err);
         toast.error(t("user.avatarUpdateError"));
      } finally {
         setIsLoadingAvatar(false);
      }
   };

   const closeCrop = () => {
      setOpenCropDialog(false);
      setSrc(null);
   };

   return (
      <>
         <div className="flex justify-center mb-1">
            <div className="relative">
               <Avatar className="block w-20 h-20 relative">
                  {isLoadingAvatar ? (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Spinner />
                     </div>
                  ) : (
                     <>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{getUserInitials(user.username)}</AvatarFallback>
                     </>
                  )}
               </Avatar>

               <div className="absolute bottom-0 right-0">
                  <label className="flex transition-colors items-center justify-center w-6 h-6 rounded-full bg-blue-700 cursor-pointer hover:bg-blue-800">
                     <Camera size={16} color="#fff" />
                     <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (!file) return;

                           setSrc(URL.createObjectURL(file));
                           setOpenCropDialog(true);
                        }}
                     />
                  </label>
               </div>
            </div>
         </div>

         <Dialog open={openCropDialog} onOpenChange={(v) => !v && closeCrop()} modal={false}>
            <DialogContent className="w-sm p-0 rounded-lg">
               <DialogHeader className="sr-only">
                  <DialogTitle>{t('user.avatarLoadTitle')}</DialogTitle>
                  <DialogDescription>{t('user.avatarLoadDesc')}</DialogDescription>
               </DialogHeader>
               {src && (
                  <AvatarCropDialog
                     src={src}
                     onDone={(file) => {
                        onLoadAvatar(file);
                        closeCrop();
                     }}
                     onCancel={closeCrop}
                  />
               )}
            </DialogContent>
         </Dialog>
      </>
   );
};