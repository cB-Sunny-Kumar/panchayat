import { DashboardLayout } from "@/components/dashboard-layout";
import { Role } from "@prisma/client";
import { BarChart3 } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout role={Role.ADMIN}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Detailed Analytics</h1>
        <p className="text-neutral-500 max-w-md">
          Deep dive into ward performance, category trends, and officer efficiency. This page is under construction.
        </p>
      </div>
    </DashboardLayout>
  );
}
