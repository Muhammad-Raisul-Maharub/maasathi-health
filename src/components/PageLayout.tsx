import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
}

const widthClassMap: Record<PageLayoutWidth, string> = {
  full: "max-w-full",
  xl: "max-w-7xl",
  lg: "max-w-5xl",
  md: "max-w-prose", // Better for readability
  sm: "max-w-md",
  // Adding the hybrid constraint requested: max-w-md md:max-w-2xl lg:max-w-5xl
  hybrid: "max-w-md md:max-w-2xl lg:max-w-5xl"
};

const PageLayout = ({ children, maxWidth = "hybrid", className }: PageLayoutProps) => {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center">
      <main
        className={cn(
          "w-full px-4 py-6 flex flex-col gap-4 flex-1",
          widthClassMap[maxWidth],
          className,
        )}
      >
        {children}
      </main>
      <footer className="py-4 text-center border-t border-border mt-auto">
        <p className="text-xs text-muted-foreground font-medium">
          Designed and Developed by{" "}
          <span className="text-primary font-bold">Raisul Maharub</span>
        </p>
      </footer>
    </div>
  );
};

export default PageLayout;
