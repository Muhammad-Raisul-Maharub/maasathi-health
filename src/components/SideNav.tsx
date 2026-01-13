import { Home, Stethoscope, BarChart3, Settings as SettingsIcon, History as HistoryIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

import { useUserRole } from "@/hooks/useUserRole";

const SideNav = () => {
    const { role } = useUserRole();

    const items = [
        { label: "Home", to: "/", icon: Home },
        { label: "Assess", to: "/assess", icon: Stethoscope },

        // Show History for Mothers
        ...(role === 'mother' ? [{ label: "History", to: "/history", icon: HistoryIcon }] : []),

        // Show Analytics for Health Workers
        ...(role === 'health_worker' ? [{ label: "Analytics", to: "/dashboard", icon: BarChart3 }] : []),

        { label: "Settings", to: "/settings", icon: SettingsIcon },
    ];

    return (
        <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background/95 backdrop-blur z-40 py-6 items-center gap-4 animate-fade-in">
            {/* App Logo or Branding could go here */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <img src="/pwa-192x192.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>

            <div className="flex flex-col gap-3 w-full px-2">
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

            <div className="mt-auto mb-4 w-full px-2">
                <button
                    onClick={async () => {
                        const { supabase } = await import("@/integrations/supabase/client");
                        await supabase.auth.signOut();
                        window.location.href = '/login';
                    }}
                    className="flex flex-col items-center justify-center gap-1 rounded-lg py-3 px-1 text-[10px] font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all w-full group"
                    aria-label="Log out"
                >
                    {/* Hardcoded LogOut icon to avoid import issues if not available in lucide-react (though it is) */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 group-hover:scale-110 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                    <span className="opacity-70 group-hover:opacity-100">Log Out</span>
                </button>
            </div>
        </nav>
    );
};

export default SideNav;
