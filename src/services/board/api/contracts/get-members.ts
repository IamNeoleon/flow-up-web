import type { IBoardMember } from "../../types/board-member";
import type { BoardParams } from "./board-params";

export type GetBoardMembersArgs = BoardParams;
export type GetBoardMembersResponse = IBoardMember[];