import { UserPlus, CreditCard, Trophy, Wallet as WalletIcon, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Create Account",
      description: "Sign up with your email or phone number in under 30 seconds",
      icon: UserPlus,
    },
    {
      step: 2,
      title: "Add Funds",
      description: "Deposit money securely using UPI or Razorpay. Minimum ₹50",
      icon: CreditCard,
    },
    {
      step: 3,
      title: "Join Tournament",
      description: "Browse tournaments, choose your entry fee, and register",
      icon: Trophy,
    },
    {
      step: 4,
      title: "Play & Win",
      description: "Get room details, play your best, and win real cash instantly",
      icon: WalletIcon,
    },
  ];

  const faqs = [
    {
      question: "Is NeroXP legal in India?",
      answer: "Yes! NeroXP is a 100% skill-based gaming platform, which is completely legal in India.",
    },
    {
      question: "How do I receive room codes?",
      answer: "Room ID and password will be sent via WhatsApp and visible in your dashboard 15 minutes before match starts.",
    },
    {
      question: "When will I receive my winnings?",
      answer: "Winnings are credited to your wallet within 30 minutes of match completion. Withdraw anytime.",
    },
    {
      question: "What if the match gets cancelled?",
      answer: "If a tournament is cancelled, your entry fee is automatically refunded to your wallet within 1 hour.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="modern-container relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 px-5 py-2.5 bg-primary/15 text-primary border-primary/40 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
              Simple & Fast
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-gaming font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                How It Works
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Get started in <span className="text-primary font-bold">4 simple steps</span> and start winning
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-4xl mx-auto mb-20">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="glass-card p-6 md:p-8 mb-8 hover-lift relative overflow-hidden group">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/30 shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-shadow">
                        <step.icon className="w-8 h-8 md:w-10 md:h-10 text-primary drop-shadow-[0_0_10px_currentColor]" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-gaming font-bold text-lg md:text-xl shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                          {step.step}
                        </span>
                        <h3 className="text-xl md:text-2xl font-heading font-bold text-primary">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mb-8">
                    <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
                    <ArrowRight className="w-6 h-6 text-primary rotate-90 drop-shadow-[0_0_10px_currentColor]" />
                    <div className="w-px h-8 bg-gradient-to-b from-transparent to-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & FAQ Section */}
      <section className="pb-20 px-4">
        <div className="modern-container">

          {/* CTA */}
          <div className="text-center mb-20">
            <Button variant="gaming" size="lg" asChild className="px-12 h-14 md:h-16 text-base md:text-lg shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]">
              <Link to="/tournaments">Start Playing Now</Link>
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-gaming font-bold text-center mb-12">
              <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card p-6 hover-lift relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <h3 className="font-heading font-bold text-lg mb-2 text-primary">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default HowItWorks;