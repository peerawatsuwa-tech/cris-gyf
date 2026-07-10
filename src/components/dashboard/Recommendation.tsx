import { recommendations } from "@/lib/mockRecommendation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function Recommendation() {
  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="text-white">
          Priority Recommendations
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recommendations.map((item) => (
          <div
            key={item.ship}
            className="flex justify-between border-b border-slate-800 pb-2"
          >
            <div>
              <div className="font-semibold text-white">
                {item.ship}
              </div>

              <div className="text-sm text-slate-400">
                {item.action}
              </div>
            </div>

            <span
              className={`font-bold
                ${
                  item.priority === "HIGH"
                    ? "text-red-500"
                    : item.priority === "MEDIUM"
                    ? "text-yellow-400"
                    : "text-sky-400"
                }`}
            >
              {item.priority}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}