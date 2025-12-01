import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

const specContent = `# 🔥 TEAMFIRE - FREE FIRE ESPORTS TOURNAMENT PLATFORM
## Complete A-Z Specification for Lovable

---

## 📱 PROJECT OVERVIEW

Build "TeamFire" - A Free Fire esports tournament platform where players compete in skill-based tournaments and win real cash prizes.

**Brand Details:**
- **Name:** TeamFire
- **Game:** Free Fire (Garena)
- **Tagline:** "India's Most Trusted Free Fire Tournament Platform"
- **Max Players per Match:** 50 (not 100 like BGMI)
- **Business Location:** Jaipur, Rajasthan, India
- **Support Email:** [your-email]@zohomail.in

---

## 🎨 DESIGN SYSTEM

**Aesthetic:** Premium Gaming with glass-card effects, smooth animations, modern UI
**Theme:** Dark mode with cyan/teal primary, purple secondary accents
**Typography:** Gaming fonts (Orbitron for headings, Rajdhani for body)
**Effects:** Subtle glow effects, hover animations, gradient backgrounds

---

## 📄 ALL USER PAGES (14 Pages)

### 1. Home Page (/)
- Hero section with gradient backgrounds and blur effects
- Trust badge: "India's Most Trusted Free Fire Tournament Platform"
- Stats: Active Players (50K+), Total Prizes (₹10L+), Tournaments (500+)
- Features: Bank-Grade Security, Instant Payouts, 100% Skill-Based
- Trust indicators: 100% Legal, Secure Payments, Fair Play
- CTA: "Browse Tournaments" and "How It Works" buttons

### 2. Tournaments List (/tournaments)
- Search bar for filtering tournaments
- Grid of tournament cards showing:
  - Title, Map, Match Type (Solo/Duo/Squad)
  - Entry Fee, Prize Pool, Per Kill Prize
  - Slots progress bar (current/max)
  - Start time with countdown
  - "Join Now" button
- Filter by: Classic mode, Clash Squad mode
- Empty state when no tournaments available

### 3. Tournament Detail (/tournaments/:id)
- Full tournament details with large prize pool display
- Tournament info: Map, Mode, Entry Fee, Start Time
- Slots remaining with progress bar
- Room ID & Password (shown only to paid participants after admin sets it)
- Join confirmation dialog with Free Fire ID input
- Wallet balance check before joining

### 4. Leaderboard (/leaderboard)
- Time period filters: Weekly, Monthly, All-Time
- Top 3 podium with confetti celebration animation
- Full rankings table: Rank, Username, Wins, Kills, Win Rate, Earnings
- Mobile-optimized card view

### 5. Wallet (/wallet)
- Balance display (Main Balance + Bonus Balance)
- Quick action buttons: Add Money, Withdraw
- Transaction history with filters
- **Deposit Modal:**
  - Amount input (Min ₹10, Max ₹5,000)
  - Manual UPI payment only (no Razorpay)
  - Show admin-configured UPI ID and QR code
  - UTR input field with validation
  - Screenshot upload (mandatory)
  - Message: "We will process your deposit within 2 minutes"
- **Withdrawal Modal:**
  - Amount input (Min ₹50, Max ₹5,000)
  - UPI ID or Bank account selection
  - Withdrawal request creation
- **Deposit History Modal:** View all past deposits with status

### 6. Profile/Dashboard (/profile or /dashboard)
- Tabs: Overview, My Matches, Withdrawal Settings, Support
- User info: Username, Email, Free Fire ID, IGN
- Edit Profile modal (Username, IGN, Free Fire ID editable)
- Stats: Total Matches, Wins, Earnings
- **Withdrawal Settings:** Save UPI IDs and Bank details (locked after first withdrawal)
- Match history with results

### 7. Affiliate/Referral (/affiliate)
- User's unique referral code and shareable link
- Referral stats: Total Referrals, Commission Earned
- **Commission Structure:**
  - ₹10 one-time signup bonus per referral
  - 10% lifetime commission on referred user's winnings
- List of referred users with status
- Copy referral link button

### 8. How It Works (/how-it-works)
- Step-by-step guide with icons
- Steps: Create Account → Add Money → Join Tournament → Play & Win → Withdraw
- FAQ section

### 9. Install App (/install or /install-app)
- PWA installation guide
- Step-by-step for iPhone (Safari) and Android (Chrome)
- Large install button with gradient styling

### 10. Notification Preferences (/notification-preferences)
- Toggle switches for notification types:
  - Match notifications
  - Payment notifications
  - Prize notifications
  - System notifications
  - Affiliate notifications
- Quiet hours settings

### 11. Auth Page (/auth, /login, /signup)
- Tabs for Login and Signup
- **Login:** Email, Password
- **Signup:** Email, Password, Username, IGN (In-Game Name), Free Fire ID
- Referral code input (optional)
- Password: Minimum 8 characters only
- Email verification disabled (instant signup)
- Warning message: "Please enter correct email - you won't be able to reset password otherwise"
- Device fingerprint capture for fraud prevention

---

## 📜 LEGAL PAGES (4 Pages)

### 12. About Us (/about)
- Platform introduction as skill-based gaming (NOT gambling)
- Mission, Vision, Values
- Location: Jaipur, Rajasthan, India

### 13. Privacy Policy (/legal/privacy)
- Data collection and usage
- Skill-based platform disclaimer

### 14. Terms & Conditions (/legal/terms)
- User eligibility (18+)
- Skill-based gaming rules
- Fair play policy

### 15. Refund Policy (/legal/refund)
- Tournament cancellation refunds
- Withdrawal processing times

---

## 🆘 SUPPORT PAGES (2 Pages)

### 16. FAQ (/support/faq)
- Accordion-style Q&A
- Categories: Account, Payments, Tournaments, Withdrawals

### 17. Contact Us (/support/contact)
- Support ticket form: Name, Email, Phone, Subject, Message
- Creates ticket in database for admin review

---

## 🔐 ADMIN PANEL (10 Pages)

**Access:** Only for super admin email (set your email)
**Route:** /admin/*
**Theme:** Separate admin themes (Gaming, Cyber, Dark)

### 1. Admin Dashboard (/admin/dashboard)
- Stats cards: Total Users, Total Deposits, Total Withdrawals, Net Profit
- Weekly performance chart (deposits vs withdrawals)
- Recent activity table
- Date filters: This Week, Last Week

### 2. Manage Tournaments (/admin/tournaments)
- **Create Tournament Form:**
  - Title, Game Mode (Classic/Clash Squad)
  - Map selection:
    - Classic: Bermuda, Kalahari, Purgatory, Alpine
    - Clash Squad: Factory, Shipyard, Katulistiwa
  - Match Type: Solo, Duo, Squad
  - Entry Fee, Prize Pool, Per Kill Prize
  - Max Slots (default 50 for Free Fire)
  - Date/Time picker
  - Auto-calculate estimated profit
- **Tournament List:** Edit, Cancel, Set Room ID/Password
- **Prize Distribution:**
  - Select completed tournament
  - Enter winner username(s) based on match type
  - Solo = 1 winner, Duo = 2 winners, Squad = 4 winners
  - Auto-split prize pool among winners
- **Participants List Modal:** View all registered players with Free Fire IDs
- **Room Credentials Modal:** Set Room ID and Password for tournament

### 3. UTR Verification (/admin/utr)
- List all pending UPI deposit submissions
- Show: Username, Amount, UTR Number, Screenshot, Timestamp
- Fraud indicators (color-coded)
- Actions: Approve (credits wallet), Reject
- Quick filters: Pending, Approved, Rejected, Suspicious

### 4. Admin Withdrawals (/admin/withdrawals)
- Pending withdrawal requests list
- User details with UPI/Bank info
- Actions: Mark as Paid, Reject & Refund
- Admin notes field

### 5. Admin Users (/admin/users)
- User search (username, email, Free Fire ID, IP)
- User list with: Username, IGN, Free Fire ID, Balance, Status
- Actions:
  - Send Money (admin credit)
  - Deduct Money (fraud penalty)
  - Ban/Unban user
  - Delete user
- Find Duplicates (by IP or Device ID)

### 6. Admin Referrals (/admin/referrals)
- Total referrals count
- Total commission paid
- Referral history: Who referred whom, join date, bonus status

### 7. Fraud Analytics (/admin/fraud-analytics)
- Total submissions, suspicious count
- Approval/rejection stats
- 7-day trend chart
- Common fraud flag distribution

### 8. Admin Support (/admin/support)
- Support tickets list
- Ticket details: Name, Email, Subject, Message
- Update ticket status: Pending, In Progress, Resolved
- Admin notes

### 9. Tournament Analytics (/admin/tournament-analytics)
- Popular maps chart
- Popular match types
- Revenue by entry fee tier

### 10. Admin Settings (/admin/settings)
- **UPI Payment Methods:**
  - Configure multiple UPI IDs (up to 10)
  - Upload QR code images
  - Enable/disable individual UPI options
- Platform settings management

---

## 🗄️ DATABASE TABLES (Supabase)

### 1. profiles
- id (uuid, PK, references auth.users)
- username (text, unique)
- full_name (text, nullable)
- avatar_url (text, nullable)
- ign (text) - In-Game Name
- freefire_id (text) - Free Fire Player ID
- wallet_balance (numeric, default 0)
- bonus_balance (numeric, default 0)
- total_deposited (numeric, default 0)
- total_winnings (numeric, default 0)
- referral_code (text, unique)
- referred_by (uuid, nullable, references profiles.id)
- is_banned (boolean, default false)
- signup_ip (text, nullable)
- last_ip (text, nullable)
- device_id (text, nullable)
- created_at, updated_at

### 2. tournaments
- id (uuid, PK)
- title (text)
- game_mode (text) - 'classic' or 'clash_squad'
- map (text) - Bermuda, Kalahari, etc.
- match_type (text) - Solo, Duo, Squad
- entry_fee (numeric)
- prize_pool (numeric)
- per_kill_prize (numeric, default 0)
- max_slots (integer, default 50)
- current_slots (integer, default 0)
- start_time (timestamptz)
- status (text) - upcoming, live, full, completed, cancelled
- tags (text array)
- created_by (uuid)
- created_at, updated_at

### 3. participants
- id (uuid, PK)
- tournament_id (uuid, FK)
- user_id (uuid, FK)
- freefire_id (text) - Player's Free Fire ID for this match
- payment_status (text) - pending, paid
- rank (integer, nullable)
- kills (integer, default 0)
- prize_amount (numeric, nullable)
- joined_at (timestamptz)

### 4. tournament_secrets
- id (uuid, PK)
- tournament_id (uuid, FK, unique)
- room_id (text)
- room_password (text)
- created_at, updated_at

### 5. transactions
- id (uuid, PK)
- user_id (uuid, FK)
- amount (numeric)
- type (text) - deposit, withdrawal, contest_entry, contest_win, refund, referral_bonus, admin_credit, penalty
- status (text) - pending, success, failed
- description (text, nullable)
- metadata (jsonb, nullable)
- created_at

### 6. utr_submissions
- id (uuid, PK)
- user_id (uuid, FK)
- utr_number (text)
- amount (numeric)
- screenshot_url (text, nullable)
- status (text) - pending, approved, rejected
- fraud_score (integer, default 0)
- fraud_flags (text array)
- is_suspicious (boolean, default false)
- admin_notes (text, nullable)
- processed_by (uuid, nullable)
- processed_at (timestamptz, nullable)
- created_at

### 7. withdrawal_requests
- id (uuid, PK)
- user_id (uuid, FK)
- amount (numeric)
- payment_method_id (uuid, FK)
- status (text) - pending, paid, rejected
- admin_notes (text, nullable)
- processed_by (uuid, nullable)
- processed_at (timestamptz, nullable)
- created_at

### 8. user_payment_methods
- id (uuid, PK)
- user_id (uuid, FK)
- upi_id_1 (text, nullable)
- upi_id_2 (text, nullable)
- bank_name (text, nullable)
- bank_account_no (text, nullable)
- bank_ifsc (text, nullable)
- is_locked (boolean, default false)
- locked_at (timestamptz, nullable)
- created_at, updated_at

### 9. upi_payment_methods (Admin-configured)
- id (uuid, PK)
- display_name (text)
- upi_id (text)
- qr_code_url (text, nullable)
- is_active (boolean, default true)
- created_at, updated_at

### 10. notifications
- id (uuid, PK)
- user_id (uuid, FK)
- title (text)
- message (text)
- type (text) - match, payment, prize, system, affiliate
- is_read (boolean, default false)
- created_at

### 11. notification_preferences
- id (uuid, PK)
- user_id (uuid, FK)
- enable_match_notifications (boolean, default true)
- enable_payment_notifications (boolean, default true)
- enable_prize_notifications (boolean, default true)
- enable_system_notifications (boolean, default true)
- enable_affiliate_notifications (boolean, default true)
- quiet_hours_enabled (boolean, default false)
- quiet_hours_start, quiet_hours_end
- created_at, updated_at

### 12. push_subscriptions
- id (uuid, PK)
- user_id (uuid, FK)
- subscription_data (jsonb)
- device_info (text, nullable)
- created_at, updated_at

### 13. support_tickets
- id (uuid, PK)
- user_id (uuid, nullable)
- name, email, phone, subject, message (text)
- status (text) - pending, in_progress, resolved
- priority (text) - normal, high, urgent
- admin_notes (text, nullable)
- resolved_by (uuid, nullable)
- resolved_at (timestamptz, nullable)
- created_at, updated_at

### 14. user_roles
- id (uuid, PK)
- user_id (uuid, FK)
- role (enum) - 'user', 'admin'
- created_at

### 15. platform_settings
- id (uuid, PK)
- setting_key (text, unique)
- setting_value (text)
- description (text, nullable)
- created_at, updated_at

---

## 🔧 DATABASE FUNCTIONS (RPC)

1. **create_user_profile** - Create profile on signup with referral handling
2. **credit_referral_bonus** - Give ₹10 bonus to referrer
3. **get_referrer_id** - Get referrer's user ID from code
4. **is_referral_valid** - Check if referral code exists
5. **process_new_referral** - Link new user to referrer
6. **get_affiliate_stats** - Get referral statistics
7. **has_role** - Check if user has specific role
8. **is_super_admin** - Check if user is super admin
9. **cancel_tournament** - Cancel tournament and refund all participants
10. **detect_utr_fraud** - Detect fraudulent UTR submissions
11. **check_duplicate_utr** - Check if UTR already used
12. **check_rapid_submissions** - Detect rapid suspicious submissions
13. **user_is_tournament_participant** - Check participation status

---

## 🔒 RLS POLICIES

- Users can only view/edit their own data
- Admins have full access to all tables
- Tournaments viewable by everyone
- Tournament secrets only visible to paid participants
- UTR submissions manageable by admins only
- Support tickets insertable by anyone, manageable by admins

---

## ⚡ EDGE FUNCTIONS

1. **handle-payment-success** - Credit wallet after UTR approval
2. **send-push-notification** - Send web push notifications
3. **tournament-reminders** - Send tournament start reminders
4. **delete-user** - Admin function to delete users

---

## 📱 PWA FEATURES

- Service worker for offline support
- Web app manifest
- Push notifications
- Install prompts
- Floating install button on all pages

---

## 🎯 KEY FEATURES SUMMARY

**User Features:**
- Tournament browsing and joining
- Wallet management (UPI deposits, withdrawals)
- Real-time notifications
- Referral system with 10% commission
- Profile management
- Match history and stats
- Leaderboard

**Admin Features:**
- Tournament CRUD with prize distribution
- Manual UTR verification
- Withdrawal processing
- User management (ban, credit, penalty)
- Fraud detection analytics
- Support ticket management
- Platform settings

**Security:**
- Email auto-confirm enabled
- Device fingerprinting
- Fraud detection for payments
- RLS policies on all tables
- Admin role verification

---

## 🚀 DEPLOYMENT

- Frontend: Vercel
- Backend: Lovable Cloud (Supabase)
- Storage: Supabase Storage for QR codes and screenshots

---

## IMPORTANT DIFFERENCES FROM BGMI:

1. Game name: "Free Fire" instead of "BGMI/PUBG"
2. Player ID field: "Free Fire ID" instead of "BGMI ID"
3. Max slots default: 50 instead of 100
4. Maps: Bermuda, Kalahari, Purgatory, Alpine (Classic) / Factory, Shipyard, Katulistiwa (Clash Squad)
5. Mode names: "Clash Squad" instead of "TDM"

---

Copy this entire prompt and paste into a new Lovable project to build TeamFire! 🔥
`;

const TeamFireSpec = () => {
  const [copied, setCopied] = useState(false);

  const handleDownloadTxt = () => {
    const blob = new Blob([specContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "TeamFire-Specification.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Specification downloaded as TXT!");
  };

  const handleDownloadPdf = () => {
    // Open print dialog for PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>TeamFire Specification</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: #333;
            }
            h1 { color: #ff6b35; border-bottom: 3px solid #ff6b35; padding-bottom: 10px; }
            h2 { color: #00d4ff; margin-top: 30px; border-bottom: 2px solid #00d4ff; padding-bottom: 5px; }
            h3 { color: #8b5cf6; margin-top: 20px; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
            pre { background: #f4f4f4; padding: 15px; border-radius: 8px; overflow-x: auto; }
            ul, ol { margin-left: 20px; }
            li { margin-bottom: 5px; }
            hr { border: none; border-top: 1px solid #ddd; margin: 30px 0; }
            strong { color: #1a1a1a; }
            @media print {
              body { padding: 20px; }
              h1, h2 { page-break-after: avoid; }
              pre { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${specContent
            .replace(/^# (.*$)/gm, "<h1>$1</h1>")
            .replace(/^## (.*$)/gm, "<h2>$1</h2>")
            .replace(/^### (.*$)/gm, "<h3>$1</h3>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/^- (.*$)/gm, "<li>$1</li>")
            .replace(/^(\d+)\. (.*$)/gm, "<li>$2</li>")
            .replace(/\n\n/g, "</p><p>")
            .replace(/---/g, "<hr>")
            .replace(/<li>/g, "<ul><li>")
            .replace(/<\/li>\n(?!<li>)/g, "</li></ul>")
          }
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      toast.success("Print dialog opened - Save as PDF!");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(specContent);
      setCopied(true);
      toast.success("Specification copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar />
      
      <div className="pt-24 px-4">
        <div className="modern-container">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-gaming font-bold mb-4">
              <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                TeamFire
              </span>{" "}
              Specification
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete A-Z specification for building TeamFire on Lovable
            </p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={handleDownloadPdf}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={handleDownloadTxt}
              variant="outline"
              className="px-6 py-3"
            >
              <FileText className="w-5 h-5 mr-2" />
              Download TXT
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="px-6 py-3"
            >
              {copied ? (
                <Check className="w-5 h-5 mr-2 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 mr-2" />
              )}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>

          {/* Content Preview */}
          <div className="glass-card p-6 md:p-8 max-h-[70vh] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm md:text-base text-foreground font-mono leading-relaxed">
              {specContent}
            </pre>
          </div>

          {/* Instructions */}
          <div className="mt-8 glass-panel p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-primary">How to Use</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Click "Copy to Clipboard" or download the TXT file</li>
              <li>Go to lovable.dev and create a new project</li>
              <li>Paste the entire specification in the chat</li>
              <li>Lovable will build TeamFire step by step</li>
              <li>Customize brand colors, logo, and email as needed</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFireSpec;
