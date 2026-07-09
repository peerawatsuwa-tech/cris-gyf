interface RecommendationCardProps {
  title: string;
  body: string;
}

export function RecommendationCard({ title, body }: RecommendationCardProps) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
      <p className="text-sm font-medium text-amber-300">{title}</p>
      <p className="mt-1 text-sm text-slate-300">{body}</p>
    </div>
  );
}
