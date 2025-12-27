import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SetRowProps {
  set: any;
  index: number;
}

export function SetRow({ set, index }: SetRowProps) {
  const queryClient = useQueryClient();
  const [weight, setWeight] = useState(set.weight?.toString() || "");
  const [reps, setReps] = useState(set.reps?.toString() || "");
  const [isCompleted, setIsCompleted] = useState(set.isCompleted || false);

  // Sync with prop changes (from API refresh)
  useEffect(() => {
    setWeight(set.weight?.toString() || "");
    setReps(set.reps?.toString() || "");
    setIsCompleted(set.isCompleted || false);
  }, [set]);

  // API: Update Set
  const updateMutation = useMutation({
      mutationFn: (data: any) => apiClient.put(`/sessions/sets/${set.id}`, data),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["latest-session"] });
      }
  });

  const handleToggle = () => {
      const newStatus = !isCompleted;
      setIsCompleted(newStatus);
      updateMutation.mutate({ 
          weight: parseFloat(weight) || 0, 
          reps: parseInt(reps, 10) || 0,
          isCompleted: newStatus
      });
  };

  const handleBlur = () => {
      updateMutation.mutate({ 
          weight: parseFloat(weight) || 0, 
          reps: parseInt(reps, 10) || 0,
          isCompleted
      });
  };

  return (
    <div className={cn(
        "grid grid-cols-[3rem_1fr_1fr_3.5rem] items-center px-4 py-2 transition-colors",
        isCompleted ? "bg-emerald-500/5" : "bg-transparent"
    )}>
      <div className="text-center text-xs font-bold text-muted-foreground">{index}</div>
      <div className="px-2">
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onBlur={handleBlur}
          placeholder="0"
          className="h-9 border-none bg-muted/40 text-center text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary shadow-none"
        />
      </div>
      <div className="px-2">
        <Input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          onBlur={handleBlur}
          placeholder="0"
          className="h-9 border-none bg-muted/40 text-center text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary shadow-none"
        />
      </div>
      <div className="flex justify-center">
        <button 
           onClick={handleToggle}
           className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-all",
            isCompleted 
                ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "border-border/60 text-transparent hover:border-emerald-500/50"
           )}
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <Check className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
