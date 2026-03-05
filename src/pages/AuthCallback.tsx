import { useEffect } from "react";
import { useNavigate } from "react-router";
import { setToken } from "@/store/slices/auth-slice";
import { useRefreshMutation } from "@/services/auth/api/hooks";
import { useAppDispatch } from "@/shared/hooks/redux";
import { routes } from "@/shared/routes";
import { Spinner } from "@/shared/ui/shadcn/spinner";

const AuthCallback = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const [refresh, { data, isSuccess }] = useRefreshMutation();

   useEffect(() => {
      refresh();
   }, [refresh]);

   useEffect(() => {
      if (!isSuccess || !data) return;

      dispatch(setToken(data.accessToken));

      navigate(routes.home(), { replace: true });
   }, [isSuccess, data, dispatch, navigate]);

   return (
      <div className="h-screen flex justify-center items-center">
         <Spinner className="size-12" />
      </div>
   )
};

export default AuthCallback;
