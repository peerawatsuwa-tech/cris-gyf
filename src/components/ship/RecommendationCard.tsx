import type { Ship } from "@/types/ship";

import { calculateRecommendation } from "@/engine/recommendationEngine";

interface Props {

  ship: Ship;

}

export default function RecommendationCard({ ship }: Props) {

  const recommendations = calculateRecommendation(ship);

  const color = {

    HIGH: "text-red-400",

    MEDIUM: "text-yellow-400",

    LOW: "text-emerald-400",

  };

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <h3 className="text-lg font-semibold text-white">

        Commander Recommendation

      </h3>

      <div className="mt-5 space-y-4">

        {recommendations.map((item) => (

          <div
            key={item.title}
            className="border-b border-slate-800 pb-3"
          >

            <div
              className={`font-semibold ${color[item.priority]}`}
            >

              {item.priority}

            </div>

            <div className="mt-1 text-white">

              {item.title}

            </div>

            <div className="mt-1 text-sm text-slate-400">

              {item.impact}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}