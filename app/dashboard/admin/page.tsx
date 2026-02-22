import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { AutoRefresh } from "@/components/auto-refresh";
import { Role, Status } from "@prisma/client";
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertOctagon,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { getSLAStatus, formatDate, cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    redirect("/login");
  }

  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((c: any) => c.status === Status.RESOLVED || c.status === Status.CLOSED).length;
  const openComplaints = complaints.filter((c: any) => c.status === Status.OPEN).length;
  const breachedComplaints = complaints.filter((c: any) => getSLAStatus(c.createdAt).isBreached && c.status !== Status.RESOLVED && c.status !== Status.CLOSED).length;

  // Process data for charts
  const categoryCounts = complaints.reduce((acc: any, c: any) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});
  
  const categoryData = Object.keys(categoryCounts).map(name => ({
    name,
    value: categoryCounts[name]
  }));

  const statusCounts = complaints.reduce((acc: any, c: any) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(name => ({
    name: name.replace('_', ' '),
    value: statusCounts[name]
  }));

  const wardStats = [1, 2].map(wardNum => {
    const wardComplaints = complaints.filter((c: any) => c.ward === wardNum);
    return {
      ward: wardNum,
      total: wardComplaints.length,
      resolved: wardComplaints.filter((c: any) => c.status === Status.RESOLVED || c.status === Status.CLOSED).length,
      breached: wardComplaints.filter((c: any) => getSLAStatus(c.createdAt).isBreached && c.status !== Status.RESOLVED && c.status !== Status.CLOSED).length,
    };
  });

  return (
    <DashboardLayout role={Role.ADMIN} userName={session.name} email={session.email}>
      <AutoRefresh interval={5000} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Panchayat Analytics</h1>
        <p className="text-neutral-400 font-light mt-1">Global oversight of all wards and civic complaints.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest relative z-10">Total Reports</p>
          <p className="text-3xl font-extrabold mt-1 text-white relative z-10">{totalComplaints}</p>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-green-500/30 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all" />
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-4 border border-green-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest relative z-10">Resolved</p>
          <p className="text-3xl font-extrabold mt-1 text-green-400 relative z-10">{resolvedComplaints}</p>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-all" />
          <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-4 border border-yellow-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest relative z-10">Open</p>
          <p className="text-3xl font-extrabold mt-1 text-yellow-400 relative z-10">{openComplaints}</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-950/40 to-red-900/10 border border-red-900/50 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/20 rounded-full blur-xl transition-all" />
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-red-400 uppercase tracking-widest relative z-10">SLA Breaches</p>
          <p className="text-3xl font-extrabold mt-1 text-red-500 relative z-10">{breachedComplaints}</p>
        </div>
      </div>

      <AnalyticsCharts categoryData={categoryData} statusData={statusData} />

      {/* Ward Wise Table */}
      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-xl overflow-hidden mb-8">
        <div className="p-6 border-b border-neutral-800/80 bg-neutral-900/50 flex justify-between items-center backdrop-blur-sm">
          <h2 className="font-bold text-lg text-white">Ward Performance</h2>
          <Link href="/dashboard/admin/wards" className="text-sm font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors">
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <table className="w-full text-left">
          <thead className="bg-neutral-950/50 text-xs font-semibold text-neutral-500 uppercase tracking-widest border-b border-neutral-800/50">
            <tr>
              <th className="px-6 py-4">Ward Number</th>
              <th className="px-6 py-4">Total Complaints</th>
              <th className="px-6 py-4">Resolution Rate</th>
              <th className="px-6 py-4">SLA Breaches</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-neutral-800/50">
            {wardStats.map((stat) => {
              const resRate = stat.total > 0 ? Math.round((stat.resolved / stat.total) * 100) : 0;
              return (
                <tr key={stat.ward} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-neutral-200">Ward {stat.ward}</td>
                  <td className="px-6 py-4 text-neutral-300">{stat.total}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${resRate}%` }} />
                      </div>
                      <span className="font-medium text-neutral-300">{resRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-red-400 font-bold">{stat.breached}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase border",
                      stat.breached > 0 
                        ? "bg-red-950/30 text-red-500 border-red-900/50" 
                        : "bg-green-950/30 text-green-500 border-green-900/50"
                    )}>
                      {stat.breached > 0 ? "Needs Attention" : "Healthy"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recent Activity */}
      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800/80 bg-neutral-900/50 backdrop-blur-sm">
           <h2 className="font-bold text-lg text-white">Recent Reports (All Wards)</h2>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {complaints.slice(0, 5).map((c: any) => (
            <div key={c.id} className="p-4 flex items-center justify-between hover:bg-neutral-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 font-bold text-xs uppercase">
                  {c.category[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-200">{c.category}</p>
                  <p className="text-xs text-neutral-500">Ward {c.ward} • {formatDate(c.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-neutral-500 mb-1">#{c.complaintId}</p>
                <span className="text-[10px] font-bold text-neutral-400 uppercase">{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}


