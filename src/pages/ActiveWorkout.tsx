import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/workout/ExerciseCard";
import { ChevronLeft, Clock, Pause, Square, Loader2, Play } from "lucide-react";

export function ActiveWorkout() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (!isPaused) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // API: Get Latest Session (or resume)
  const { data: latestSession, isLoading: sessionLoading } = useQuery({
      queryKey: ["latest-session"],
      queryFn: () => apiClient.get("/sessions/latest"),
  });

  // API: Complete Session
  const completeMutation = useMutation({
      mutationFn: (id: string) => apiClient.post(`/sessions/${id}/complete`, {}),
      onSuccess: () => navigate("/history"),
  });

  const session = (latestSession as any)?.data;

  if (sessionLoading) {
      return (
          <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
              <p className="text-muted-foreground mt-4">Loading your session...</p>
          </div>
      );
  }

  // If no active session, we might want to suggest starting one or redirect
  if (!session) {
      return (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
               <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Play className="h-8 w-8 fill-current" />
               </div>
               <div className="text-center">
                   <h2 className="text-xl font-bold">No Active Session</h2>
                   <p className="text-muted-foreground">Select a program or start a free session to begin tracking.</p>
               </div>
               <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
          </div>
      );
  }

  return (
    <div className="pb-24">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-40 -mx-4 mb-6 bg-background/80 px-4 py-4 backdrop-blur shadow-sm border-b md:top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold leading-none">{session.programName || "Free Session"}</h1>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                <span>{formatTime(seconds)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4" />}
              <span className="hidden sm:inline">{isPaused ? "Resume" : "Pause"}</span>
            </Button>
            <Button 
                size="sm" 
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => completeMutation.mutate(session.id)}
                disabled={completeMutation.isPending}
            >
              {completeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4 fill-current" />}
              <span className="hidden sm:inline">Finish</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-6">
        {session.exercises?.map((exercise: any) => (
          <ExerciseCard 
            key={exercise.id} 
            exercise={exercise} 
            sessionId={session.id}
          />
        ))}

        {session.exercises?.length === 0 && (
             <div className="text-center py-12 border-2 border-dashed rounded-2xl border-muted">
                 <p className="text-muted-foreground">No exercises added yet.</p>
                 <Button variant="link" className="mt-2">Add First Exercise</Button>
             </div>
        )}
      </div>

      {/* Floating Action for Mobile */}
      <div className="fixed bottom-20 right-4 md:hidden">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-2xl shadow-primary/40">
           <span className="text-2xl font-bold">+</span>
        </Button>
      </div>
    </div>
  );
}
