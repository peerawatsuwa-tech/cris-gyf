import FleetOverviewCard from "../FleetOverviewCard";
import FleetHeatMap from "../FleetHeatMap";
import MissionOverviewCard from "../MissionOverviewCard";
import CriticalAlertCard from "../CriticalAlertCard";
import ImpactCard from "../ImpactCard";
import PriorityFleetCard from "../PriorityFleetCard";
import ImmediateActionCard from "../ImmediateActionCard";

export default function CommandGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <FleetOverviewCard />

      <FleetHeatMap />

      <MissionOverviewCard />

      <CriticalAlertCard />

      <ImpactCard />

      <PriorityFleetCard />

      <ImmediateActionCard />

    </div>
  );
}