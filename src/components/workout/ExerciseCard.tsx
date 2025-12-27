import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Plus, MoreVertical, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetRow } from "./SetRow";

interface ExerciseCardProps {
  exercise: any;
  sessionId: string;
}

export function ExerciseCard({ exercise, sessionId }: ExerciseCardProps) {
  const queryClient = useQueryClient();
  
  // API: Add Set
  const addSetMutation = useMutation({
      mutationFn: () => apiClient.post(`/sessions/${sessionId}/sets`, {
          exerciseId: exercise.exerciseId,
          reps: 0,
          weight: 0,
          order: exercise.sets?.length + 1 || 1
      }),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["latest-session"] });
      }
  });

  return (
    <Card className="overflow-hidden border-none bg-card shadow-lg ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="text-xs font-bold uppercase">{exercise.name?.charAt(0)}</span>
          </div>
          <div>
            <CardTitle className="text-base font-bold text-primary group-hover:text-primary transition-colors">
              {exercise.name}
            </CardTitle>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
               {exercise.muscleGroup || "Bodyweight"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <History className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[3rem_1fr_1fr_3.5rem] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40">
          <div className="text-center">Set</div>
          <div className="text-center">Weight (kg)</div>
          <div className="text-center">Reps</div>
          <div className="text-center">Status</div>
        </div>
        <div className="divide-y divide-border/30">
          {exercise.sets?.map((set: any, index: number) => (
            <SetRow key={set.id} set={set} index={index + 1} />
          ))}
        </div>
        <div className="p-3">
          <Button 
            variant="ghost" 
            className="w-full justify-center gap-2 text-xs font-bold hover:bg-primary/5 hover:text-primary"
            onClick={() => addSetMutation.mutate()}
            disabled={addSetMutation.isPending}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
