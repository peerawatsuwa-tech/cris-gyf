import { MainLayout } from "@/components/layout/MainLayout";
import CommandBoard from "@/components/command/CommandBoard";

export default function CommandCenterPage() {
  return (
    <MainLayout>
      <div className="h-full min-h-0">
        <CommandBoard />
      </div>
    </MainLayout>
  );
}
