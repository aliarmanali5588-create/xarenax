import { Mail, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user?.id || null,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || null,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      });

      if (error) throw error;

      toast.success("Support ticket submitted! We'll respond within 24 hours.");
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-3xl md:text-5xl font-gaming font-bold mb-4 text-glow-cyan">
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
                    name="name"
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
                    name="email"
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
                  name="phone"
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
                  name="subject"
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
                  name="message"
                  placeholder="Describe your issue in detail..."
                  required
                  rows={6}
                  className="glass-panel border-border/50 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                variant="gaming" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Send Message'}
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
