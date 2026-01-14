import { Home, Stethoscope, BarChart3, Settings as SettingsIcon, History as HistoryIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/context/LanguageContext";

const BottomNav = () => {
  const { role } = useUserRole();
  const { t } = useLanguage();

  const items = [
    { labelKey: "nav.home", to: "/", icon: Home },
    { labelKey: "nav.assess", to: "/assess", icon: Stethoscope },

    // Show History for Mothers
    ...(role === 'mother' ? [{ labelKey: "nav.history", to: "/history", icon: HistoryIcon }] : []),

    // Only show Analytics for Health Workers
    ...(role === 'health_worker' ? [{ labelKey: "nav.analytics", to: "/worker/analytics", icon: BarChart3 }] : []),

    { labelKey: "nav.settings", to: "/settings", icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm sm:hidden animate-fade-in">
      <div className="mx-auto w-full max-w-md px-3 py-2">
        <div className="flex items-stretch justify-between gap-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const label = t(item.labelKey) || item.labelKey.split('.')[1];
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
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
                <span className="leading-tight text-center">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
