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
    <div className="bg-background h-full pb-16">
      <main
        className={cn(
          "mx-auto w-full px-4 py-3 flex flex-col gap-3 min-h-full",
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
