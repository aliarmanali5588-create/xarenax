import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500); // Wait for fade-out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-fade-out pointer-events-none">
        <div className="text-center space-y-6">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="ArenaX" 
              className="h-24 w-24 mx-auto object-contain animate-pulse"
            />
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-gaming font-bold text-glow-cyan">
            Arena<span className="text-secondary">X</span>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-fade-in">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative text-center space-y-6 animate-scale-in">
        {/* Logo with Glow Effect */}
        <div className="relative inline-block">
          <img 
            src="/logo.png" 
            alt="ArenaX" 
            className="h-24 w-24 mx-auto object-contain animate-pulse"
          />
          <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse"></div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl md:text-5xl font-gaming font-bold text-glow-cyan animate-fade-in">
          Arena<span className="text-secondary">X</span>
        </h1>

        {/* Tagline */}
        <p className="text-muted-foreground text-sm md:text-base animate-fade-in" style={{ animationDelay: '0.2s' }}>
          India's #1 PUBG Tournament Platform
        </p>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-2 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
