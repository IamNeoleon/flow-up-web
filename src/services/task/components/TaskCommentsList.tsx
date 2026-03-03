import { TaskCommentItem } from "./TaskCommentItem";
import { useGetCommentsQuery } from "../api/hooks";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { cn } from "@/shared/utils/cn";

interface IProps {
   boardId: string,
   colId: string,
   taskId: string
}

export const TaskCommentsList = ({ boardId, colId, taskId }: IProps) => {
   const { data: comments, isLoading, isError } = useGetCommentsQuery({ boardId, colId, taskId })

   return (
      <div className={cn("flex flex-col gap-1 max-h-[500px] overflow-y-auto", isLoading && 'items-center justify-center')}>
         {
            isLoading ? (
               <Spinner />
            ) : (
               !isError ? (
                  comments?.map(com => (
                     <TaskCommentItem
                        key={com.id}
                        comment={com}
                        boardId={boardId}
                        colId={colId}
                        taskId={taskId}
                     />
                  ))
               ) : (
                  <div>error</div>
               )
            )
         }
      </div>
   );
};
