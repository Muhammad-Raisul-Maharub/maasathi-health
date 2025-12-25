import { Home, Stethoscope, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const BottomNav = () => {
  const items = [
    { label: "Home", to: "/", icon: Home },
    { label: "Assess", to: "/assess", icon: Stethoscope },
    { label: "Analytics", to: "/dashboard", icon: BarChart3 },
    { label: "Settings", to: "/settings", icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm sm:hidden animate-fade-in shadow-lg">
      <div className="mx-auto w-full max-w-md px-2 py-2">
        <div className="flex items-stretch justify-between gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className="flex-1 flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-xs font-medium text-muted-foreground hover-scale hover:text-foreground transition-all duration-200"
                activeClassName="text-primary font-semibold bg-primary/10 shadow-md"
                aria-label={item.label}
              >
                <Icon className="h-6 w-6 stroke-[2]" />
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
