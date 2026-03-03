import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts";
import { usePriorityConfig } from "../config/use-priority-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import type { TaskCountByPriority } from "../../types";
import type { ITaskPriority, TTaskPriorityName } from "@/services/task/types/task-priority";

interface IProps {
   data: TaskCountByPriority | undefined;
   priorities: ITaskPriority[] | undefined;
}

const DEFAULT_COLOR = "#a855f7";

type PriorityConfigType = Partial<Record<TTaskPriorityName | 'Without', { color: string; label: string }>>

type CustomTooltipProps = TooltipProps<number, string> & {
   total: number
   config: PriorityConfigType | undefined
}

const CustomTooltip = ({ active, payload, total, config }: CustomTooltipProps) => {
   if (!active || !payload?.length) return null;

   const { t } = useTranslation()

   const { name, value } = payload[0].payload;
   const color = config?.[name as TTaskPriorityName | 'Without']?.color ?? DEFAULT_COLOR;
   const percent = Math.round((value / total) * 100);
   console.log(value);


   return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md text-sm relative z-10">
         <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full" style={{ background: color }} />
            <span className="font-medium text-popover-foreground">{t(`priority.${name.toLowerCase()}`)}</span>
         </div>
         <p className="text-muted-foreground lowercase">
            {value} {value !== 1 ? t('task.titleMany') : t('task.title')} · {percent}%
         </p>
      </div>
   );
};

export const PieStatistics = ({ data, priorities }: IProps) => {
   const { t } = useTranslation()

   const config = usePriorityConfig(priorities);

   const dataPie = useMemo(() => {
      if (!data) return [];
      return Object.entries(data).map(([name, value]) => ({ name, value }));
   }, [data]);

   const total = useMemo(() => dataPie.reduce((sum, d) => sum + d.value, 0), [dataPie]);
   const hasData = dataPie.some((d) => d.value > 0);


   const content = (() => {
      if (!data || !hasData || !dataPie) {
         return (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
               {t('task.empty')}
            </div>
         );
      }

      return (
         <div className="flex items-center gap-6 w-full">
            <div className="relative shrink-0" >
               <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                     <Pie
                        data={dataPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={0}
                        dataKey="value"
                        strokeWidth={0}
                     >
                        {dataPie.map((entry) => (
                           <Cell
                              key={entry.name}
                              fill={
                                 entry.value === 0
                                    ? "hsl(var(--muted))"
                                    : (config?.[entry.name as TTaskPriorityName | 'Without']?.color ?? DEFAULT_COLOR)
                              }
                              opacity={entry.value === 0 ? 0.3 : 1}
                           />
                        ))}
                     </Pie>
                     <Tooltip content={<CustomTooltip total={total} config={config} />} />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-foreground">{total}</span>
                  <span className="text-sm text-muted-foreground font-medium">{t('common.total')}</span>
               </div>
            </div>

            <div className="flex flex-col gap-2.5 flex-1">
               {dataPie.map((entry) => {
                  const color = config?.[entry.name as TTaskPriorityName | 'Without']?.color ?? DEFAULT_COLOR;
                  const percent = total > 0 ? Math.round((entry.value / total) * 100) : 0;

                  return (
                     <div key={entry.name} className="flex items-center gap-3">
                        <span
                           className="size-2.5 rounded-full shrink-0"
                           style={{ background: color }}
                        />
                        <span className="text-base text-muted-foreground flex-1">
                           {t(`priority.${entry.name.toLowerCase()}`)}
                        </span>
                        <span className="text-base font-medium text-foreground tabular-nums">{entry.value}</span>
                        <span className="text-base text-muted-foreground tabular-nums w-8 text-right">
                           {entry.value > 0 ? `${percent}%` : "—"}
                        </span>
                     </div>
                  );
               })}
            </div>
         </div>
      )
   })()

   return (
      <Card className="w-full">
         <CardHeader>
            <CardTitle className="text-lg">{t("statistics.pieChart")}</CardTitle>
         </CardHeader>
         <CardContent>
            {content}
         </CardContent>
      </Card>
   );
};