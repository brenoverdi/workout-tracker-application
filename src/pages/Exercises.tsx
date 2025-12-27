import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Search, Filter, Dumbbell, ChevronRight, Play, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { getYouTubeID } from "@/lib/youtube-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// API Services
const fetchExercises = async () => {
    return apiClient.get("/exercises");
};

const fetchLatestSession = async () => {
    return apiClient.get("/sessions/latest");
};

const addExerciseToSession = async ({ sessionId, exerciseId }: { sessionId: string; exerciseId: string }) => {
    return apiClient.post(`/sessions/${sessionId}/exercises`, {
        exerciseId,
        order: 0 // Default order
    });
};

const muscleGroups = [
  "All", "Chest", "Back", "Shoulders", "Quadriceps", "Hamstrings", "Glutes", "Biceps", "Triceps", "Abs"
];

export function Exercises() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const queryClient = useQueryClient();

  const { data: exercisesResponse, isLoading } = useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  const { data: latestSessionResponse } = useQuery({
    queryKey: ["latest-session"],
    queryFn: fetchLatestSession,
  });

  const addMutation = useMutation({
    mutationFn: addExerciseToSession,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["latest-session"] });
    }
  });

  const exercises = (exercisesResponse as any)?.data?.items;
  const activeSession = (latestSessionResponse as any)?.data;

  const filteredExercises = exercises?.filter((ex: any) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === "All" || (ex.muscleGroups && ex.muscleGroups.toLowerCase() === selectedMuscle.toLowerCase());
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('menu.exercises')}</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('common.search')}
              className="pl-8 bg-card"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Muscle Group Pills */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar">
        {muscleGroups.map((muscle) => (
          <button
            key={muscle}
            onClick={() => setSelectedMuscle(muscle)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border",
              selectedMuscle === muscle
                ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-card border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            {muscle === "All" ? t('common.all') : muscle}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      <div className="grid gap-3">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-card border border-border/50" />
          ))
        ) : filteredExercises?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Dumbbell className="h-12 w-12 mb-4 opacity-20" />
            <p>{t('common.noResults')}</p>
          </div>
        ) : (
          filteredExercises?.map((exercise: any) => (
            <Dialog key={exercise.id}>
              <DialogTrigger asChild>
                <Card className="group hover:border-primary transition-all duration-300 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          <Dumbbell className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{exercise.name}</h3>
                          <div className="flex gap-2 mt-1">
                            {exercise.muscleGroups && (
                              <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider h-4">
                                {exercise.muscleGroups}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider h-4">
                              {exercise.equipmentType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] overflow-hidden p-0 gap-0">
                <div className="relative aspect-video w-full bg-muted">
                    {exercise.videoDemonstration ? (
                        <iframe 
                            src={`https://www.youtube.com/embed/${getYouTubeID(exercise.videoDemonstration)}`}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Play className="h-12 w-12 opacity-20 mb-2" />
                            <p className="text-sm">No video demonstration available</p>
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{exercise.name}</DialogTitle>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{exercise.muscleGroups}</Badge>
                            <Badge variant="outline">{exercise.equipmentType}</Badge>
                            <Badge variant="outline" className="capitalize">{exercise.difficultyLevel}</Badge>
                        </div>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Instructions</h4>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                {exercise.instructions || exercise.description || "No instructions provided."}
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button 
                            className="w-full gap-2" 
                            disabled={!activeSession || addMutation.isPending}
                            onClick={() => addMutation.mutate({ sessionId: activeSession.id, exerciseId: exercise.id })}
                        >
                            {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            {activeSession ? "Add to current workout" : "No active workout session"}
                        </Button>
                    </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          ))
        )}
      </div>
    </div>
  );
}
