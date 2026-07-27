import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { FleetProvider } from "@/context/FleetContext";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import FleetPage from "./pages/Fleet/FleetPage";
import ShipDetailPage from "./pages/Ship/ShipDetailPage";
import AssessmentPage from "./pages/Assessment/AssessmentPage";
import LoginPage from "./pages/Login/LoginPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <FleetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/fleet" element={<ProtectedRoute><FleetPage /></ProtectedRoute>} />
            <Route path="/ship/:id" element={<ProtectedRoute><ShipDetailPage /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </FleetProvider>
    </AuthProvider>
  );
}
