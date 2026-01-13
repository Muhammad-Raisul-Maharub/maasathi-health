import { Home, Stethoscope, BarChart3, Settings as SettingsIcon, History as HistoryIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";

import { useUserRole } from "@/hooks/useUserRole";

const BottomNav = () => {
  const { role } = useUserRole();

  const items = [
    { label: "Home", to: "/", icon: Home },
    { label: "Assess", to: "/assess", icon: Stethoscope },

    // Show History for Mothers
    ...(role === 'mother' ? [{ label: "History", to: "/history", icon: HistoryIcon }] : []),

    // Only show Analytics for Health Workers
    ...(role === 'health_worker' ? [{ label: "Analytics", to: "/dashboard", icon: BarChart3 }] : []),

    { label: "Settings", to: "/settings", icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm sm:hidden animate-fade-in">
      <div className="mx-auto w-full max-w-md px-3 py-2">
        <div className="flex items-stretch justify-between gap-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            // Dynamic Home Link
            const to = item.to === "/"
              ? (role === 'health_worker' ? '/worker/dashboard' : '/mother/home')
              : item.to;

            return (
              <NavLink
                key={item.to}
                to={to}
                end={to === "/mother/home" || to === "/worker/dashboard"}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[11px] font-medium text-muted-foreground hover-scale hover:text-foreground transition-colors"
                activeClassName="text-primary font-semibold bg-primary/10 border-t-2 border-primary shadow-md"
                aria-label={item.label}
              >
                <Icon className="h-5 w-5" />
                <span className="leading-tight text-center">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
