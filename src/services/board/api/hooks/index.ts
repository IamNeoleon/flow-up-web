import { boardApi } from "../boardApi";

export const {
   useGetBoardQuery,
   useCreateBoardMutation,
   useEditBoardMutation,
   useGetMyBoardRoleQuery,
   useGetBoardMembersQuery,
   useChangeBoardRoleMutation,
   useDeleteBoardMutation,
   usePresignUploadImageMutation,
   useCompleteUploadImageMutation,
} = boardApi;