import { useEffect, useState } from "react";
import { Goal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ValuePicker } from "@/shared/ui/ValuePicker";
import { Badge } from "@/shared/ui/shadcn/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/shadcn/dropdown-menu"
import { useGetAllPrioritiesQuery } from "@/shared/api/priorities/priorities-api";
import type { ITaskPriority } from "../types/task-priority";

interface IProps {
   taskPriorityId?: string,
   onChange: (value: ITaskPriority) => void,
}

export const TaskPriority = ({ taskPriorityId, onChange }: IProps) => {
   const { t } = useTranslation()
   const { data: priorities } = useGetAllPrioritiesQuery();
   const [priority, setPriority] = useState<ITaskPriority | null>(null)
   const [open, setOpen] = useState(false)

   useEffect(() => {
      if (!priorities) return

      const taskPriority = priorities.find((item) => item.id === taskPriorityId)

      if (taskPriority) {
         setPriority(taskPriority)
      }
   }, [priorities, taskPriorityId])

   return (
      <div>
         <div className="flex mb-1 gap-1 items-center text-base text-[#ada9a3] font-medium">
            <Goal width={18} />
            <span>{t("task.priority")}</span>
         </div>
         <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
               <div>
                  <ValuePicker>
                     {priority && (
                        <Badge style={{ backgroundColor: priority.color }} className="capitalize text-sm text-white">
                           {t(`priority.${priority.name.toLowerCase()}`)}
                        </Badge>
                     )}
                  </ValuePicker>
               </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
               {priorities?.map(priority => (
                  <DropdownMenuItem
                     onClick={() => {
                        setOpen(false)
                        onChange(priority)
                     }}
                  >
                     {t(`priority.${priority.name.toLowerCase()}`)}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};
