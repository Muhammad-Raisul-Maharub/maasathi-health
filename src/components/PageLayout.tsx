import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PageLayoutWidth = "sm" | "md" | "lg" | "xl" | "full";

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
  md: "max-w-3xl",
  sm: "max-w-xl",
};

const PageLayout = ({ children, maxWidth = "md", className }: PageLayoutProps) => {
  return (
    <div className="bg-background h-full pb-16">
      <main
        className={cn(
          "mx-auto w-full px-4 py-3 flex flex-col gap-3 flex-1",
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
