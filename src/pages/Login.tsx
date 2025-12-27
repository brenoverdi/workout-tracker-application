import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dumbbell, Loader2, Sparkles, ShieldCheck } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await authService.login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 mb-4 transform hover:scale-110 transition-transform duration-300">
                <Dumbbell className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Antigravity
            </h1>
            <p className="text-muted-foreground mt-2 text-center">Track your progress, break your limits.</p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary transition-all h-12"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                    <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
                </div>
                <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary transition-all h-12"
                />
              </div>

              {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-xs font-medium animate-shake">
                      {error}
                  </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/25 disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Demo Preview</span>
                    </div>
                </div>

                <Button 
                    variant="outline" 
                    className="w-full mt-4 border-border/50 hover:bg-muted font-semibold h-11"
                    onClick={() => {
                        setEmail("admin@workout.com");
                        setPassword("admin_pass_123");
                    }}
                >
                    Use Admin Demo Account
                </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <a href="#" className="text-primary font-bold hover:underline">Join the team</a>
        </p>

        <div className="flex items-center justify-center gap-6 mt-12 opacity-30">
            <div className="flex items-center gap-1.5 grayscale">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 grayscale">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">AI Optimized</span>
            </div>
        </div>
      </div>
    </div>
  );
}
