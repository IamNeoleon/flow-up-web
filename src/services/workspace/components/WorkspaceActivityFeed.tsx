import { useTranslation } from "react-i18next";
import { WorkspaceActivityItem } from "./WorkspaceActivityItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { formatActivityTime } from "@/shared/lib/formate-activity-time";
import { getUserInitials } from "@/shared/utils/get-user-initials";
import type { IWorkspaceActivity } from "../types/workspace-activity";

type IProps = {
   activities: IWorkspaceActivity[];
};

export const ActivityFeed = ({ activities }: IProps) => {
   const { t } = useTranslation();

   return (
      <div className="flex flex-col rounded-lg flex-1">
         {
            activities.map((activity) => {
               switch (activity.type) {
                  case "TASK_CREATED": {
                     return (
                        <WorkspaceActivityItem
                           key={activity.id}
                           username={activity.user.fullName}
                           userAvatar={activity.user.avatar ?? ""}
                           activityLabel={t("activity.taskCreated")}
                           entityName={activity.metadata.taskName ?? ""}
                           time={formatActivityTime(activity.createdAt)}
                        />
                     );
                  }
                  case "TASK_MOVED":
                     return (
                        <div
                           key={activity.id}
                           className="flex justify-between items-center py-4 border-b max-md:flex-col max-md:items-start max-md:gap-2"
                        >
                           <div className="flex gap-2 items-center">
                              <Avatar>
                                 <AvatarImage
                                    src={activity.user.avatar ?? ""}
                                 />
                                 <AvatarFallback>
                                    {getUserInitials(activity.user.username)}
                                 </AvatarFallback>
                              </Avatar>
                              <div
                                 className="text-base flex gap-1 items-center whitespace-normal wrap-break-word
                                 max-lg:flex-wrap
                                 max-md:text-sm
                                 "
                              >
                                 <span className="font-semibold">
                                    {activity.user.fullName}
                                 </span>
                                 <span>{t("activity.taskMoved")}</span>
                                 <span className="font-semibold">
                                    {activity.metadata.taskName}
                                 </span>
                                 <span>{t("activity.toColumn")}</span>
                                 <span className="font-semibold">
                                    {activity.metadata.columnName}
                                 </span>
                              </div>
                           </div>
                           <div className="text-md text-muted-foreground italic max-md:text-sm">
                              {formatActivityTime(activity.createdAt)}
                           </div>
                        </div>
                     );
                  case "TASK_DELETED":
                     return (
                        <WorkspaceActivityItem
                           key={activity.id}
                           username={activity.user.fullName}
                           userAvatar={activity.user.avatar ?? ""}
                           activityLabel={t("activity.taskDeleted")}
                           entityName={activity.metadata.taskName ?? ""}
                           time={formatActivityTime(activity.createdAt)}
                        />
                     );
                  default:
                     return null;
               }
            })
         }
      </div>
   );
};
