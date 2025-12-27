import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Dumbbell, 
  History, 
  Bot, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const items = [
  { name: "dashboard", href: "/", icon: LayoutDashboard },
  { name: "workout", href: "/workout", icon: Dumbbell },
  { name: "history", href: "/history", icon: History },
  { name: "coach", href: "/coach", icon: Bot },
  { name: "settings", href: "/settings", icon: Settings },
];

export function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{t(`menu.${item.name}`)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
