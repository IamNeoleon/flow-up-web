import { Suspense } from "react";
import { Outlet } from "react-router";
import { useLocation } from "react-router";

export function AppShell() {
   const location = useLocation();

   return (
      <Suspense fallback={'Loading...'}>
         <div
            key={location.pathname}
            className="w-full"
         >
            <Outlet />
         </div>
      </Suspense>
   );
}
