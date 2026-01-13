import { Home, Stethoscope, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

import { useUserRole } from "@/hooks/useUserRole";

const SideNav = () => {
    const { role } = useUserRole();

    const items = [
        { label: "Home", to: "/", icon: Home },
        { label: "Assess", to: "/assess", icon: Stethoscope },
        // Only show Analytics for Health Workers
        ...(role === 'health_worker' ? [{ label: "Analytics", to: "/dashboard", icon: BarChart3 }] : []),
        { label: "Settings", to: "/settings", icon: SettingsIcon },
    ];

    return (
        <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 border-r border-border bg-background/95 backdrop-blur z-40 py-6 items-center gap-4 animate-fade-in">
            {/* App Logo or Branding could go here */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <img src="/pwa-192x192.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>

            <div className="flex flex-col gap-3 w-full px-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className="flex flex-col items-center justify-center gap-1 rounded-lg py-3 px-1 text-[10px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group"
                            activeClassName="text-primary font-semibold bg-primary/10 shadow-sm"
                            aria-label={item.label}
                        >
                            <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            <span className="opacity-70 group-hover:opacity-100">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default SideNav;
