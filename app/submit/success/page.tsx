import Link from "next/link";
import { CheckCircle2, Search, House } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = await searchParams;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-6 shadow-sm border border-green-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Report Submitted!</h1>
        <p className="text-neutral-500 mb-8">Thank you for helping us improve our ward. Your complaint has been registered.</p>
        
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8 text-left shadow-sm">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">Your Complaint ID</p>
          <div className="flex items-center justify-between">
            <code className="text-xl font-mono font-bold text-blue-600">{id}</code>
            <CopyButton text={id} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href={`/track?id=${id}`} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
          >
            <Search className="w-5 h-5" />
            Track Status Now
          </Link>
          <Link 
            href="/" 
            className="w-full bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <House className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
