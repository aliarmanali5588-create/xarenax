import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const Faq = () => {
  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "Click on the 'Join Now' button on the homepage. Fill in your email/phone number, create a password, and verify your account. The whole process takes less than 2 minutes!",
        },
        {
          question: "What is the minimum age to play?",
          answer:
            "You must be at least 18 years old to participate in tournaments on TeamFire. This is to comply with legal requirements for skill-based gaming in India.",
        },
        {
          question: "Is TeamFire legal in India?",
          answer:
            "Yes, absolutely! TeamFire is a skill-based gaming platform, which is completely legal across India (except Assam, Odisha, Sikkim, Nagaland, Telangana, Andhra Pradesh where state laws restrict such games). We comply with all applicable laws and regulations.",
        },
      ],
    },
    {
      category: "Payments & Withdrawals",
      questions: [
        {
          question: "How do I add money to my wallet?",
          answer:
            "Go to the Wallet section and click 'Add Money'. You can deposit using UPI, Paytm, PhonePe, Google Pay, or any other payment method. Minimum deposit is ₹50.",
        },
        {
          question: "How do I withdraw my winnings?",
          answer:
            "Navigate to Wallet > Withdraw. Enter the amount you want to withdraw (minimum ₹100) and your bank account details. Money will be transferred within 24-48 hours on working days.",
        },
        {
          question: "Are there any withdrawal fees?",
          answer:
            "No! We do not charge any fees for withdrawals. However, your bank may charge standard transaction fees depending on your account type.",
        },
        {
          question: "What if my deposit is not reflecting?",
          answer:
            "Deposits usually reflect instantly. If your deposit hasn't appeared within 10 minutes, please contact our support team via WhatsApp with your transaction ID.",
        },
      ],
    },
    {
      category: "Tournaments",
      questions: [
        {
          question: "How do I join a tournament?",
          answer:
            "Browse available tournaments, select one that fits your budget (₹30 or ₹50 entry), and click 'Join Tournament'. Make sure you have sufficient balance in your wallet.",
        },
        {
          question: "When will I receive the room code?",
          answer:
            "Room ID and password will be sent to you via WhatsApp and displayed in your dashboard 15 minutes before the tournament start time. Make sure your WhatsApp number is verified.",
        },
        {
          question: "What happens if the tournament is cancelled?",
          answer:
            "If a tournament is cancelled for any reason (technical issues, insufficient participants, etc.), your entry fee will be automatically refunded to your wallet within 1 hour.",
        },
        {
          question: "Can I cancel my tournament entry?",
          answer:
            "Yes, you can cancel your entry up to 30 minutes before the tournament starts. Go to 'My Tournaments' and click 'Cancel Entry'. Your entry fee will be refunded immediately.",
        },
      ],
    },
    {
      category: "Gameplay",
      questions: [
        {
          question: "Which game versions are supported?",
          answer:
            "We support BGMI (Battlegrounds Mobile India). Make sure you have the latest version installed on your device.",
        },
        {
          question: "What happens if I disconnect during a match?",
          answer:
            "If you disconnect due to internet issues or game crash, try to rejoin immediately. However, if you're unable to rejoin and complete the match, you won't be eligible for prizes. We recommend stable internet connection.",
        },
        {
          question: "How are winners determined?",
          answer:
            "Winners are determined based on the in-game leaderboard. The team/player with the highest score wins. In case of ties, the player with more kills gets priority.",
        },
      ],
    },
    {
      category: "Fair Play & Security",
      questions: [
        {
          question: "How does TeamFire ensure fair play?",
          answer:
            "We have a strict anti-cheating policy. All matches are monitored, and we use automated systems to detect hacking, teaming, or other unfair practices. Violators are permanently banned.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes! We use bank-grade encryption (256-bit SSL) to protect all your payment information. We never store your card/UPI PIN. All transactions are processed through certified payment gateways.",
        },
        {
          question: "What happens if I'm caught cheating?",
          answer:
            "First offense: Immediate disqualification from the tournament and no refund. Second offense: Permanent account ban with all funds forfeited. We take fair play very seriously.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-6 px-5 py-2.5 bg-primary/15 text-primary border-primary/40 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
              Get Quick Answers
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-gaming font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                FAQ
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find answers to <span className="text-primary font-bold">common questions</span> about TeamFire
            </p>
            
            <Button variant="gaming" size="lg" asChild className="shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]">
              <Link to="/support/contact">
                <MessageCircle className="w-5 h-5 mr-2" />
                Still Need Help? Contact Us
              </Link>
            </Button>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-6">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="glass-card p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <h2 className="text-xl md:text-2xl font-heading font-bold mb-4 relative z-10">
                  <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {category.category}
                  </span>
                </h2>
                <Accordion type="single" collapsible className="w-full relative z-10">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`} className="border-border/30">
                      <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default Faq;