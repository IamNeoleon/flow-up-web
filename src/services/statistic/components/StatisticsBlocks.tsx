import { skipToken } from "@reduxjs/toolkit/query";
import { useGetFullStatQuery } from "../api/hooks/";
import { BarStatistics } from "./charts/BarStatistics";
import { LineStatistics } from "./charts/LineStatistics";
import { PieStatistics } from "./charts/PieStatistics";
import { useGetAllPrioritiesQuery } from "@/shared/api/priorities/priorities-api";

interface IProps {
   workspaceId: string | undefined;
}

export const StatisticBlocks = ({ workspaceId }: IProps) => {
   const { data } = useGetFullStatQuery(workspaceId ?? skipToken);
   const { data: priorities } = useGetAllPrioritiesQuery()

   return (
      <div className="flex flex-col gap-5">
         <BarStatistics data={data?.cumulative} />
         <LineStatistics data={data?.flow} />
         <PieStatistics data={data?.byPriority} priorities={priorities} />
      </div>
   );
};
