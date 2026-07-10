import { MainLayout } from "@/components/layout/MainLayout";

export default function AssessmentPage() {
  return (
    <MainLayout>

      <div className="max-w-3xl mx-auto">

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

          <h1 className="text-3xl font-bold text-white">
            Ship Assessment
          </h1>

          <p className="mt-2 text-slate-400">
            Update ship readiness information
          </p>

        </div>

      </div>

    </MainLayout>
  );
}