import type { IBoard } from "../../types/board";

export interface CreateBoardBody {
   name: string;
}
export interface CreateBoardArgs {
   workspaceId: string;
   body: CreateBoardBody;
}
export type CreateBoardResponse = IBoard;