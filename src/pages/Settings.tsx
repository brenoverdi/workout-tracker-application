import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { authService } from "@/services/auth.service";
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Loader2,
  Check,
  Moon,
  Sun,
  Languages,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetchProfile = async () => {
    return apiClient.get("/auth/me");
};

const updateProfile = async (data: any) => {
    return apiClient.put("/auth/profile", data);
};

type SettingsView = "main" | "security" | "preferences";

export function Settings() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<SettingsView>("main");
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  
  const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      weight: "",
      height: "",
  });

  const { data: profileResponse, isLoading } = useQuery({
      queryKey: ["profile"],
      queryFn: fetchProfile,
  });

  useEffect(() => {
    if (profileResponse?.data) {
        const user = profileResponse.data;
        setFormData({
            fullName: user.fullName || "",
            email: user.email || "",
            weight: user.weight?.toString() || "",
            height: user.height?.toString() || "",
        });
    }
  }, [profileResponse]);

  const updateMutation = useMutation({
      mutationFn: updateProfile,
  });

  const handleSave = () => {
      updateMutation.mutate({
          fullName: formData.fullName,
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height)
      });
  };

  const toggleDarkMode = (checked: boolean) => {
    setIsDark(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (isLoading) {
      return (
          <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
          </div>
      );
  }

  if (view === "security") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setView("main")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('settings.security')}</h1>
            <p className="text-muted-foreground">{t('settings.securityDesc')}</p>
          </div>
        </div>

        <Card className="border-none bg-card/50">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Keep your account secure by using a strong password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" placeholder="••••••••" className="bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="••••••••" className="bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="••••••••" className="bg-background/50 border-border/50" />
            </div>
            <div className="flex justify-end pt-2">
                <Button className="px-8">Update Password</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/50">
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-sm">Enable 2FA</p>
                <p className="text-xs text-muted-foreground">Requires a code from an authenticator app to sign in.</p>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === "preferences") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setView("main")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('settings.appPreferences')}</h1>
            <p className="text-muted-foreground">{t('settings.appPreferencesDesc')}</p>
          </div>
        </div>

        <Card className="border-none bg-card/50">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                  {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t('settings.darkMode')}</p>
                  <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
                </div>
              </div>
              <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                  <Languages className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t('settings.language')}</p>
                  <p className="text-xs text-muted-foreground">Choose your preferred language.</p>
                </div>
              </div>
              <Select value={i18n.language.split('-')[0]} onValueChange={changeLanguage}>
                <SelectTrigger className="w-[140px] bg-background/50">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.description')}</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card className="border-none bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-4">
               <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/20">
                  <User className="h-8 w-8 text-primary" />
               </div>
               <div>
                  <CardTitle>{t('settings.profile')}</CardTitle>
                  <CardDescription>{t('settings.profileDesc')}</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="uppercase tracking-wider text-muted-foreground ml-1">{t('settings.fullName')}</Label>
                <Input 
                    value={formData.fullName} 
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    placeholder="John Doe" 
                    className="bg-background/50 border-border/50" 
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase tracking-wider text-muted-foreground ml-1">{t('settings.email')}</Label>
                <Input 
                    value={formData.email} 
                    disabled
                    placeholder="john@example.com" 
                    className="bg-muted/50 border-border/50 opacity-60" 
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                 <Label className="uppercase tracking-wider text-muted-foreground ml-1">{t('settings.weight')}</Label>
                 <Input 
                    type="number"
                    value={formData.weight} 
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                    placeholder="80" 
                    className="bg-background/50 border-border/50" 
                 />
              </div>
              <div className="space-y-2">
                 <Label className="uppercase tracking-wider text-muted-foreground ml-1">{t('settings.height')}</Label>
                 <Input 
                    type="number"
                    value={formData.height} 
                    onChange={e => setFormData({...formData, height: e.target.value})}
                    placeholder="180" 
                    className="bg-background/50 border-border/50" 
                 />
              </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button 
                    className="gap-2 px-8" 
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                >
                    {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (updateMutation.isSuccess ? <Check className="h-4 w-4" /> : null)}
                    {t('settings.save')}
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Other Settings Groups */}
        <div className="grid gap-4 sm:grid-cols-2">
            {[
                { icon: Bell, label: t('settings.notifications'), desc: t('settings.notificationsDesc'), target: null },
                { icon: Shield, label: t('settings.security'), desc: t('settings.securityDesc'), target: "security" },
                { icon: SettingsIcon, label: t('settings.appPreferences'), desc: t('settings.appPreferencesDesc'), target: "preferences" }
            ].map((item, i) => (
                <Card 
                  key={i} 
                  className="border-none bg-card/30 hover:bg-card/50 transition-colors cursor-pointer group"
                  onClick={() => item.target && setView(item.target as SettingsView)}
                >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Danger Zone */}
        <Card className="border-none bg-red-500/5 group">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-red-500">{t('settings.logout')}</p>
                        <p className="text-xs text-red-500/60">{t('settings.logoutDesc')}</p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    className="text-red-500 hover:bg-red-500/10"
                    onClick={() => authService.logout()}
                >
                    {t('settings.logout')}
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
