import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground pb-16 md:pb-0">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center border-b px-4 md:hidden shrink-0">
            <span className="font-bold text-primary tracking-tight italic">FITTRACK PRO</span>
        </header>

        <main className="flex-1 overflow-y-auto bg-background/50 p-4 md:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in zoom-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

