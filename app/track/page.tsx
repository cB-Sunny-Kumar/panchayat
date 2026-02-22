import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Tag, 
  Clock, 
  StickyNote,
  MessageSquare
} from "lucide-react";

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  
  const complaint = id ? await prisma.complaint.findUnique({
    where: { complaintId: id },
  }) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Search Header */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 mb-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <Search className="w-6 h-6 text-blue-500" />
            Track Status
          </h1>
          <form className="flex gap-3">
            <input 
              name="id" 
              defaultValue={id}
              placeholder="Paste your Complaint ID here..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono placeholder:text-slate-500"
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              Check
            </button>
          </form>
        </div>

        {id && !complaint && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
            No complaint found with ID: <span className="font-mono font-bold text-red-300">{id}</span>. Please check and try again.
          </div>
        )}

        {complaint && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Status Card */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-8 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4 bg-slate-950/50 text-white">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Complaint ID</p>
                  <code className="text-lg font-mono font-bold text-blue-400">{complaint.complaintId}</code>
                </div>
                <StatusBadge status={complaint.status} className="px-4 py-1.5 text-sm uppercase font-bold" />
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Category</p>
                      <p className="font-bold text-slate-100">{complaint.category}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Ward Number</p>
                      <p className="font-bold text-slate-100">Ward {complaint.ward}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Date Reported</p>
                      <p className="font-bold text-slate-100">{formatDate(complaint.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-slate-300 leading-relaxed italic">"{complaint.description}"</p>
                </div>
              </div>

              {complaint.imageUrl && (
                <div className="px-8 pb-8">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Attached Image</p>
                  <img 
                    src={complaint.imageUrl} 
                    alt="Complaint Proof" 
                    className="w-full rounded-2xl border border-slate-800 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Officer Response Card */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                <MessageSquare className="w-6 h-6 text-green-500" />
                Officer Response
              </h2>
              {complaint.notes ? (
                <div className="flex gap-4">
                  <div className="w-1 bg-green-500 rounded-full" />
                  <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {complaint.notes}
                    </p>
                    <div className="pt-4 border-t border-slate-800/80">
                      <p className="text-xs text-slate-500">Last Updated: {formatDate(complaint.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 text-slate-500 italic bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <StickyNote className="w-5 h-5 text-slate-400" />
                  <p>No notes from the officer yet. Status is currently: <span className="font-semibold text-slate-300">{complaint.status.replace('_', ' ')}</span>.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
