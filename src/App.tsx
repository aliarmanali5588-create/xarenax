import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import Home from "./pages/Home";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import Leaderboard from "./pages/Leaderboard";
import Affiliate from "./pages/Affiliate";
import HowItWorks from "./pages/HowItWorks";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Faq from "./pages/support/Faq";
import ContactUs from "./pages/support/ContactUs";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import Terms from "./pages/legal/Terms";
import RefundPolicy from "./pages/legal/RefundPolicy";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTournaments from "./pages/admin/ManageTournaments";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReferrals from "./pages/admin/AdminReferrals";
import AdminInvitations from "./pages/admin/AdminInvitations";
import RedeemInvite from "./pages/RedeemInvite";

const queryClient = new QueryClient();

const App = () => {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showLoading && <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />}
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournaments/:id" element={<TournamentDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support/faq" element={<Faq />} />
              <Route path="/support/contact" element={<ContactUs />} />
              <Route path="/legal/privacy" element={<PrivacyPolicy />} />
              <Route path="/legal/terms" element={<Terms />} />
              <Route path="/legal/refund" element={<RefundPolicy />} />
              <Route path="/redeem-invite" element={<RedeemInvite />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="tournaments" element={<ManageTournaments />} />
                <Route path="withdrawals" element={<AdminWithdrawals />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="referrals" element={<AdminReferrals />} />
                <Route path="invitations" element={<AdminInvitations />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
