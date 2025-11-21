import { Mail, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ContactUs = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent! We'll respond within 24 hours.");
  };

  const contactMethods = [
    {
      icon: Send,
      title: "Telegram Support",
      description: "Get instant help on Telegram",
      action: "Chat Now",
      link: "https://t.me/+6IoFwhsuUkEzMGM9",
      primary: true,
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "helparenax@zohomail.in",
      action: "Send Email",
      link: "mailto:helparenax@zohomail.in",
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-gaming font-bold mb-4 text-glow-cyan">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground">
              We're here to help! Reach out to our support team
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass-panel-hover rounded-xl p-6 text-center group transition-all duration-300 ${
                  method.primary 
                    ? "neon-border-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]" 
                    : "border border-border/30 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]"
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow-cyan group-hover:scale-110 transition-transform">
                  <method.icon className="w-8 h-8 text-background" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                <Button
                  variant={method.primary ? "gaming" : "neon"}
                  size="sm"
                  className="w-full"
                >
                  {method.action}
                </Button>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="text-3xl font-gaming font-bold mb-6 text-center text-glow-cyan">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-foreground mb-2 block">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    required
                    className="glass-panel border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="glass-panel border-border/50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="glass-panel border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-foreground mb-2 block">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  placeholder="How can we help you?"
                  required
                  className="glass-panel border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-foreground mb-2 block">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail..."
                  required
                  rows={6}
                  className="glass-panel border-border/50 resize-none"
                />
              </div>

              <Button type="submit" variant="gaming" size="lg" className="w-full">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                We typically respond within 24 hours on business days
              </p>
            </form>
          </div>

          {/* Business Hours */}
          <div className="glass-panel rounded-xl p-6 mt-8">
            <h3 className="font-heading font-bold text-lg mb-4 text-center">
              Support Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday:</span>
                <span className="font-medium">9:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday - Sunday:</span>
                <span className="font-medium">10:00 AM - 8:00 PM</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Telegram support available 24/7 for urgent issues
            </p>
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default ContactUs;
