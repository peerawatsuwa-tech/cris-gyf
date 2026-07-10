import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import FleetPage from "./pages/Fleet/FleetPage";
import ShipDetailPage from "./pages/Ship/ShipDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/fleet" element={<FleetPage />} />

        {/* เพิ่มบรรทัดนี้ */}
        <Route path="/ship/:id" element={<ShipDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}