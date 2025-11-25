import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FloatingInstallButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if user has dismissed the button
    const isDismissed = localStorage.getItem('installButtonDismissed');
    if (isDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem('installButtonDismissed', 'true');
  };

  // Don't show on install page or if already installed
  if (location.pathname === '/install-app' || isInstalled || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-24 lg:bottom-8 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="relative group">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-1 -right-1 w-5 h-5 bg-background/90 backdrop-blur-sm text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md border border-border z-10"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Main button - clean and professional */}
        <Button
          asChild
          size="sm"
          className="h-12 px-4 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl border border-primary/20"
        >
          <Link to="/install-app" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-medium opacity-80 leading-tight">Get App</div>
              <div className="text-xs font-bold leading-tight">Install</div>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FloatingInstallButton;
