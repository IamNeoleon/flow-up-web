import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ContentEditable from "react-contenteditable";
import { useDebouncedCallback } from "use-debounce";
import { Trash2 as DeleteIcon } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";
import { useDeleteSubtaskMutation, useUpdateSubtaskMutation } from "../api/hooks";
import { selectCurrentBoardId } from "@/store/slices/board-slice";
import { useAppSelector } from "@/shared/hooks/redux";
import { cn } from "@/shared/utils/cn";
import type { ITaskTodo } from "../types/task-todo";

interface IProps {
   taskId: string;
   colId: string;
   subtask: ITaskTodo;
}

export const TaskSubtask = ({ subtask, colId, taskId }: IProps) => {
   const { t } = useTranslation();
   const boardId = useAppSelector(selectCurrentBoardId);
   const [localSubtask, setLocalSubtask] = useState(subtask);

   const [updateSubtask] = useUpdateSubtaskMutation();
   const [deleteSubtask] = useDeleteSubtaskMutation();

   const debouncedUpdate = useDebouncedCallback(
      async (updated: ITaskTodo) => {
         try {
            await updateSubtask({
               boardId,
               colId,
               taskId,
               subtaskId: updated.id,
               body: { title: updated.title, completed: updated.completed }
            }).unwrap();
         } catch {
            toast.error(t("task.subtaskUpdateError"));
            setLocalSubtask(subtask);
         }
      },
      500
   );

   const handleChange = (value?: string, type?: "title" | "completed") => {
      const updated: ITaskTodo =
         type === "completed"
            ? { ...localSubtask, completed: !localSubtask.completed }
            : { ...localSubtask, title: value ?? "" };

      setLocalSubtask(updated);
      debouncedUpdate(updated);
   };

   const handleDeleteSubtask = () => {
      try {
         deleteSubtask({
            boardId,
            colId,
            taskId,
            subtaskId: subtask.id
         }).unwrap()
      } catch (error) {
         toast.error(t("task.subtaskDeleteError"))
      }
   }

   useEffect(() => {
      setLocalSubtask(subtask);
   }, [subtask]);

   return (
      <div className="relative flex gap-2 items-center group">
         <Checkbox
            checked={localSubtask.completed}
            onCheckedChange={() => handleChange(undefined, "completed")}
         />
         <ContentEditable
            html={localSubtask.title}
            onChange={e => handleChange(e.target.value, "title")}
            className={cn(
               "text-lg outline-none cursor-text border-b border-transparent",
               "focus:border-blue-500",
               localSubtask.completed && "line-through text-muted-foreground"
            )}
         />
         <DeleteIcon onClick={handleDeleteSubtask} size={18} className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
      </div>
   );
};

