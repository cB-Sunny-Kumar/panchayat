"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  BarChart3, 
  Users, 
  AlertCircle,
  Home,
  MessageSquare,
  LogOut
} from "lucide-react";
import { Role } from "@prisma/client";

interface SidebarProps {
  role: Role;
  userName?: string;
  email?: string;
}

export function Sidebar({ role, userName = "User", email = "" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const citizenNav = [
    { href: "/", label: "Home", icon: Home },
    { href: "/submit", label: "Submit Complaint", icon: FileText },
    { href: "/track", label: "Track Complaint", icon: AlertCircle },
  ];

  const officerNav = [
    { href: "/dashboard/officer", label: "Ward Complaints", icon: LayoutDashboard },
    { href: "/dashboard/officer/resolved", label: "Resolved", icon: FileText },
  ];

  const adminNav = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/admin/users", label: "Manage Officers", icon: Users },
  ];

  const navItems = role === "ADMIN" ? adminNav : role === "OFFICER" ? officerNav : citizenNav;
  
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex bg-neutral-900 text-white h-screen w-64 flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-500" />
          CivicIssue
        </h1>
        <p className="text-xs text-neutral-400 mt-1">Smart Panchayat Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-medium" 
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-neutral-500 truncate">{email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 mt-2 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
