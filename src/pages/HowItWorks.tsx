import { UserPlus, CreditCard, Trophy, Wallet as WalletIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Create Account",
      description: "Sign up with your email or phone number in under 30 seconds. No complex verification needed to get started.",
      icon: UserPlus,
      color: "primary",
    },
    {
      step: 2,
      title: "Add Funds",
      description: "Deposit money securely using UPI, Paytm, or any payment method. Minimum deposit is just ₹50 to start playing.",
      icon: CreditCard,
      color: "accent",
    },
    {
      step: 3,
      title: "Join Tournament",
      description: "Browse live tournaments, choose your entry fee tier (₹30 or ₹50), and register for the match.",
      icon: Trophy,
      color: "secondary",
    },
    {
      step: 4,
      title: "Play & Win",
      description: "Get room details, join the match on PUBG/BGMI, play your best game, and win real cash prizes instantly!",
      icon: WalletIcon,
      color: "success",
    },
  ];

  const faqs = [
    {
      question: "Is ArenaX legal in India?",
      answer: "Yes! ArenaX is a skill-based gaming platform, which is completely legal in India. We comply with all applicable laws and regulations.",
    },
    {
      question: "How do I receive room codes?",
      answer: "Once you join a tournament, you'll receive the room ID and password via WhatsApp and inside your dashboard 15 minutes before match starts.",
    },
    {
      question: "When will I receive my winnings?",
      answer: "Winnings are credited to your ArenaX wallet within 30 minutes of match completion. You can withdraw anytime to your bank account.",
    },
    {
      question: "What if the match gets cancelled?",
      answer: "If a tournament is cancelled for any reason, your entry fee is automatically refunded to your wallet within 1 hour.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-background" />
        <div className="container mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-gaming font-bold mb-6 text-gradient-gaming">
              How It Works
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto font-medium">
              Get started in <span className="text-primary">4 simple steps</span> and start competing for <span className="text-secondary">real prizes</span>
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-4xl mx-auto mb-20">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="glass-panel-hover rounded-2xl p-8 md:p-10 mb-8 hover-glow-intense relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl gradient-gaming flex items-center justify-center neon-glow-multi shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                        <step.icon className="w-12 h-12 md:w-14 md:h-14 text-background" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="w-12 h-12 rounded-full gradient-gaming flex items-center justify-center text-background font-gaming font-bold text-xl shadow-lg">
                          {step.step}
                        </span>
                        <h3 className="text-3xl font-gaming font-bold text-gradient-gaming">{step.title}</h3>
                      </div>
                      <p className="text-lg text-foreground/80 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mb-8">
                    <div className="w-1 h-12 bg-gradient-to-b from-primary via-accent to-secondary rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mb-24">
            <div className="glass-panel rounded-3xl p-12 rgb-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />
              <div className="relative z-10">
                <Trophy className="w-20 h-20 mx-auto mb-6 text-admin-gold animate-pulse" />
                <h3 className="text-3xl md:text-4xl font-gaming font-bold mb-6 text-gradient-gaming">
                  Ready to Dominate?
                </h3>
                <Button variant="gaming" size="lg" asChild className="text-xl px-16 py-7 hover-glow-intense font-bold">
                  <Link to="/tournaments">⚡ Start Playing Now</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-gaming font-bold text-center mb-12 md:mb-16 text-gradient-gaming">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-panel-hover rounded-2xl p-6 md:p-8 hover-glow-intense relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <h3 className="font-gaming font-bold text-xl md:text-2xl mb-3 text-primary">{faq.question}</h3>
                    <p className="text-foreground/80 leading-relaxed text-base md:text-lg">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default HowItWorks;
