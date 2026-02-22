import Link from "next/link";
import { 
  FilePlus2, 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Users,
  BarChart3
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-blue-500/30">
      {/* Hero Section */}
      <header className="py-24 px-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-blue-600/10 blur-[100px] rounded-full point-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-blue-400 text-sm font-medium mb-8 uppercase tracking-widest shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            Empowering Local Governance
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Civic Issue <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Tracker</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Report local ward issues directly to officials. Track progress in real-time and help build a better panchayat.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]"
            >
              <FilePlus2 className="w-5 h-5" />
              Report an Issue
            </Link>
            <Link 
              href="/track" 
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-neutral-800 hover:border-neutral-700"
            >
              <Search className="w-5 h-5" />
              Track My Complaint
            </Link>
          </div>
        </div>
      </header>

      {/* Login Roles Section */}
      <section className="py-16 bg-neutral-900/50 border-y border-neutral-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm font-medium text-neutral-500 uppercase tracking-widest mb-10">
            Experience the workflow (Mock Login)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/officer" className="group p-8 bg-neutral-900 rounded-3xl border border-neutral-800 hover:border-blue-500/50 hover:bg-neutral-800/80 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-neutral-200">Officer Portal</h3>
              <p className="text-neutral-400 leading-relaxed font-light">Manage ward complaints, view evidence, and update status in real-time.</p>
            </Link>
            
            <Link href="/dashboard/admin" className="group p-8 bg-neutral-900 rounded-3xl border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-800/80 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-neutral-200">Admin Panel</h3>
              <p className="text-neutral-400 leading-relaxed font-light">Analyze global ward performance, track SLAs, and manage officer assignments.</p>
            </Link>
            
            <div className="p-8 bg-neutral-900/50 rounded-3xl border border-neutral-800/50 opacity-70">
              <div className="w-14 h-14 rounded-2xl bg-neutral-800/50 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-neutral-300">Citizen Guest</h3>
              <p className="text-neutral-500 leading-relaxed font-light">Submit and track civic issues anonymously without registration required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900/50 to-blue-800/20 border border-blue-800/50 flex items-center justify-center text-blue-400">
              <FilePlus2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-200">Quick Reporting</h3>
            <p className="text-neutral-400 leading-relaxed font-light text-lg">Submit issues in seconds with photo evidence. No complicated signup process required for basic reports.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-900/50 to-cyan-800/20 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-200">Live Tracking</h3>
            <p className="text-neutral-400 leading-relaxed font-light text-lg">Check the exact status of your request with your unique complaint ID. Know when it moves to 'In Progress'.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-indigo-800/20 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-200">Enforced SLAs</h3>
            <p className="text-neutral-400 leading-relaxed font-light text-lg">Complaints are automatically highlighted to Admins if not resolved within the strict 3-day SLA timeline.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-900 bg-neutral-950 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg flex items-center justify-center text-white font-black text-sm italic">
              CI
            </div>
            <span className="font-bold text-xl tracking-tight text-neutral-200">CivicIssue</span>
          </div>
          <p className="text-neutral-500 font-light text-sm">© 2026 Smart Panchayat Solutions. Built for impact.</p>
        </div>
      </footer>
    </div>
  );
}
