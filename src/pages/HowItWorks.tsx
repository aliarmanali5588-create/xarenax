import { UserPlus, CreditCard, Trophy, Wallet as WalletIcon, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
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
      question: "Is ArenaX legal in India?",
      answer: "Yes! ArenaX is a 100% skill-based gaming platform, which is completely legal in India.",
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

      <div className="pt-24 pb-16 px-4">
        <div className="modern-container">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-gaming font-bold mb-4">
              How It Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started in 4 simple steps
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-4xl mx-auto mb-20">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="glass-card p-8 mb-8 hover-lift">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20">
                        <step.icon className="w-10 h-10 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-gaming font-bold">
                          {step.step}
                        </span>
                        <h3 className="text-2xl font-heading font-bold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mb-8">
                    <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mb-20">
            <Button size="lg" asChild className="px-12">
              <Link to="/tournaments">Start Playing Now</Link>
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-gaming font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card p-6 hover-lift">
                  <h3 className="font-heading font-bold text-lg mb-2 text-primary">{faq.question}</h3>
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
