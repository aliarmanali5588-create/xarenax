import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <h1 className="text-2xl md:text-5xl font-gaming font-bold mb-6 text-glow-cyan">
              Terms & Conditions
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              Last Updated: November 24, 2025
            </p>
            <p className="text-sm text-primary font-semibold mb-8">
              TeamFire - 100% Skill-Based Gaming Platform (NOT Gambling)
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By accessing and using TeamFire ("Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.
                </p>
                <div className="glass-panel rounded-lg p-4 border-2 border-primary/30">
                  <p className="text-foreground font-semibold mb-2">
                    ⚖️ Important: Skill-Based Gaming Platform
                  </p>
                  <p className="text-sm text-muted-foreground">
                    TeamFire is a <strong className="text-foreground">100% skill-based competitive gaming platform</strong>. We are NOT a gambling, betting, or game of chance platform. All tournament outcomes are determined purely by player skill, strategy, and in-game performance metrics (kills, rank, survival time). We comply with all applicable Indian laws governing skill-based gaming.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  2. Eligibility
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>You must be at least 18 years of age</li>
                  <li>You must be a resident of India (except restricted states)</li>
                  <li>Participation is prohibited in: Assam, Odisha, Sikkim, Nagaland, Telangana, and Andhra Pradesh</li>
                  <li>You must provide accurate and complete registration information</li>
                  <li>One account per person - multiple accounts are strictly prohibited</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  3. Account Responsibilities
                </h2>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  3.1 Account Security
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mb-4">
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>You are liable for all activities under your account</li>
                </ul>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  3.2 Prohibited Activities
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>Using cheats, hacks, or exploits of any kind</li>
                  <li>Sharing accounts or selling account access</li>
                  <li>Teaming with opponents in solo/duo tournaments</li>
                  <li>Using VPN or location spoofing</li>
                  <li>Harassment, abuse, or toxic behavior</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  4. Tournament Rules
                </h2>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  4.1 Entry and Participation
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mb-4">
                  <li>Entry fees must be paid from your wallet balance</li>
                  <li>Once a tournament starts, entries cannot be cancelled</li>
                  <li>You must join the room using the provided credentials</li>
                  <li>Late entries are not permitted after room creation</li>
                </ul>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  4.2 Fair Play
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>All players must follow BGMI official rules</li>
                  <li>Screenshots/recordings may be required for verification</li>
                  <li>Suspicious activity will be investigated</li>
                  <li>Prize distribution may be delayed pending investigation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  5. Payments and Withdrawals
                </h2>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  5.1 Deposits
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mb-4">
                  <li>Minimum deposit: ₹50</li>
                  <li>Deposits are non-refundable except in case of technical errors</li>
                  <li>We do not charge deposit fees</li>
                </ul>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  5.2 Withdrawals
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mb-4">
                  <li>Minimum withdrawal: ₹100</li>
                  <li>Processing time: 24-48 hours (working days)</li>
                  <li>Valid bank account required (must match registered name)</li>
                  <li>TDS (Tax Deducted at Source) applicable as per Indian law on winnings above ₹10,000</li>
                </ul>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  5.3 Taxes
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  All prizes are subject to applicable taxes under Indian law. Winners are responsible for reporting and paying taxes on their winnings. We will deduct TDS as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  6. Cancellation and Refunds
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>Tournament entries can be cancelled up to 30 minutes before start time</li>
                  <li>If a tournament is cancelled by TeamFire, full refunds are issued</li>
                  <li>Partial refunds are not available for disconnections or personal issues</li>
                  <li>Refund processing time: Within 1 hour to wallet</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  7. Anti-Cheating Policy
                </h2>
                <div className="glass-panel rounded-lg p-6 mb-4 border-l-4 border-destructive">
                  <p className="font-heading font-bold mb-2">Zero Tolerance Policy</p>
                  <p className="text-muted-foreground leading-relaxed">
                    TeamFire has a strict zero-tolerance policy for cheating, hacking, or any form of unfair play.
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li><strong>First Offense:</strong> Immediate disqualification, no refund, and 30-day ban</li>
                  <li><strong>Second Offense:</strong> Permanent account ban with all funds forfeited</li>
                  <li><strong>Severe Violations:</strong> Legal action may be pursued</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  8. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  TeamFire is not responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>Internet connection issues or device malfunctions</li>
                  <li>BGMI server downtime or game crashes</li>
                  <li>Loss of data or account access due to user negligence</li>
                  <li>Unauthorized access to your account if credentials are shared</li>
                  <li>Delays in prize distribution due to verification requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  9. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on TeamFire, including logos, graphics, text, and software, is owned by TeamFire or its licensors. You may not copy, reproduce, distribute, or create derivative works without written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  10. Termination
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for violations of these terms, suspicious activity, or at our discretion. Upon termination, you may withdraw any legitimate funds in your wallet, subject to verification.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  11. Governing Law
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms and Conditions are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  12. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For questions about these Terms and Conditions, contact us at:
                </p>
                <div className="glass-panel rounded-lg p-4">
                  <p className="text-foreground">
                    Telegram: <a href="https://t.me/+6IoFwhsuUkEzMGM9" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">@TeamFireSupport</a>
                  </p>
                  <p className="text-foreground">Address: India</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default Terms;