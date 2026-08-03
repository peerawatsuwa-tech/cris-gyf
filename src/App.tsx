import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { FleetProvider } from "@/context/FleetContext";
import { homePathFor, type UserRole } from "@/types/auth";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import FleetPage from "./pages/Fleet/FleetPage";
import ShipDetailPage from "./pages/Ship/ShipDetailPage";
import AssessmentPage from "./pages/Assessment/AssessmentPage";
import LoginPage from "./pages/Login/LoginPage";

function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: UserRole[];
}) {
  const { isAuthenticated, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-slate-900" />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && (!profile || !roles.includes(profile.role))) {
    return <Navigate to={homePathFor(profile)} replace />;
  }

  return children;
}

function ShipRoute() {
  const { id } = useParams();
  const { profile } = useAuth();

  if (profile?.role === "ship" && id !== profile.shipId) {
    return <Navigate to={homePathFor(profile)} replace />;
  }

  return <ShipDetailPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <FleetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><RoleHome /></ProtectedRoute>} />
            <Route path="/command-center" element={<ProtectedRoute roles={["admin", "commander"]}><Navigate to="/dashboard" replace /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute roles={["admin", "commander"]}><DashboardPage /></ProtectedRoute>} />
            <Route path="/fleet" element={<ProtectedRoute roles={["admin", "commander"]}><FleetPage /></ProtectedRoute>} />
            <Route path="/ship/:id" element={<ProtectedRoute><ShipRoute /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute roles={["admin", "commander"]}><AssessmentPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </FleetProvider>
    </AuthProvider>
  );
}

function RoleHome() {
  const { profile } = useAuth();
  return <Navigate to={homePathFor(profile)} replace />;
}
