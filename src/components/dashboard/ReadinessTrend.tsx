import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const data = [
  { status: "Ready", value: 18 },
  { status: "Limited", value: 5 },
  { status: "Not Ready", value: 2 },
];

export default function ReadinessTrend() {
  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="text-white">
          Fleet Readiness
        </CardTitle>
      </CardHeader>

      <CardContent className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="status" />
            <Tooltip />
            <Bar dataKey="value" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}