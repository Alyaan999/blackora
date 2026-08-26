'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BlackoraLogo } from '@/components/ui/BlackoraLogo';
import { Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await adminLogin(username, password);
    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error || 'Invalid admin credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#10121a] border border-zinc-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <BlackoraLogo size="lg" className="justify-center" />
          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30 mt-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Control Portal</span>
          </div>
          <h1 className="font-serif text-xl font-bold text-zinc-100">Admin Authentication</h1>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
              Admin Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#161822] border border-zinc-700 rounded-xl px-3.5 py-2.5 pl-9 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161822] border border-zinc-700 rounded-xl px-3.5 py-2.5 pl-9 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? <span>Authenticating...</span> : <><span>Access Admin Panel</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
