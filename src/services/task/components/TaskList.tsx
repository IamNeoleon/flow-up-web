import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import { CreateTask } from "./CreateTask";
import { useModal } from "@/app/providers/ModalProvider";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/board-slice";
import type { ITaskPreview } from "../types/task-preview";

interface IProps {
   tasks: ITaskPreview[];
   colId: string;
   color?: string;
}

export const TaskList = ({ tasks, colId, color }: IProps) => {
   const [, setSearchParams] = useSearchParams();
   const { t } = useTranslation();
   const { open, close } = useModal();
   const permissions = useAppSelector(selectPermissions);
   const { boardId } = useParams();

   const openTask = useCallback((colId: string, taskId: string) => {
      setSearchParams((prev) => {
         const next = new URLSearchParams(prev);
         next.set("colId", colId);
         next.set("taskId", taskId);
         return next;
      });
   }, [setSearchParams]);

   const sortedTasks = useMemo(() => {
      return [...tasks].sort((a, b) => a.order - b.order);
   }, [tasks]);

   const handleCreateTask = useCallback(() => {
      if (!boardId) return;
      open({
         title: t("task.create"),
         description: t("task.createDescription"),
         content: <CreateTask close={close} boardId={boardId} colId={colId} />,
      });
   }, [boardId, colId, open, close, t]);

   if (!boardId) return null;

   return (
      <div className="flex flex-col h-full">
         <Droppable droppableId={colId} type="TASK">
            {(provided) => (
               <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="
                     flex-1 min-h-0 overflow-y-auto overflow-x-hidden
                     [&::-webkit-scrollbar]:w-1.5
                     [&::-webkit-scrollbar-track]:bg-transparent
                     [&::-webkit-scrollbar-thumb]:rounded-full
                     [&::-webkit-scrollbar-thumb]:bg-white/20
                     hover:[&::-webkit-scrollbar-thumb]:bg-white/30
                  "
               >
                  {sortedTasks.map((task, index) => (
                     <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                     >
                        {(taskProvided, dragSnapshot) => (
                           <li
                              ref={taskProvided.innerRef}
                              {...taskProvided.draggableProps}
                              className={dragSnapshot.isDragging ? "z-50" : undefined}
                           >
                              <TaskCard
                                 task={task}
                                 color={color}
                                 openTask={openTask}
                                 dragHandleProps={permissions?.canMoveTask ? taskProvided.dragHandleProps : null}
                              />
                           </li>
                        )}
                     </Draggable>
                  ))}
                  {provided.placeholder}
               </ul>
            )}
         </Droppable>

         {permissions?.canCreateTask && (
            <div className="pt-2 shrink-0">
               <button
                  onClick={handleCreateTask}
                  className="relative w-full text-left p-3 transition-colors rounded-lg"
               >
                  <div
                     style={{ backgroundColor: color }}
                     className="absolute inset-0 rounded-lg transition-colors brightness-[0.4] hover:brightness-50"
                  />
                  <span
                     style={{ color }}
                     className="font-medium relative z-10 pointer-events-none"
                  >
                     {t("task.newTask")}
                  </span>
               </button>
            </div>
         )}
      </div>
   );
};