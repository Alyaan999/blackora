import React from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, Share2, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

export function SellerCallout() {
  const steps = [
    {
      icon: ShoppingBag,
      step: '01',
      title: 'Buy Any 1 Watch',
      desc: 'Purchase any luxury timepiece. Once delivered, your account is automatically upgraded to Active Seller status.',
    },
    {
      icon: Share2,
      step: '02',
      title: 'Get Unique Code & Share',
      desc: 'Copy your personalized referral link or share directly to WhatsApp. Your code is auto-applied at checkout.',
    },
    {
      icon: Wallet,
      step: '03',
      title: 'Withdraw Your Profit',
      desc: 'Earn Rs. 200+ per delivered order. Withdraw your earnings straight to EasyPaisa, JazzCash, or your Bank.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0b0c10] via-[#12141e] to-[#0b0c10] border-y border-zinc-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-300 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Blackora Partner & Affiliate Network</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-zinc-100">
            Start Earning With Blackora in 3 Easy Steps
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Turn your passion for watches into a high-profit income stream. No upfront reseller fees, zero inventory risk, and direct Pakistani digital wallet payouts.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-[#151824] border border-zinc-800 hover:border-amber-500/40 rounded-3xl p-8 transition-all duration-300 relative group hover:shadow-2xl hover:shadow-amber-950/20"
              >
                <div className="text-3xl font-serif font-black text-amber-500/20 group-hover:text-amber-500/40 transition-colors absolute top-6 right-8">
                  {s.step}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="font-serif text-lg font-bold text-zinc-100 mb-2">{s.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>

                <div className="mt-6 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Instant Verification</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-zinc-900 to-amber-600/20 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-100">
              Ready to claim your unique seller code?
            </h3>
            <p className="text-xs text-zinc-300 mt-1">
              Purchase your first luxury watch today and unlock unlimited referral earnings.
            </p>
          </div>
          <Link
            href="/account/seller"
            className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20"
          >
            <span>Open Seller Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
