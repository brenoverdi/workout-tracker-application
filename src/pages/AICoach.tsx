import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Send, Bot, User, Sparkles, Loader2, Dumbbell, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const askCoach = async (question: string) => {
  return apiClient.post("/ai-coach/chat", { question });
};

export function AICoach() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Fitness Coach. How can I help you with your training today?",
      timestamp: new Date(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const mutation = useMutation({
    mutationFn: askCoach,
    onSuccess: (response: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: response.data?.text || response.data || "I'm sorry, I couldn't process that.",
          timestamp: new Date(),
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "I'm having trouble connecting to the server. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    mutation.mutate(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                AI Coach
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </h1>
            <p className="text-muted-foreground">Get personalized training advice and workout plans.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 px-1 pb-4 scroll-smooth no-scrollbar"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-full gap-3",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                message.role === "assistant" ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
            )}>
                {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-sm leading-relaxed",
                message.role === "assistant" 
                    ? "bg-card border border-border text-foreground" 
                    : "bg-primary text-primary-foreground font-medium"
            )}>
                {message.content}
                <div className={cn(
                    "text-[10px] mt-1 opacity-50",
                    message.role === "user" ? "text-right" : "text-left"
                )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
          </div>
        ))}
        {mutation.isPending && (
            <div className="flex w-full gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20 text-primary">
                    <Bot className="h-4 w-4" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
            </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                  { icon: Dumbbell, text: "Critique my pushday" },
                  { icon: Zap, text: "Fix my squat form" },
                  { icon: Sparkles, text: "Suggest a 4-day split" },
                  { icon: Bot, text: "Nutrition for fat loss" }
              ].map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                        setInput(s.text);
                    }}
                    className="flex items-center gap-2 p-3 rounded-xl border bg-card hover:border-primary transition-all text-xs font-medium text-left group"
                  >
                      <s.icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                      {s.text}
                  </button>
              ))}
          </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative mt-auto">
        <Input
          placeholder="Ask anything about your training..."
          className="pr-12 py-6 rounded-2xl bg-card border-border shadow-xl focus-visible:ring-primary/50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 top-1.5 h-12 w-12 rounded-xl"
            disabled={!input.trim() || mutation.isPending}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
