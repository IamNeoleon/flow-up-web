import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { useDeleteColumnMutation } from "../api/hooks/";
import { AlertDialogBlock } from "@/shared/ui/AlertDialogBlock";
import { Button } from "@/shared/ui/shadcn/button";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

interface IProps {
   boardId: string,
   colId: string
}

export const DeleteColumn = ({ boardId, colId }: IProps) => {
   const { t } = useTranslation()
   const [deleteCol] = useDeleteColumnMutation()

   const handleDelete = async () => {
      try {
         await deleteCol({ colId, boardId }).unwrap()

         toast.success(t("column.deleteSuccess"))
      } catch (error) {
         const err = getErrorMessage(error as FetchBaseQueryError | SerializedError | undefined)
         toast.error(t("column.deleteError", { error: err }))
      }
   }

   return (
      <AlertDialogBlock
         title={t("column.deleteConfirmTitle")}
         description={t("column.deleteConfirmDescription")}
         actionLabel={t("common.yes")}
         cancelLabel={t("common.cancel")}
         onClickAction={handleDelete}
      >
         <Button aria-label={t('column.delete')} size='icon' variant='ghost'>
            <Trash2 className="text-white hover:text-black" />
         </Button>
      </AlertDialogBlock>
   );
};
