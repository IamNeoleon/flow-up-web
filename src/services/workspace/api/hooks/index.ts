import { workspaceApi } from "../workspaceApi";

export const {
   useGetWorkspacesQuery,
   useGetWorkspaceQuery,
   useCreateWorkspaceMutation,
   useUpdateWorkspaceMutation,
   useGetWorkspaceMembersQuery,
   useAddMemberMutation,
   useCheckInviteQuery,
   useJoinWorkspaceMutation,
   useGetMyWorkspaceRoleQuery,
   useChangeMemberRoleMutation,
   useDeleteMemberMutation,
   useGetActivityQuery,
   useGetStatisticsQuery,
   useLazyGetWorkspaceMembersQuery,
   useLeaveWorkspaceMutation,
   useDeleteWorkspaceMutation,
} = workspaceApi;