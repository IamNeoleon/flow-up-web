import { useTranslation } from "react-i18next";
import { BoardCard } from "./BoardCard";
import type { IBoard } from "../types/board";

interface IProps {
   boards: IBoard[];
}

export const BoardList = ({ boards }: IProps) => {
   const { t } = useTranslation();

   const content = (() => {
      if (boards.length === 0) {
         return (
            <div className="italic py-10 w-full text-center text-base text-muted-foreground">
               {t("board.boardEmpty")}
            </div>
         )
      }

      return (
         boards.map((board) => (
            <li key={board.id}>
               <BoardCard
                  id={board.id}
                  title={board.name}
                  updatedAt={board.updatedAt}
                  workspaceId={board.workspaceId}
                  image={board.imageUrl}
               />
            </li>
         ))
      )
   })()

   return (
      <ul className="flex gap-5 flex-wrap">
         {content}
      </ul>
   );
};
