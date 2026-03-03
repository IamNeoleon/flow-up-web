import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCreateTaskMutation } from "../api/hooks";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";

interface IProps {
   close: () => void;
   boardId: string;
   colId: string;
}

export const CreateTask = ({ close, boardId, colId }: IProps) => {
   const { t } = useTranslation()
   const [create] = useCreateTaskMutation()
   const [name, setName] = useState('')

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      const toastId = toast.loading(t("task.createLoading"))

      try {
         await create({
            boardId,
            colId,
            body: { name },
         }).unwrap();

         toast.success(t("task.createSuccess"), { id: toastId });
         close();
      } catch (err) {
         toast.error(t("task.createError"), { id: toastId });
      }
   }

   return (
      <>
         <form onSubmit={handleSubmit}>
            <Input value={name} onChange={(e) => setName(e.target.value)} name='title' required placeholder={t("task.createPlaceholder")} />
            <Button className='w-full mt-4' type='submit'>{t("task.create")}</Button>
         </form>
      </>
   );
};
