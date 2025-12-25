import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface FloatingHelpButtonProps {
  section?: string;
}

const FloatingHelpButton = ({ section }: FloatingHelpButtonProps) => {
  const target = section ? `/help#${section}` : "/help";

  return (
    <div className="fixed bottom-4 right-4 z-40 print:hidden">
      <Link to={target}>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg border-border bg-background/90 backdrop-blur-sm hover:bg-accent"
          aria-label="Open help"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
};

export default FloatingHelpButton;
