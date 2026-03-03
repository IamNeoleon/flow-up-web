import { authApi } from "../authApi";

export const {
   useRegisterMutation,
   useLoginMutation,
   useRefreshMutation,
   useLazyGoogleLoginQuery,
   useLogoutMutation,
   useSendCodeMutation,
   useVerifyCodeMutation,
} = authApi;