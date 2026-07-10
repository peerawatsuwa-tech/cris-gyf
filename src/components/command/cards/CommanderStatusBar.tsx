import { fleet } from "@/data/fleet";
import { calculateReadiness } from "@/engine/calculateReadiness";

export default function CommanderStatusBar() {

  const results = fleet.map(ship => calculateReadiness(ship));

  const ready =
    results.filter(r => r.readiness === "Y").length;

  const limited =
    results.filter(r => r.readiness === "Q").length;

  const notReady =
    results.filter(r => r.readiness === "N").length;

  const avg =
    results.reduce((a,b)=>a+b.score,0)/results.length;

  return (

    <div className="grid gap-4 md:grid-cols-4">

      <Status
        title="READY"
        value={ready}
        color="text-emerald-400"
      />

      <Status
        title="LIMITED"
        value={limited}
        color="text-yellow-400"
      />

      <Status
        title="NOT READY"
        value={notReady}
        color="text-red-400"
      />

      <Status
        title="AVG SCORE"
        value={`${avg.toFixed(1)}%`}
        color="text-sky-400"
      />

    </div>

  );

}

function Status({
 title,
 value,
 color,
}:{
 title:string;
 value:string|number;
 color:string;
}){

 return(

<div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

<p className="text-xs uppercase tracking-widest text-slate-400">

{title}

</p>

<p className={`mt-2 text-3xl font-bold ${color}`}>

{value}

</p>

</div>

);

}