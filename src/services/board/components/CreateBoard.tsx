import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCreateBoardMutation } from "../api/hooks";
import { Input } from "@/shared/ui/shadcn/input";
import { Button } from "@/shared/ui/shadcn/button";
import { Spinner } from "@/shared/ui/shadcn/spinner";

interface IProps {
   close: () => void;
   workspaceId: string
}

export const CreateBoard = ({ close, workspaceId }: IProps) => {
   const { t } = useTranslation();
   const [create, { isLoading }] = useCreateBoardMutation();

   const [boardName, setBoardName] = useState<string>('')

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      try {
         await create({ workspaceId, body: { name: boardName } }).unwrap();
         toast.success(t("board.createSuccess"));
         close();
      } catch {
         toast.error(t("board.createError"));
      }
   };

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
         <Input
            name="name"
            onChange={(e) => setBoardName(e.target.value)}
            value={boardName}
            placeholder={t("board.namePlaceholder")}
            required
         />
         <Button className="w-full" type="submit">
            {isLoading ? <Spinner /> : t("common.create")}
         </Button>
      </form>
   );
};
