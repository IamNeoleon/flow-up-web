import { Check } from "lucide-react";

export const MainLogo = () => {
   return (
      <div className="flex items-center gap-1 text-primary">
         <div className="relative w-[30px] h-[30px] border-[3px] border-primary rounded-[5px]">
            <Check strokeWidth={3.5} size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
         </div>
         <div className="text-2xl font-bold">
            <span>Flow</span>
            <span className="brightness-70">Up</span>
         </div>
      </div>
   );
};
