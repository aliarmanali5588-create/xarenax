import { useEffect, useState } from "react";
import teamfireLogo from "@/assets/teamfire-logo-new.png";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-fade-out pointer-events-none">
        <div className="text-center space-y-6">
          <div className="relative">
            <img 
              src={teamfireLogo} 
              alt="TeamFire" 
              className="h-24 w-auto mx-auto object-contain"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-fade-in">
      {/* Background Fire Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative text-center space-y-6 animate-scale-in">
        {/* Logo with Fire Glow */}
        <div className="relative inline-block">
          <img 
            src={teamfireLogo} 
            alt="TeamFire" 
            className="h-32 w-auto mx-auto object-contain drop-shadow-[0_0_30px_rgba(255,120,0,0.6)]"
          />
          <div className="absolute inset-0 bg-primary/30 blur-3xl animate-pulse"></div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-gaming font-bold">
          <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Team</span>
          <span className="text-secondary">Fire</span>
        </h1>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-2 pt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
