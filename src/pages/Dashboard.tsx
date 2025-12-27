import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Dumbbell, 
  Flame, 
  Trophy, 
  Clock, 
  ChevronRight,
  Plus,
  Search
} from "lucide-react";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const fetchDashboardData = async () => {
    return apiClient.get("/dashboard");
};

const fetchStats = async () => {
    return apiClient.get("/analytics/stats");
};

const fetchProgress = async () => {
    return apiClient.get("/analytics/progress");
};

const fetchPrograms = async () => {
    return apiClient.get("/programs");
};

const startSession = async ({ programId }: { programId?: string } = {}) => {
    return apiClient.post("/sessions", {
        startTime: new Date().toISOString(),
        programId
    });
};

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programSearch, setProgramSearch] = useState("");

  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  const { data: progress } = useQuery({
    queryKey: ["progress"],
    queryFn: fetchProgress,
  });

  const { data: programsResponse } = useQuery({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
  });

  const startMutation = useMutation({
    mutationFn: startSession,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["latest-session"] });
        navigate("/workout");
    }
  });

  const dashboardData = (dashboard as any)?.data;
  const statsData = (stats as any)?.data;
  const progressData = (progress as any)?.data?.progress;
  const programs = (programsResponse as any)?.data?.items;

  const filteredPrograms = programs?.filter((p: any) => 
    p.name.toLowerCase().includes(programSearch.toLowerCase())
  );

  const statItems = [
    { label: t('dashboard.stats.totalVolume'), value: statsData?.totalVolume ? `${(statsData.totalVolume / 1000).toFixed(1)}k kg` : "0", icon: Dumbbell, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: t('dashboard.stats.totalWorkouts'), value: statsData?.totalWorkouts || "0", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Calories Burned", value: statsData?.totalCaloriesBurned || "0", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: t('dashboard.stats.streak'), value: statsData?.activeStreak ? `${statsData.activeStreak} Days` : "0 Days", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground mt-1">Keep crushing your goals.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="w-full md:w-auto gap-2 shadow-lg shadow-primary/25">
                    <Plus className="h-4 w-4" />
                    {t('dashboard.startWorkout')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('dashboard.modal.title')}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{t('dashboard.modal.description')}</p>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3 h-auto py-4 border-dashed hover:border-primary hover:bg-primary/5 group"
                        onClick={() => startMutation.mutate({})}
                        disabled={startMutation.isPending}
                    >
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold">{t('dashboard.modal.freeSession')}</p>
                            <p className="text-xs text-muted-foreground">{t('dashboard.modal.freeSessionDesc')}</p>
                        </div>
                    </Button>

                    <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('dashboard.modal.selectProgram')}</p>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder={t('dashboard.modal.searchPrograms')} 
                                className="pl-8"
                                value={programSearch}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgramSearch(e.target.value)}
                            />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {filteredPrograms?.map((program: any) => (
                                <Button 
                                    key={program.id}
                                    variant="ghost" 
                                    className="w-full justify-start h-auto py-3 px-3 hover:bg-muted"
                                    onClick={() => startMutation.mutate({ programId: program.id })}
                                    disabled={startMutation.isPending}
                                >
                                    <div className="text-left">
                                        <p className="font-semibold text-sm">{program.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{program.duration || "No duration"}</p>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item, i) => (
          <Card key={i} className="border-none bg-card/40 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? <span className="h-6 w-12 bg-muted animate-pulse rounded inline-block" /> : item.value}
                  </p>
                </div>
                <div className={`${item.bg} p-2.5 rounded-xl`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="md:col-span-4 lg:col-span-5 bg-card/30 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1">
                <CardTitle className="text-lg pb-0">{t('dashboard.trainingLoad')}</CardTitle>
                <p className="text-xs text-muted-foreground">Volume distribution across the last sessions.</p>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={progressData} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-3 lg:col-span-2 bg-card border-none">
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dashLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
                  ))
              ) : dashboardData?.recentSessions?.length > 0 ? (
                dashboardData.recentSessions.map((session: any) => (
                    <div key={session.id} className="flex items-center group cursor-pointer">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="ml-4 space-y-1 flex-1">
                            <p className="text-sm font-semibold leading-none">{session.programName || "Free Session"}</p>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(session.startTime), "PP")} • {session.totalVolume}kg
                            </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                ))
              ) : (
                <div className="text-center py-8">
                    <Activity className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">No recent activity found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
