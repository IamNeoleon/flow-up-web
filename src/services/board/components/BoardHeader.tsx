import { useState } from "react";
import ContentEditable from "react-contenteditable";
import { Trash2, Users, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDeleteBoardMutation, useEditBoardMutation } from "../api/hooks/";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/board-slice";
import { CreateColumn } from '@/services/column/components/CreateColumn'
import { useModal } from '@/app/providers/ModalProvider'
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/shared/ui/shadcn/breadcrumb"
import { Button } from "@/shared/ui/shadcn/button";
import { BoardMembers } from "./BoardMembers";
import { AlertDialogBlock } from "@/shared/ui/AlertDialogBlock";
import { routes } from "@/shared/routes";
import type { IWorkspace } from "@/services/workspace/types/workspace";

interface IProps {
   workspaceId: string;
   boardId: string;
   boardTitle: string;
   currentWorkspace: IWorkspace | null
}

export const BoardHeader = ({ workspaceId, boardId, boardTitle, currentWorkspace }: IProps) => {
   const { t } = useTranslation()
   const { open, close } = useModal()
   const navigate = useNavigate()
   const permissions = useAppSelector(selectPermissions)

   const [editBoard] = useEditBoardMutation();
   const [deleteBoard] = useDeleteBoardMutation();

   const [title, setTitle] = useState(boardTitle);

   const handleSave = async (e: React.FocusEvent<HTMLDivElement>) => {
      const value = e.currentTarget.textContent || "";

      try {
         if (value !== boardTitle) {
            await editBoard({ workspaceId, boardId, body: { name: value } }).unwrap();
         }
      } catch (error) {
         toast.error(t("board.saveError"));
      }
   };

   const handleCreateCol = () => {
      open({
         title: t("column.create"),
         description: t("column.createDescription"),
         content: <CreateColumn boardId={boardId} close={close} />,
      })
   }

   const handleOpenMembers = () => {
      open({
         title: t("board.membersTitle"),
         description: t("board.membersDescription"),
         content: <BoardMembers workspaceId={workspaceId} boardId={boardId} close={close} />,
      })
   }

   const handleDeleteBoard = async () => {
      try {
         await deleteBoard({
            workspaceId,
            boardId
         }).unwrap()

         toast.success(t('board.deleteBoardSuccess'))
         navigate(routes.workspace({ workspaceId }))
      } catch (error) {
         toast.error(t('board.deleteBoardError'))
      }
   }

   return (
      <div className="flex items-center justify-between mb-4 max-md:mb-3
         max-sm:flex-col max-sm:items-start
      ">
         <div className="max-sm:mb-3">
            <div className="mb-3 max-sm:mb-2">
               <ContentEditable
                  html={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={(e: React.FocusEvent<HTMLDivElement>) => handleSave(e)}
                  className="
                     hover:cursor-pointer text-4xl font-semibold 
                     border-b border-transparent focus:border-primary 
                     outline-none cursor-text max-sm:text-3xl
                  "
               />
            </div>
            <Breadcrumb>
               <BreadcrumbList>
                  <BreadcrumbItem>
                     <Link to={routes.workspace({ workspaceId })}>{currentWorkspace?.name}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                     <BreadcrumbPage>{boardTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
               </BreadcrumbList>
            </Breadcrumb>
         </div>
         <div className="flex flex-col gap-2 items-end max-sm:flex-row max-sm:justify-between max-sm:w-full">
            <div className="flex gap-2">
               <Button onClick={handleOpenMembers} variant='outline'>
                  <Users />
                  <span>
                     {t("board.membersButton")}
                  </span>
               </Button>
               {
                  permissions?.canDeleteBoard && (
                     <AlertDialogBlock
                        title={t('board.deleteTitle')}
                        description={t('board.deleteDescription')}
                        cancelLabel={t('common.cancel')}
                        actionLabel={t('common.yes')}
                        onClickAction={handleDeleteBoard}
                     >
                        <Button variant='destructive'>
                           <Trash2 color="#fff" />
                        </Button>
                     </AlertDialogBlock>
                  )
               }
            </div>
            {
               permissions?.canCreateColumn && (
                  <Button onClick={handleCreateCol} className="flex items-center gap-1">
                     <Plus />
                     <span> {t("column.create")}</span>
                  </Button>
               )
            }
         </div>
      </div >
   );
};
