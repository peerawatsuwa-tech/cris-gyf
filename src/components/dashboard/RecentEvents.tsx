import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentEvents() {
  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="text-white">
          Recent Events
        </CardTitle>
      </CardHeader>

      <CardContent>
        Coming Soon...
      </CardContent>
    </Card>
  );
}