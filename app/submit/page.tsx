"use client";

import { submitComplaint } from "./actions";
import Link from "next/link";
import { ArrowLeft, Send, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SubmitComplaintPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadedUrl(data.url);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // The actual form submission is handled by Server Action via action attribute
    // We just want to show a loading state while it happens
  };
  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-neutral-800 rounded-3xl border border-neutral-700 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-neutral-700 bg-neutral-800/50 text-white">
            <h1 className="text-2xl font-bold">Report an Issue</h1>
            <p className="text-neutral-400 text-sm mt-1">Provide details about the civic issue in your ward.</p>
          </div>

          <form action={submitComplaint} onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">Full Name</label>
                <input 
                  name="name" 
                  required 
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-gray-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">Phone Number</label>
                <input 
                  name="phone" 
                  required 
                  placeholder="10-digit mobile"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-gray-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">Ward Number</label>
                <select 
                  name="ward" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-gray-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Select Ward</option>
                  <option value="1">Ward 1</option>
                  <option value="2">Ward 2</option>
                  <option value="3">Ward 3</option>
                  <option value="4">Ward 4</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">Category</label>
                <select 
                  name="category" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-gray-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Water">Water Supply</option>
                  <option value="Road">Road/Pothole</option>
                  <option value="Electricity">Electricity/Streetlight</option>
                  <option value="Garbage">Garbage/Sanitation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-300">Description</label>
              <textarea 
                name="description" 
                required 
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800 text-gray-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-300">Upload Image (Optional)</label>
              <div className="relative">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-gray-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 transition-all"
                />
              </div>
              
              {/* Hidden input to hold the actual URL for the Server Action FormData */}
              <input type="hidden" name="imageUrl" value={uploadedUrl} />

              {isUploading && (
                <p className="text-sm text-blue-400 flex items-center gap-2 mt-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading image...
                </p>
              )}
              {uploadError && <p className="text-sm text-red-500 mt-2">{uploadError}</p>}
              {uploadedUrl && (
                <p className="text-sm text-green-400 flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-4 h-4" /> Image uploaded successfully
                </p>
              )}
            </div>

            <button 
              type="submit"
              disabled={isUploading || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
