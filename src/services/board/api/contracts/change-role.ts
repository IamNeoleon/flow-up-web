import type { TBoardRole } from "../../types/board-role";
import type { BoardParams } from "./board-params";

export interface ChangeBoardRoleBody {
   targetUserId: string;
   targetRole: TBoardRole;
}
export interface ChangeBoardRoleArgs extends BoardParams {
   body: ChangeBoardRoleBody;
}
export type ChangeBoardRoleResponse = boolean;