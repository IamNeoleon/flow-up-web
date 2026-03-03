import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { BOARD_MEMBER_STATUS_LABELS } from "../constants/board-member-status";
import { useAppSelector } from "@/shared/hooks/redux";
import { useWorkspaceRole } from "@/shared/hooks/use-workspace-role";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/shadcn/select";
import { selectPermissions } from "@/store/slices/board-slice";
import { useChangeBoardRoleMutation } from "../api/hooks/";
import { selectUser } from "@/store/slices/user-slice";
import { getUserInitials } from "@/shared/utils/get-user-initials";
import type { TBoardRole } from "../types/board-role";
import type { IBoardMember } from "../types/board-member";

interface IProps {
   member: IBoardMember,
   workspaceId: string,
   boardId: string
}

export const BoardMember = ({ member, workspaceId, boardId }: IProps) => {
   const { t } = useTranslation()
   const permissions = useAppSelector(selectPermissions)
   const [changeRole] = useChangeBoardRoleMutation()

   const user = useAppSelector(selectUser)

   const isMe = member.userId === user?.id
   const isTargetWorkspaceOwner = useWorkspaceRole(workspaceId, member.userId) === 'OWNER'
   const isTargetBoardOwner = member.boardRole === 'OWNER'


   const disabledSelect =
      !permissions?.canChangeRole ||
      isMe ||
      isTargetWorkspaceOwner ||
      isTargetBoardOwner

   const onChangeRole = async (role: TBoardRole) => {
      try {
         await changeRole({
            workspaceId,
            boardId,
            body: {
               targetRole: role,
               targetUserId: member.userId,
            }
         }).unwrap()

         toast.success(t('workspace.roleChangeSuccess'))
      } catch (error) {
         toast.error(t('workspace.roleChangeError'))
      }
   }

   return (
      <div className="first:border-t flex items-center justify-between border-b py-2 px-2 max-sm:flex-col max-sm:items-start max-sm:gap-2">
         <div className="flex items-center gap-2">
            <Avatar>
               <AvatarImage src={member.user.avatar ?? ''} />
               <AvatarFallback>{getUserInitials(member.user.fullName)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">
               {member.user.fullName}
            </span>
         </div>
         <Select disabled={disabledSelect} value={member.boardRole} onValueChange={(value) => onChangeRole(value as TBoardRole)}>
            <SelectTrigger className="w-[180px]">
               <SelectValue placeholder={t("workspace.roleLabel")} />
            </SelectTrigger>
            <SelectContent>
               {
                  Object.entries(BOARD_MEMBER_STATUS_LABELS).map(([value, label]) => (
                     <SelectItem key={value} value={value}>{t(label)}</SelectItem>
                  ))
               }
            </SelectContent>
         </Select>
      </div>
   );
};
