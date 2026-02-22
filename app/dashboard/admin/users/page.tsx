"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Role } from "@prisma/client";
import { Users, Plus, Loader2, UserPlus, Trash2 } from "lucide-react";

interface Officer {
  id: string;
  name: string;
  email: string;
  ward: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    ward: "",
  });

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const res = await fetch("/api/officers");
      if (res.ok) {
        const data = await res.json();
        setOfficers(data);
      }
    } catch (err) {
      console.error("Failed to fetch officers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setError("");

    try {
      const res = await fetch("/api/officers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create officer");
      }

      setOfficers([data, ...officers]);
      setFormData({ name: "", email: "", password: "", ward: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <DashboardLayout role={Role.ADMIN} userName="Admin" email="admin@civic.com">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Officer Management</h1>
          <p className="text-neutral-500">Register and manage Panchayat officers and their assigned wards.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Officer Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Add New Officer
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                  placeholder="officer@civic.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Assigned Ward</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                  placeholder="e.g. 1"
                />
              </div>
              
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              
              <button
                type="submit"
                disabled={isAdding}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex justify-center items-center"
              >
                {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Officer"}
              </button>
            </form>
          </div>
        </div>

        {/* Officers List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center gap-2">
               <Users className="w-5 h-5 text-neutral-500" />
               <h2 className="font-bold text-lg">Active Officers</h2>
            </div>
            
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : officers.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                No officers found. Add one to get started.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {officers.map((officer) => (
                  <div key={officer.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {officer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{officer.name}</p>
                        <p className="text-xs text-neutral-500">{officer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Ward</p>
                        <p className="text-sm font-bold text-neutral-900">{officer.ward}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
