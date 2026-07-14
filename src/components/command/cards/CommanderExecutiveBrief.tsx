import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function CommanderExecutiveBrief() {
  const { ready, limited, notReady, average } = useCommanderSnapshot();

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

      <p className="text-xs uppercase tracking-[0.35em] text-sky-400">

        COMMANDER'S BRIEF

      </p>

      <h2 className="mt-2 text-2xl font-bold text-white">

        Executive Summary

      </h2>

      <div className="mt-6 space-y-4">

        <Row
          title="Ready Ships"
          value={`${ready}`}
          color="text-emerald-400"
        />

        <Row
          title="Qualified"
          value={`${limited}`}
          color="text-yellow-400"
        />

        <Row
          title="Not Ready"
          value={`${notReady}`}
          color="text-red-400"
        />

        <Row
          title="Fleet Readiness"
          value={`${average.toFixed(1)}%`}
          color="text-sky-400"
        />

      </div>

      <div className="mt-6 rounded-xl bg-slate-900 p-4">

        <p className="text-sm text-slate-400">

          Recommendation

        </p>

        <p className="mt-2 font-semibold text-white">

          Fleet is capable of conducting
          assigned missions with
          minor limitations.

        </p>

      </div>

    </div>

  );

}

function Row({
  title,
  value,
  color,
}:{
  title:string;
  value:string;
  color:string;
}){

  return(

    <div className="flex justify-between">

      <span className="text-slate-400">

        {title}

      </span>

      <span className={`font-bold ${color}`}>

        {value}

      </span>

    </div>

  )

}