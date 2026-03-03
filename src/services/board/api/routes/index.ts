export const boardRoutes = {
   root: (workspaceId: string) =>
      `/workspaces/${workspaceId}/boards`,

   byId: (workspaceId: string, boardId: string) =>
      `/workspaces/${workspaceId}/boards/${boardId}`,

   role: (workspaceId: string, boardId: string) =>
      `/workspaces/${workspaceId}/boards/${boardId}/role`,

   members: (workspaceId: string, boardId: string) =>
      `/workspaces/${workspaceId}/boards/${boardId}/members`,

   changeRole: (workspaceId: string, boardId: string) =>
      `/workspaces/${workspaceId}/boards/${boardId}/members/change-role`,

   presignUploadImage: (workspaceId: string, boardId: string) =>
      `/workspaces/${workspaceId}/boards/${boardId}/image/presign-upload`,

   completeUploadAvatar: (workspaceId: string, boardId: string) =>
      `/workspaces/${workspaceId}/boards/${boardId}/image/complete`
} as const