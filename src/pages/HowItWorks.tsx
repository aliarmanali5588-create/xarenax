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

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-gaming font-bold mb-4 text-glow-cyan">
              How It Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started in 4 simple steps and start competing for real prizes
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-4xl mx-auto mb-20">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="glass-panel-hover rounded-xl p-8 mb-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30 neon-glow-cyan">
                        <step.icon className="w-10 h-10 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background font-gaming font-bold">
                          {step.step}
                        </span>
                        <h3 className="text-2xl font-heading font-bold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mb-8">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mb-20">
            <Button variant="gaming" size="lg" asChild className="text-lg px-12">
              <Link to="/tournaments">Start Playing Now</Link>
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-gaming font-bold text-center mb-12 text-glow-cyan">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-panel rounded-xl p-6">
                  <h3 className="font-heading font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
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
