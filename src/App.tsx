import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import FleetPage from "./pages/Fleet/FleetPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/fleet" element={<FleetPage />} />
      </Routes>
    </BrowserRouter>
  );
}