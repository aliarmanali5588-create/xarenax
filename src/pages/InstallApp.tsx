import { useState, useEffect } from "react";
import { Download, Smartphone, Zap, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.info("Open this page in your mobile browser to install the app");
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Download className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-gaming font-bold mb-4 text-glow-cyan">
              Install ArenaX App
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get the full app experience on your phone - faster, smoother, and works offline!
            </p>
          </div>

          {/* Install Status */}
          {isInstalled ? (
            <Card className="bg-green-500/10 border-green-500/30 mb-8">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-500 mb-2">
                  App Already Installed! 🎉
                </h3>
                <p className="text-muted-foreground">
                  You're all set! Open ArenaX from your home screen.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="mb-8 text-center">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold"
                onClick={handleInstall}
              >
                <Download className="w-5 h-5 mr-2" />
                {isInstallable ? "Install Now" : "Install Instructions"}
              </Button>
              {!isInstallable && (
                <p className="text-xs text-muted-foreground mt-3">
                  Open this page in your mobile browser to see the install button
                </p>
              )}
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

          {/* Manual Installation Guide */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-4">
                Manual Installation Guide
              </h3>
              
              <div className="space-y-6">
                {/* iPhone Instructions */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    On iPhone/iPad (Safari)
                  </h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Open this page in Safari browser</li>
                    <li>Tap the Share button at the bottom</li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" in the top right corner</li>
                    <li>Open ArenaX from your home screen!</li>
                  </ol>
                </div>

                {/* Android Instructions */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-secondary" />
                    On Android (Chrome)
                  </h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Open this page in Chrome browser</li>
                    <li>Tap the menu (three dots) in the top right</li>
                    <li>Tap "Install App" or "Add to Home screen"</li>
                    <li>Tap "Install"</li>
                    <li>Open ArenaX from your home screen!</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstallApp;
