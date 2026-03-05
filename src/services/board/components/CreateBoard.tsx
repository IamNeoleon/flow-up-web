import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBoardMutation } from "../api/hooks";
import { Input } from "@/shared/ui/shadcn/input";
import { Button } from "@/shared/ui/shadcn/button";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { Label } from "@/shared/ui/shadcn/label";
import { cn } from "@/shared/utils/cn";
import { createBoardSchema, type CreateBoardFormValues } from "../schemas/create-board.schema";

interface IProps {
   close: () => void;
   workspaceId: string
}

export const CreateBoard = ({ close, workspaceId }: IProps) => {
   const { t } = useTranslation();
   const [create, { isLoading }] = useCreateBoardMutation();

   const { register, handleSubmit, formState: { errors } } = useForm<CreateBoardFormValues>({
      resolver: zodResolver(createBoardSchema),
      mode: 'onChange'
   });

   const handleCreate = async (data: CreateBoardFormValues) => {
      try {
         await create({ workspaceId, body: data }).unwrap();
         toast.success(t("board.createSuccess"));
         close();
      } catch {
         toast.error(t("board.createError"));
      }
   };

   return (
      <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-2">
         <div className="flex flex-col gap-2">
            <Label>{t('common.name')}</Label>
            <Input
               {...register('name')}
               placeholder={t("board.namePlaceholder")}
               className={cn(errors.name && 'border-destructive')}
            />
            {errors.name && (
               <p className="text-sm text-destructive">
                  {errors.name.message}
               </p>
            )}
         </div>
         <Button className="w-full" type="submit">
            {isLoading ? <Spinner /> : t("common.create")}
         </Button>
      </form>
   );
};
