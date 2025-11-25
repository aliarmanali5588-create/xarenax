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
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="relative group">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary blur-xl opacity-60 animate-pulse" />
        
        {/* Main button */}
        <Button
          asChild
          size="lg"
          className="relative h-14 px-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
        >
          <Link to="/install-app" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Download className="w-6 h-6" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-normal opacity-90">Get the App</div>
              <div className="text-sm font-bold">Install ArenaX</div>
            </div>
            <Download className="w-5 h-5 sm:hidden" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FloatingInstallButton;
