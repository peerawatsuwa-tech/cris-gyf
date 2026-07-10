import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import FleetPage from "./pages/Fleet/FleetPage";
import ShipDetailPage from "./pages/Ship/ShipDetailPage";
import CommandCenterPage from "./pages/CommandCenter/CommandCenterPage";
import AssessmentPage from "./pages/Assessment/AssessmentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

  <Route path="/" element={<CommandCenterPage />} />

  <Route path="/dashboard" element={<DashboardPage />} />

  <Route path="/fleet" element={<FleetPage />} />

  <Route path="/ship/:id" element={<ShipDetailPage />} />

  <Route path="/assessment" element={<AssessmentPage />} />

</Routes>
    </BrowserRouter>
  );
}