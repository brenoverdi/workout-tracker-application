import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock, Dumbbell, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

// API Services
const fetchSessions = async () => {
  return apiClient.get("/sessions");
};

export function SessionHistory() {
  const { t } = useTranslation();
  const { data: sessionsResponse, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  const sessions = (sessionsResponse as any)?.data?.items;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('history.title')}</h1>
      </div>

      <div className="space-y-4">
        {isLoading ? (
             Array.from({ length: 5 }).map((_, i) => (
                 <div key={i} className="h-24 w-full bg-card animate-pulse rounded-xl border border-border/50" />
             ))
        ) : sessions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card/20 rounded-2xl border border-dashed">
                <Dumbbell className="h-12 w-12 mb-4 opacity-20" />
                <p>{t('history.empty')}</p>
            </div>
        ) : (
          sessions?.map((session: any) => (
            <Card key={session.id} className="transition-all hover:bg-muted/50 cursor-pointer border-none bg-card/40">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                     <CardTitle className="text-lg">{session.programName || "Free Session"}</CardTitle>
                     <CardDescription className="flex items-center mt-1">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(session.startTime), "PPP")} • {format(new Date(session.startTime), "p")}
                     </CardDescription>
                  </div>
                  {session.prCount > 0 && (
                      <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full text-xs font-medium border border-yellow-500/20">
                          <Trophy className="mr-1 h-3 w-3" />
                          {session.prCount} PRs
                      </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {session.endTime ? t('history.completed') : t('history.inProgress')}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Dumbbell className="mr-2 h-4 w-4" />
                    {session.totalVolume} kg
                  </div>
                  <div className="flex items-center text-muted-foreground">
                      <span className="font-semibold mr-1">{session.exerciseCount || 0}</span> {t('history.exercises')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
