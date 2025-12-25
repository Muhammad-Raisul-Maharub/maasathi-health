import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PageLayoutWidth = "md" | "lg" | "xl";

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
  md: "max-w-md",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

const PageLayout = ({ children, maxWidth = "md", className }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main
        className={cn(
          "mx-auto w-full px-4 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5",
          widthClassMap[maxWidth],
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
