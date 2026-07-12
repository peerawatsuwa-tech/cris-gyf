import type { Ship } from "@/types/ship";
import { calculateRecommendation } from "@/engine/recommendationEngine";

interface Props {
  ship: Ship;
}

export default function RecommendationCard({ ship }: Props) {

  const recommendations = calculateRecommendation(ship);

  const priorityConfig = {
    HIGH: {
      title: "เร่งด่วน",
      color: "border-red-500 bg-red-500/10 text-red-400",
      icon: "🔴",
    },
    MEDIUM: {
      title: "ปานกลาง",
      color: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
      icon: "🟡",
    },
    LOW: {
      title: "ปกติ",
      color: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
      icon: "🟢",
    },
  };

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <h3 className="text-lg font-semibold text-white">
        ข้อเสนอแนะสำหรับผู้บังคับบัญชา
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Commander Decision Support
      </p>

      <div className="mt-6 space-y-4">

        {recommendations.map((item) => {

          const style = priorityConfig[item.priority];

          return (

            <div
              key={item.title}
              className={`rounded-xl border p-4 ${style.color}`}
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="text-xl">
                    {style.icon}
                  </span>

                  <span className="font-semibold">
                    {style.title}
                  </span>

                </div>

              </div>

              <div className="mt-4">

                <p className="font-semibold text-white">
                  {item.title}
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  ผลกระทบ :
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {item.impact}
                </p>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}