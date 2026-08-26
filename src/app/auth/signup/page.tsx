'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BlackoraLogo } from '@/components/ui/BlackoraLogo';
import { Lock, Mail, User, Phone, ArrowRight, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signup(name, email, password, phone);
    if (res.success) {
      router.push('/account');
    } else {
      setError(res.error || 'Signup failed');
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-[#0b0c10] min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#12141c] border border-zinc-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <BlackoraLogo size="lg" className="justify-center" />
          <h1 className="font-serif text-xl font-bold text-zinc-100 pt-2">Create an Account</h1>
          <p className="text-xs text-zinc-400">
            Join Blackora to track orders and unlock the Seller referral program.
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
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Hamza Khan"
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
              Email Address *
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
              Mobile Number (For Courier & EasyPaisa)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03001234567"
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              />
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
              Create Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Tip: Buying your 1st watch will automatically activate your Seller code to earn profit on referrals!
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? <span>Creating Account...</span> : <><span>Create My Account</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-800 text-xs text-zinc-400">
          <span>Already have an account? </span>
          <Link href="/auth/login" className="text-amber-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
