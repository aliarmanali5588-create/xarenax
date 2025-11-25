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
          className="absolute -top-2 -right-2 w-7 h-7 bg-destructive/90 backdrop-blur-sm text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-10"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Animated Glowing effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 animate-pulse" />
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-2xl blur-lg opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Main button with bounce */}
        <Button
          asChild
          size="lg"
          className="relative h-16 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 animate-bounce hover:animate-none rounded-2xl border-2 border-white/20"
        >
          <Link to="/install-app" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-pulse">
              <Download className="w-7 h-7 drop-shadow-lg" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold opacity-95 tracking-wide">FREE APP</div>
              <div className="text-base font-black tracking-tight">Install Now</div>
            </div>
            <Download className="w-6 h-6 sm:hidden animate-pulse" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FloatingInstallButton;
