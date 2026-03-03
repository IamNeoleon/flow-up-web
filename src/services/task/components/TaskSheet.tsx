import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { TaskDetails } from "@/services/task/components/TaskDetails";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/shadcn/sheet";

export const TaskSheet = () => {
   const { t } = useTranslation();
   const [open, setOpen] = useState(false);
   const [searchParams, setSearchParams] = useSearchParams();
   const taskId = searchParams.get('taskId');
   const colId = searchParams.get('colId');

   useEffect(() => {
      if (taskId) {
         setOpen(true)
      } else {
         setOpen(false)
      }
   }, [searchParams])

   return (
      <Sheet
         open={open}
         onOpenChange={setOpen}
      >
         <SheetContent className="overflow-y-auto" style={{ width: "45%", maxWidth: '100%' }}>
            <SheetTitle className="sr-only">
               {t('common.edit')}
            </SheetTitle>
            {taskId && colId && <TaskDetails close={() => setSearchParams({})} colId={colId} taskId={taskId} />}
         </SheetContent>
      </Sheet>
   );
};