"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(data.redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <ShieldCheck className="w-16 h-16" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Secure Login
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-400 font-light">
          Authorized access to the Civic Issue Tracker
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-neutral-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl border border-neutral-800 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300 mb-1.5"
              >
                Email address
              </label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl shadow-inner placeholder-slate-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="admin@civic.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300 mb-1.5"
              >
                Password
              </label>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl shadow-inner placeholder-slate-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm font-medium bg-red-950/50 p-3 rounded-xl border border-red-900/50 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                &larr; Back to Home
              </Link>
            </div>
          </form>
        </div>
        
        <div className="mt-8 bg-neutral-900/50 p-5 rounded-2xl text-sm text-neutral-400 border border-neutral-800/50 backdrop-blur-md">
          <p className="font-semibold mb-3 text-neutral-300">Test Accounts:</p>
          <ul className="space-y-2 opacity-80">
            <li className="flex justify-between border-b border-neutral-800/50 pb-2">
              <span>Admin:</span> <code className="text-neutral-300">admin@civic.com / admin123</code>
            </li>
            <li className="flex justify-between pt-1">
              <span>Officer 1:</span> <code className="text-neutral-300">officer1@civic.com / officer123</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
