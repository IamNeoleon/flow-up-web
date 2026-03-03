import { ImagePlus, LayoutGrid } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCompleteUploadImageMutation, usePresignUploadImageMutation } from "../api/hooks/";
import { isImage } from "@/shared/utils/is-image";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/shadcn/dialog";
import { BoardCropDialog } from "./BoardCropDialog";
import { MAX_IMAGE_SIZE } from "../constants/max-image-size";
import { cn } from "@/shared/utils/cn";

interface IProps {
   canUploadImage: boolean;
   image: string | undefined;
   title: string;
   workspaceId: string;
   boardId: string;
}

export const BoardCardImage = ({ title, canUploadImage, image, workspaceId, boardId }: IProps) => {
   const { t } = useTranslation();
   const [presignImage] = usePresignUploadImageMutation();
   const [completeImage] = useCompleteUploadImageMutation();

   const [src, setSrc] = useState<string | null>(null);
   const [openCropDialog, setOpenCropDialog] = useState(false);
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   useEffect(() => {
      return () => {
         if (src) URL.revokeObjectURL(src);
      };
   }, [src]);

   const onLoadImage = async (file: File) => {
      if (!isImage(file)) {
         toast.error(t("board.uploadNotImage"));
         return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
         toast.error(t("board.uploadTooLargeImage"));
         return;
      }

      const mimeType = file.type || "application/octet-stream";

      const toastId = toast.loading(t("common.loading"));

      try {
         const presigned = await presignImage({ workspaceId, boardId, body: { mimeType } }).unwrap();

         const putRes = await fetch(presigned.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": mimeType },
            body: file,
         });

         if (!putRes.ok) throw new Error(`Upload failed: ${putRes.status}`);

         await completeImage({ workspaceId, boardId, body: { key: presigned.key } }).unwrap();

         toast.success(t("board.uploadImageSuccess"), { id: toastId });
      } catch (err) {
         console.error(err);
         toast.error(t("board.uploadImageError"), { id: toastId });
      }
   };

   const closeCrop = () => {
      setOpenCropDialog(false);
      setSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
   };

   const uploadImage = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
   };

   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!isImage(file)) {
         toast.error(t("user.avatarNotImage"));
         e.target.value = "";
         return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
         toast.error(t("user.avatarTooLarge"));
         e.target.value = "";
         return;
      }

      setSrc(URL.createObjectURL(file));
      setOpenCropDialog(true);
   };

   return (
      <>
         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
         />
         <div
            className={cn(
               "aspect-250/175 overflow-hidden relative",
               !image && "bg-muted/60 flex items-center justify-center",
            )}
         >
            {image ? (
               <img
                  className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
                  src={image}
                  alt={`${title} image`}
               />
            ) : (
               <LayoutGrid className="size-10 text-muted-foreground" />
            )}

            {canUploadImage && (
               <button
                  onClick={uploadImage}
                  aria-label={t("board.uploadImage")}
                  title={t("board.uploadImage")}
                  className="absolute top-3 right-3 z-10"
                  type="button"
               >
                  <ImagePlus size={20} className="text-white/50 hover:text-white" />
               </button>
            )}
         </div>
         <Dialog
            open={openCropDialog}
            onOpenChange={(v) => {
               setOpenCropDialog(v);
               if (!v) closeCrop();
            }}
            modal={false}
         >
            <DialogContent className="w-sm p-0 rounded-lg">
               <DialogHeader className="sr-only">
                  <DialogTitle>{t("user.avatarLoadTitle")}</DialogTitle>
                  <DialogDescription>{t("user.avatarLoadDesc")}</DialogDescription>
               </DialogHeader>

               {src && (
                  <BoardCropDialog
                     src={src}
                     onDone={(file) => {
                        onLoadImage(file);
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