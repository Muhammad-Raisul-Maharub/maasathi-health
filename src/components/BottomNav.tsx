import { Home, ClipboardList, LayoutDashboard, Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const items = [
    { label: "Home", to: "/", icon: Home },
    { label: "Assess", to: "/assess", icon: ClipboardList },
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Settings", to: "/settings", icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm sm:hidden">
      <div className="mx-auto w-full max-w-md px-4 py-2">
        <div className="flex items-stretch justify-between gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className="flex-1 flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-muted-foreground"
                activeClassName="bg-primary/10 text-primary"
                aria-label={item.label}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
