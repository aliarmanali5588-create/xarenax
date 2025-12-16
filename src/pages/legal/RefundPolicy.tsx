import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <h1 className="text-2xl md:text-5xl font-gaming font-bold mb-6 text-glow-cyan">
              Refund & Cancellation Policy
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
                  1. Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  At TeamFire, we strive to provide a fair and transparent refund policy. This policy outlines the circumstances under which refunds are issued and the process for requesting a refund.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  2. Wallet Deposits
                </h2>
                <div className="glass-panel rounded-lg p-6 mb-4 border-l-4 border-destructive">
                  <p className="font-heading font-bold mb-2">Non-Refundable</p>
                  <p className="text-muted-foreground leading-relaxed">
                    All wallet deposits are generally non-refundable once credited to your account.
                  </p>
                </div>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  Exceptions:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>
                    <strong>Technical Errors:</strong> If your payment is deducted but not credited to your wallet within 24 hours, contact support with transaction details. We'll investigate and refund if confirmed.
                  </li>
                  <li>
                    <strong>Duplicate Charges:</strong> If you're charged multiple times for the same transaction, the duplicate amount will be refunded.
                  </li>
                  <li>
                    <strong>Unauthorized Transactions:</strong> Report unauthorized transactions within 48 hours. After verification, we'll refund the amount and secure your account.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  3. Tournament Entry Fees
                </h2>
                
                <h3 className="text-xl font-heading font-semibold mb-3">
                  3.1 Pre-Tournament Cancellation
                </h3>
                <div className="glass-panel rounded-lg p-4 mb-4">
                  <p className="text-foreground leading-relaxed">
                    You can cancel your tournament entry and receive a <strong className="text-success">100% refund</strong> to your wallet if:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mt-3">
                    <li>Cancellation is made at least 30 minutes before tournament start time</li>
                    <li>The tournament has not been marked as "started" by our system</li>
                  </ul>
                </div>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  3.2 Tournament Cancelled by TeamFire
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If a tournament is cancelled by TeamFire for any reason (technical issues, insufficient participants, etc.), all participants will receive a <strong className="text-success">100% automatic refund</strong> to their wallet within 1 hour.
                </p>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  3.3 No Refund Scenarios
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>After tournament has started</li>
                  <li>If you disconnect during the match (internet issues, game crash, etc.)</li>
                  <li>If you fail to join the room after receiving credentials</li>
                  <li>If you're disqualified for rule violations or cheating</li>
                  <li>If you're late to join the tournament room</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  4. Wrongful Bans or Penalties
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you believe you were wrongfully banned or penalized, you can appeal within 7 days by contacting support with evidence. If the appeal is successful:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mt-4">
                  <li>Your account will be reinstated</li>
                  <li>Any forfeited entry fees will be refunded</li>
                  <li>Withheld prizes will be credited</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  5. Refund Processing
                </h2>
                
                <h3 className="text-xl font-heading font-semibold mb-3">
                  5.1 To Wallet
                </h3>
                <div className="glass-panel rounded-lg p-4 mb-4">
                  <p className="text-foreground">
                    <strong>Processing Time:</strong> <span className="text-success">Instant to 1 hour</span>
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Most refunds to your TeamFire wallet are processed immediately. In rare cases, it may take up to 1 hour.
                  </p>
                </div>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  5.2 To Bank Account
                </h3>
                <div className="glass-panel rounded-lg p-4 mb-4">
                  <p className="text-foreground">
                    <strong>Processing Time:</strong> <span className="text-secondary">5-7 business days</span>
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    For refunds to your original payment method (bank account, UPI), processing takes 5-7 business days. This timeframe depends on your bank's processing speed.
                  </p>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  <strong>Note:</strong> We have no control over bank processing times. If your refund doesn't appear after 7 business days, please contact your bank with the transaction reference number.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  6. How to Request a Refund
                </h2>
                <div className="space-y-4">
                  <div className="glass-panel rounded-lg p-4">
                    <p className="font-heading font-semibold mb-2">Step 1: Contact Support</p>
                    <p className="text-muted-foreground text-sm">
                      Email us at <strong className="text-foreground">helparenax@zohomail.in</strong>
                    </p>
                  </div>

                  <div className="glass-panel rounded-lg p-4">
                    <p className="font-heading font-semibold mb-2">Step 2: Provide Details</p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Your TeamFire username/email</li>
                      <li>Transaction ID or tournament ID</li>
                      <li>Reason for refund request</li>
                      <li>Supporting evidence (screenshots if applicable)</li>
                    </ul>
                  </div>

                  <div className="glass-panel rounded-lg p-4">
                    <p className="font-heading font-semibold mb-2">Step 3: Wait for Review</p>
                    <p className="text-muted-foreground text-sm">
                      Our team will review your request within 24-48 hours and notify you of the decision
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  7. Dispute Resolution
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you disagree with a refund decision:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>Reply to the support ticket with additional information or evidence</li>
                  <li>Request escalation to a senior support manager</li>
                  <li>If still unsatisfied, you can escalate to our Grievance Officer</li>
                </ol>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  All disputes will be handled as per the Terms and Conditions and governing law of India.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  8. Special Circumstances
                </h2>
                
                <h3 className="text-xl font-heading font-semibold mb-3">
                  8.1 Server Outages
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If TeamFire servers are down during a tournament and the match cannot be completed, all entry fees will be automatically refunded.
                </p>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  8.2 Prize Disputes
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  If there's a dispute about tournament results or prize distribution, we'll investigate. If an error is confirmed, correct prizes will be credited, and wrongly awarded prizes may be recovered.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  9. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For refund requests or questions about this policy, please contact us at:
                </p>
                <div className="glass-panel rounded-lg p-4">
                  <p className="text-foreground">
                    Email:{" "}
                    <a
                      href="mailto:helparenax@zohomail.in"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      helparenax@zohomail.in
                    </a>
                  </p>
                  <p className="text-foreground">Telegram: <a href="https://t.me/+6IoFwhsuUkEzMGM9" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">@ArenaXSupport</a></p>
                  <p className="text-muted-foreground text-sm mt-2">Response Time: Within 24-48 hours</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  10. Policy Updates
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Refund & Cancellation Policy from time to time. Changes will be posted on this page with an updated date. We recommend reviewing this policy periodically.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default RefundPolicy;
