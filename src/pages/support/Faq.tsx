import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
            "You must be at least 18 years old to participate in tournaments on ArenaX. This is to comply with legal requirements for skill-based gaming in India.",
        },
        {
          question: "Is ArenaX legal in India?",
          answer:
            "Yes, absolutely! ArenaX is a skill-based gaming platform, which is completely legal across India (except Assam, Odisha, Sikkim, Nagaland, Telangana, Andhra Pradesh where state laws restrict such games). We comply with all applicable laws and regulations.",
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
            "We support both PUBG Mobile and BGMI (Battlegrounds Mobile India). Make sure you have the latest version installed on your device.",
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
          question: "How does ArenaX ensure fair play?",
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

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-gaming font-bold mb-4 text-glow-cyan">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Find answers to common questions about ArenaX
            </p>
            <Button variant="neonOrange" asChild>
              <Link to="/support/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Still Need Help? Contact Us
              </Link>
            </Button>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="glass-panel rounded-xl p-6">
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left font-medium hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default Faq;
