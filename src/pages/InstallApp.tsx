import { useState, useEffect } from "react";
import { Download, Smartphone, Zap, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Fallback: If on mobile and event hasn't fired within 1 second, assume installable
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && isMobile && !isInstalled) {
        setIsInstallable(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(fallbackTimer);
    };
  }, [isMobile, deferredPrompt, isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If on mobile, scroll to install guide instead of just showing toast
      if (isMobile) {
        const guideElement = document.querySelector('[data-install-guide]');
        if (guideElement) {
          guideElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          toast.info("Follow the guide below to install TeamFire");
        } else {
          toast.info("Use your browser's menu to install the app");
        }
      } else {
        toast.info("Open this page in your mobile browser to install the app");
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success("App installed successfully! 🎉");
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant loading with offline support"
    },
    {
      icon: Smartphone,
      title: "Native Experience",
      description: "Works just like a real app on your phone"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your data is protected and encrypted"
    },
    {
      icon: Award,
      title: "No App Store Needed",
      description: "Install directly from your browser"
    }
  ];

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="modern-container max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-6 shadow-2xl">
              <Download className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-gaming font-bold mb-4 text-gradient">
              Install TeamFire App
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8">
              India's most trusted BGMI tournament platform. Join thousands of players competing for real prizes.
            </p>
          </div>

          {/* Big Install Button */}
          {isInstalled ? (
            <Card className="bg-green-500/10 border-green-500/30 mb-12">
              <CardContent className="p-8 text-center">
                <Award className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-500 mb-3">
                  App Already Installed! 🎉
                </h3>
                <p className="text-muted-foreground text-lg">
                  You're all set! Open TeamFire from your home screen.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="mb-12">
              {/* Primary Install Button */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary blur-2xl opacity-40 animate-pulse" />
                <Button
                  size="lg"
                  className="relative w-full h-20 text-2xl font-gaming font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/50 transition-all duration-300"
                  onClick={handleInstall}
                >
                  <Download className="w-8 h-8 mr-3" />
                  {isInstallable ? "Install TeamFire Now" : "View Install Guide"}
                </Button>
              </div>
              
              {/* Info Text */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {isInstallable 
                    ? "✅ Your device supports instant installation" 
                    : isMobile 
                      ? "📱 Ready to install - Tap the button above or follow the guide below"
                      : "📱 Open this page on your mobile browser to install"}
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Fast
                  </span>
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3" /> No Store Required
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <feature.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How to Install Guide */}
          <Card className="glass-card border-primary/20 mb-8" data-install-guide>
            <CardContent className="p-8">
              <h3 className="font-gaming font-bold text-3xl mb-6 text-center text-gradient">
                📱 How to Install TeamFire
              </h3>
              
              <div className="space-y-8">
                {/* iPhone Instructions */}
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">iPhone/iPad</h4>
                      <p className="text-sm text-muted-foreground">Safari Browser</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Open teamfire.app in Safari browser",
                      "Tap the Share button (box with arrow) at the bottom",
                      "Scroll down and tap 'Add to Home Screen'",
                      "Tap 'Add' in the top right corner",
                      "Done! Open TeamFire from your home screen"
                    ].map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm text-foreground pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Android Instructions */}
                <div className="bg-secondary/5 rounded-2xl p-6 border border-secondary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">Android</h4>
                      <p className="text-sm text-muted-foreground">Chrome Browser</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Open teamfire.app in Chrome browser",
                      "Tap the menu (three dots) in the top right",
                      "Tap 'Install App' or 'Add to Home screen'",
                      "Tap 'Install' to confirm",
                      "Done! Open TeamFire from your home screen"
                    ].map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm text-foreground pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Help Note */}
              <div className="mt-6 p-4 bg-accent/5 rounded-xl border border-accent/10">
                <p className="text-sm text-center text-muted-foreground">
                  <strong className="text-foreground">Need Help?</strong> If you face any issues installing the app, 
                  contact our support team and we'll help you out!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstallApp;
