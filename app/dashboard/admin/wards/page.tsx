import { DashboardLayout } from "@/components/dashboard-layout";
import { Role } from "@prisma/client";
import { MapPin } from "lucide-react";

export default function AdminWardsPage() {
  return (
    <DashboardLayout role={Role.ADMIN}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Ward Management</h1>
        <p className="text-neutral-500 max-w-md">
          Oversee ward boundaries, assign officers, and track local issues by territory. This page is under construction.
        </p>
      </div>
    </DashboardLayout>
  );
}
