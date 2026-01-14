import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export type PageLayoutWidth = "sm" | "md" | "lg" | "xl" | "full" | "hybrid";

interface PageLayoutProps {
  children: ReactNode;
  /**
   * Controls the maximum content width while keeping consistent paddings.
   * - md: single-column phone-first flows
   * - lg: 2-column layouts
   * - xl: marketing / landing pages
   */
  maxWidth?: PageLayoutWidth;
  className?: string;
  /** Hide the global theme toggle (use when page has its own toggle) */
  hideThemeToggle?: boolean;
}

const widthClassMap: Record<PageLayoutWidth, string> = {
  full: "max-w-[100%] w-full", // Explicitly full width
  xl: "max-w-7xl",
  lg: "max-w-5xl",
  md: "max-w-prose",
  sm: "max-w-md",
  hybrid: "max-w-md md:max-w-2xl lg:max-w-5xl"
};

const PageLayout = ({ children, maxWidth = "hybrid", className, hideThemeToggle = false }: PageLayoutProps) => {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center w-full relative">
      {/* Global Theme Toggle - Top Right (hidden on pages with their own toggle) */}
      {!hideThemeToggle && (
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}

      <main
        className={cn(
          "w-full px-4 md:px-6 py-6 flex flex-col gap-6 flex-1", // Increased gaps and padding for better spacing
          widthClassMap[maxWidth],
          className,
        )}
      >
        {children}
      </main>
      <footer className="w-full py-4 text-center border-t border-border mt-auto">
        <p className="text-xs text-muted-foreground font-medium">
          Designed and Developed by{" "}
          <span className="text-primary font-bold">Raisul Maharub</span>
        </p>
      </footer>
    </div>
  );
};

export default PageLayout;
