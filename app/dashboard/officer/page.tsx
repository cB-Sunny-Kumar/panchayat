import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatusBadge } from "@/components/status-badge";
import { AutoRefresh } from "@/components/auto-refresh";
import { ComplaintClientList } from "@/components/complaint-client-list";
import { getSLAStatus, cn } from "@/lib/utils";
import { Role, Status } from "@prisma/client";
import { AlertTriangle } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OfficerDashboard({ searchParams }: { searchParams: Promise<{ status?: Status }> }) {
  const session = await getSession();
  
  if (!session || session.role !== Role.OFFICER || session.ward == null) {
    redirect("/login");
  }

  const { status: statusFilter } = await searchParams;
  const currentWard = Number(session.ward);

  const complaints = await prisma.complaint.findMany({
    where: {
      ward: currentWard,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter((c: any) => c.status === Status.OPEN).length,
    breached: complaints.filter((c: any) => getSLAStatus(c.createdAt).isBreached && c.status !== Status.RESOLVED && c.status !== Status.CLOSED).length,
  };

  return (
    <DashboardLayout role={Role.OFFICER} userName={session.name} email={session.email}>
      <AutoRefresh interval={5000} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Ward {currentWard} Overview</h1>
        <p className="text-neutral-400 mt-1 font-light">Manage and resolve civic issues for your assigned ward.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
          <p className="text-sm font-semibold text-neutral-400 uppercase tracking-widest relative z-10">Total Ward Complaints</p>
          <p className="text-4xl font-extrabold mt-3 text-white relative z-10">{stats.total}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-all" />
          <p className="text-sm font-semibold text-neutral-400 uppercase text-yellow-500/80 tracking-widest relative z-10">Open Tickets</p>
          <p className="text-4xl font-extrabold mt-3 text-white relative z-10">{stats.open}</p>
        </div>
        <div className="bg-gradient-to-br from-red-950/40 to-red-900/10 border border-red-900/50 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/20 rounded-full blur-xl transition-all" />
          <div className="flex items-center justify-between relative z-10">
            <p className="text-sm font-semibold text-red-400 uppercase tracking-widest">SLA Breaches</p>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-4xl font-extrabold mt-3 text-white relative z-10">{stats.breached}</p>
          <p className="text-xs text-red-400/80 mt-2 font-medium relative z-10">Issues older than 3 days</p>
        </div>
      </div>

      {/* Complaint List */}
      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800/80 bg-neutral-900/50 flex justify-between items-center backdrop-blur-sm sticky top-0 z-10">
          <h2 className="font-bold text-lg text-white">Active Complaints ({complaints.length})</h2>
          <div className="flex gap-2">
            <select className="px-4 py-2 rounded-xl border border-neutral-800 text-sm bg-neutral-950 text-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
              <option>All Categories</option>
              <option>Water</option>
              <option>Road</option>
            </select>
          </div>
        </div>


        <ComplaintClientList complaints={complaints} />
      </div>
    </DashboardLayout>
  );
}


