import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Dumbbell, 
  History, 
  Library, 
  Video, 
  Bot, 
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { authService } from "@/services/auth.service";

const navigation = [
  { name: "dashboard", href: "/", icon: LayoutDashboard },
  { name: "workout", href: "/workout", icon: Dumbbell },
  { name: "history", href: "/history", icon: History },
  { name: "exercises", href: "/exercises", icon: Library },
  { name: "tutorials", href: "/tutorials", icon: Video },
  { name: "coach", href: "/coach", icon: Bot },
  { name: "settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <Dumbbell className="mr-2 h-6 w-6 text-primary" />
        <span className="text-lg font-bold tracking-tight">FitTrack Pro</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {t(`menu.${item.name}`)}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <button 
           onClick={() => authService.logout()}
           className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="mr-3 h-5 w-5" />
          {t('menu.logout')}
        </button>
      </div>
    </div>
  );
}
