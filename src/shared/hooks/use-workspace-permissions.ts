import { skipToken } from "@reduxjs/toolkit/query"
import { useGetMyWorkspaceRoleQuery } from "@/services/workspace/api/hooks/"
import { WORKSPACE_ROLE_PERMISSIONS } from "@/services/workspace/constants/workspace-permissions"
import type { TWorkspaceRole } from "@/services/workspace/types/workspace-role"

export const useWorkspacePermissions = (workspaceId: string | undefined) => {
   const { data: role } = useGetMyWorkspaceRoleQuery(workspaceId ?? skipToken)
   let effectiveRole: TWorkspaceRole = 'MEMBER'

   if (role) {
      effectiveRole = role
   }

   return {
      role: effectiveRole,
      permissions: WORKSPACE_ROLE_PERMISSIONS[effectiveRole]
   }
}