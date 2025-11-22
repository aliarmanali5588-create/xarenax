import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show black screen while verifying auth - no content visible
  if (loading) {
    return <div className="min-h-screen bg-[#0a0f1c]" />;
  }

  // Immediately redirect if no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only render children if user is confirmed
  return <>{children}</>;
};

export default ProtectedRoute;
