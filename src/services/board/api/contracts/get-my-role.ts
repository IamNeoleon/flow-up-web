import type { TBoardRole } from "../../types/board-role";
import type { BoardParams } from "./board-params";

export type GetMyBoardRoleArgs = BoardParams;
export interface GetMyBoardRoleResponse {
   role: TBoardRole;
}