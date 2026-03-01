import { Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ContactUs = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-6 px-5 py-2.5 bg-primary/15 text-primary border-primary/40 shadow-[0_0_20px_rgba(255,120,0,0.2)]">
              24/7 Support Available
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-gaming font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Need help? Reach out to us on <span className="text-primary font-bold">Telegram</span> for instant support
            </p>
          </div>

          {/* Telegram Support Card */}
          <div className="max-w-lg mx-auto mb-12">
            <a
              href="https://t.me/+6IoFwhsuUkEzMGM9"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 text-center group transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,120,0,0.3)] block"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send className="w-10 h-10 text-background" />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-3">Telegram Support</h3>
              <p className="text-muted-foreground mb-6">Get instant help, room IDs, and updates</p>
              <Button variant="gaming" size="lg" className="w-full">
                Chat on Telegram
              </Button>
            </a>
          </div>

          {/* Support Info */}
          <div className="glass-card p-6 max-w-lg mx-auto">
            <h3 className="font-heading font-bold text-lg mb-4 text-center">
              Support Hours
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telegram Support:</span>
                <span className="font-medium text-primary">24/7 Available</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Average response time: Under 2 hours
            </p>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default ContactUs;
