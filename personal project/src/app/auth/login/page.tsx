'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BlackoraLogo } from '@/components/ui/BlackoraLogo';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      router.push('/account');
    } else {
      setError(res.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-[#0b0c10] min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#12141c] border border-zinc-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <BlackoraLogo size="lg" className="justify-center" />
          <h1 className="font-serif text-xl font-bold text-zinc-100 pt-2">Sign In to Your Account</h1>
          <p className="text-xs text-zinc-400">
            Access your orders, tracking status, and Seller affiliate wallet.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? <span>Signing In...</span> : <><span>Sign In</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-800 text-xs text-zinc-400">
          <span>Don’t have an account? </span>
          <Link href="/auth/signup" className="text-amber-400 font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
