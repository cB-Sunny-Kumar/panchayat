"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, getSLAStatus, cn } from "@/lib/utils";
import { Status } from "@prisma/client";
import { 
  AlertTriangle, 
  Calendar, 
  Phone,
  X,
  ImageIcon
} from "lucide-react";
import Image from "next/image";
import { updateComplaintStatus } from "@/app/dashboard/officer/actions";
import { useRouter } from "next/navigation";

export function ComplaintClientList({ complaints }: { complaints: any[] }) {
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const router = useRouter();

  if (complaints.length === 0) {
    return (
      <div className="p-12 text-center text-neutral-500 italic bg-neutral-900 border border-neutral-800 rounded-2xl">
        No complaints found for this ward.
      </div>
    );
  }

  const handleStatusUpdate = async (formData: FormData) => {
    if (!selectedComplaint) return;
    const status = formData.get("status") as Status;
    const notes = formData.get("notes") as string;
    
    await updateComplaintStatus(selectedComplaint.id, status, notes);
    
    // Update local state to reflect UI change immediately
    setSelectedComplaint({ ...selectedComplaint, status, notes });
    router.refresh();
  };

  return (
    <>
      <div className="divide-y divide-neutral-800">
        {complaints.map((complaint: any) => {
          const { isBreached, diffInDays } = getSLAStatus(complaint.createdAt);
          const isCritical = isBreached && complaint.status !== Status.RESOLVED && complaint.status !== Status.CLOSED;

          return (
            <div 
              key={complaint.id} 
              onClick={() => setSelectedComplaint(complaint)}
              className={cn(
                "p-6 transition-colors hover:bg-neutral-800/80 cursor-pointer", 
                isCritical && "bg-red-950/20 hover:bg-red-950/40"
              )}
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <StatusBadge status={complaint.status} />
                  {isCritical && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded border border-red-800/50">
                      <AlertTriangle className="w-3 h-3" />
                      {diffInDays} Days Old
                    </span>
                  )}
                  {complaint.imageUrl && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-800/50">
                      <ImageIcon className="w-3 h-3" />
                      Has Image
                    </span>
                  )}
                  <span className="text-xs font-mono text-neutral-500">#{complaint.complaintId}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-neutral-200">{complaint.category}</p>
                  <p className="text-xs text-neutral-500 flex items-center justify-end gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {formatDate(complaint.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-neutral-300 mb-1">{complaint.name}</h3>
                <p className="text-sm text-neutral-400 line-clamp-1">
                  {complaint.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedComplaint(null)}
          />
          
          {/* Panel */}
          <div className="relative w-full max-w-md h-full bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col transform transition-transform overflow-y-auto">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/95 sticky top-0 z-10 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Complaint Details
                </h2>
                <div className="text-xs font-mono text-neutral-500 mt-1">#{selectedComplaint.complaintId}</div>
              </div>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 space-y-8">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Status</p>
                  <StatusBadge status={selectedComplaint.status} />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm font-bold text-neutral-200">{selectedComplaint.category}</p>
                </div>
              </div>

              {/* Citizen Details */}
              <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Citizen Info</p>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-300"><span className="text-neutral-500 w-16 inline-block">Name:</span> {selectedComplaint.name}</p>
                  <p className="text-sm text-neutral-300 flex items-center gap-2"><span className="text-neutral-500 w-16 inline-block">Phone:</span> <Phone className="w-3 h-3 text-neutral-400" /> {selectedComplaint.phone}</p>
                  <p className="text-sm text-neutral-300"><span className="text-neutral-500 w-16 inline-block">Date:</span> {formatDate(selectedComplaint.createdAt)}</p>
                </div>
              </div>

              {/* Description & Image */}
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Issue Description</p>
                <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                  {selectedComplaint.description}
                </p>
                
                {selectedComplaint.imageUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-neutral-800">
                    <img 
                      src={selectedComplaint.imageUrl} 
                      alt="Complaint Evidence"
                      className="w-full object-cover max-h-64"
                    />
                  </div>
                )}
              </div>

              {/* Action Form */}
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">Official Action</p>
                <form action={handleStatusUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Update Status</label>
                    <div className="flex gap-2">
                      <select 
                        name="status" 
                        defaultValue={selectedComplaint.status}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value={Status.OPEN}>Open</option>
                        <option value={Status.IN_PROGRESS}>In Progress</option>
                        <option value={Status.RESOLVED}>Resolved</option>
                        <option value={Status.CLOSED}>Closed</option>
                      </select>
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-900/20">
                        Save
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Internal Notes / Response</label>
                    <textarea 
                      name="notes"
                      placeholder="Add an internal note or a public response to the citizen..."
                      defaultValue={selectedComplaint.notes || ""}
                      className="w-full px-3 py-3 rounded-xl border border-slate-700 bg-slate-800 text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px] resize-y"
                    />
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
