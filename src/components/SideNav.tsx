
import { Home, Stethoscope, BarChart3, Settings as SettingsIcon, History as HistoryIcon, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useUserRole } from "@/hooks/useUserRole";

interface SideNavProps {
    isExpanded: boolean;
    toggle: () => void;
}

const SideNav = ({ isExpanded, toggle }: SideNavProps) => {
    const { role } = useUserRole();

    const items = [
        { label: "Home", to: "/", icon: Home },
        { label: "Assess", to: "/assess", icon: Stethoscope },
        ...(role === 'mother' ? [{ label: "History", to: "/history", icon: HistoryIcon }] : []),
        ...(role === 'health_worker' ? [{ label: "Analytics", to: "/worker/analytics", icon: BarChart3 }] : []),
        { label: "Settings", to: "/settings", icon: SettingsIcon },
    ];

    return (
        <nav
            className={cn(
                "hidden md:flex flex-col fixed left-0 top-0 bottom-0 border-r border-border bg-background/95 backdrop-blur z-40 py-4 transition-all duration-300 ease-in-out",
                isExpanded ? "w-64" : "w-20"
            )}
        >
            {/* Header / Logo */}
            <div className={cn("flex items-center mb-6 px-4", isExpanded ? "justify-start gap-3" : "justify-center")}>
                <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-primary/10 flex items-center justify-center">
                    <img src="/pwa-192x192.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                {isExpanded && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <h1 className="font-bold text-lg text-primary tracking-tight">MaaSathi AI</h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                            {role === 'health_worker' ? 'Health Worker' : 'Early Care'}
                        </p>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <div className="flex flex-col gap-2 w-full px-3 flex-1 overflow-y-auto">
                {items.map((item) => {
                    const Icon = item.icon;
                    const to = item.to === "/"
                        ? (role === 'health_worker' ? '/worker/dashboard' : '/mother/home')
                        : item.to;

                    return (
                        <NavLink
                            key={item.to}
                            to={to}
                            end={to === "/mother/home" || to === "/worker/dashboard"}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all group relative",
                                isExpanded ? "justify-start" : "justify-center"
                            )}
                            activeClassName="bg-primary/10 text-primary shadow-sm font-medium"
                        >
                            <Icon className={cn("shrink-0 transition-transform group-hover:scale-110", isExpanded ? "w-5 h-5" : "w-6 h-6")} />

                            {isExpanded ? (
                                <span className="text-sm truncate animate-fade-in">{item.label}</span>
                            ) : (
                                // Tooltip-like label for collapsed mode could go here, or just keep simple icons
                                <span className="sr-only">{item.label}</span>
                            )}
                        </NavLink>
                    );
                })}
            </div>

            {/* Footer / Actions */}
            <div className="mt-auto w-full px-3 flex flex-col gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className="w-full flex items-center justify-center h-9 hover:bg-muted/80 text-muted-foreground"
                    title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </Button>

                <div className="border-t border-border my-1" />

                <button
                    onClick={async () => {
                        const { supabase } = await import("@/integrations/supabase/client");
                        await supabase.auth.signOut();
                        window.location.href = '/login';
                    }}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all w-full group",
                        isExpanded ? "justify-start" : "justify-center"
                    )}
                    aria-label="Log out"
                >
                    <LogOut className={cn("shrink-0 transition-transform group-hover:scale-110", isExpanded ? "w-5 h-5" : "w-6 h-6")} />
                    {isExpanded && <span className="text-sm font-medium animate-fade-in">Log Out</span>}
                </button>
            </div>
        </nav>
    );
};

export default SideNav;
