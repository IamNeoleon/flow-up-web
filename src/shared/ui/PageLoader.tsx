import { Spinner } from "./shadcn/spinner";

export const PageLoader = () => {
   return (
      <div className="h-screen flex justify-center items-center">
         <Spinner className="size-12" />
      </div>
   );
};