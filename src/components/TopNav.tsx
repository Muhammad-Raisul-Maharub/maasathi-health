import { Home, Stethoscope, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const TopNav = () => {
  const items = [
    { label: "Home", to: "/", icon: Home },
    { label: "Assess", to: "/assess", icon: Stethoscope },
    { label: "Analytics", to: "/dashboard", icon: BarChart3 },
    { label: "Settings", to: "/settings", icon: SettingsIcon },
  ];

  return (
    <nav className="hidden sm:block sticky top-0 inset-x-0 z-40 border-b border-border bg-background/95 backdrop-blur animate-fade-in">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="flex items-center justify-center gap-2 py-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className="hover-scale inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors"
                activeClassName="bg-primary text-primary-foreground shadow-md"
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

export default TopNav;
