"use client";

import { Sidebar } from "@/components/sidebar";
import { Role } from "@prisma/client";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
  userName?: string;
  email?: string;
}

export function DashboardLayout({ children, role, userName, email }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-200">
      <Sidebar role={role} userName={userName} email={email} />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
