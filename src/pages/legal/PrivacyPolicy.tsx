import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-gaming font-bold mb-6 text-glow-cyan">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Last Updated: January 2024
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  1. Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ArenaX ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our PUBG/BGMI tournament platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using ArenaX, you agree to the terms of this Privacy Policy. If you do not agree with the terms, please do not access or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  2. Information We Collect
                </h2>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  2.1 Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mb-4">
                  <li>Name, email address, phone number</li>
                  <li>Date of birth (to verify age requirement)</li>
                  <li>PUBG/BGMI player ID</li>
                  <li>Bank account details for withdrawals (encrypted)</li>
                  <li>Payment information (processed securely via third-party gateways)</li>
                </ul>

                <h3 className="text-xl font-heading font-semibold mb-3">
                  2.2 Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>IP address, browser type, device information</li>
                  <li>Usage data (pages visited, time spent, tournaments joined)</li>
                  <li>Location data (approximate, based on IP address)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>To create and manage your account</li>
                  <li>To process tournament entries and payments</li>
                  <li>To distribute prizes and process withdrawals</li>
                  <li>To communicate about tournaments, updates, and promotions</li>
                  <li>To detect and prevent fraud, cheating, or security issues</li>
                  <li>To improve our platform and user experience</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  4. Information Sharing
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>Payment processors (Paytm, Razorpay, etc.) for transactions</li>
                  <li>Cloud service providers for data storage</li>
                  <li>Law enforcement when required by law</li>
                  <li>Service providers who help us operate our platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  5. Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures including 256-bit SSL encryption, secure payment gateways, regular security audits, and restricted access to personal data. However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  6. Your Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your account (subject to legal requirements)</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Export your data in a portable format</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  7. Cookies and Tracking
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings, but disabling them may affect functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  8. Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  9. Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 glass-panel rounded-lg p-4">
                  <p className="text-foreground">Email: privacy@arenax.in</p>
                  <p className="text-foreground">Phone: +91 98765 43210</p>
                  <p className="text-foreground">Address: Mumbai, Maharashtra, India</p>
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

export default PrivacyPolicy;
