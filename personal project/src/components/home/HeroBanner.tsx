import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Award, Zap } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0b0c10] via-[#10121a] to-[#0b0c10] py-16 sm:py-24 border-b border-zinc-800/80">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-yellow-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>The 2026 Blackora Executive Collection</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight">
              PRECISION IN TIME. <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                PRESTIGE ON YOUR WRIST.
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover executive chronographs, skeleton automatics, and diamond-embellished timepieces. Crafted with surgical 316L stainless steel and sapphire crystal glass.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/men"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
              >
                <span>Men’s Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/women"
                className="w-full sm:w-auto bg-[#181a24] hover:bg-zinc-800 border border-zinc-700 text-zinc-100 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:border-amber-500/40"
              >
                <span>Women’s Collection</span>
              </Link>
              <Link
                href="/account/seller"
                className="w-full sm:w-auto bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold px-6 py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Earn With Us</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-serif">100%</div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Authentic Quality</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-zinc-100 font-serif">2-4 Days</div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Express Courier</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-serif">Rs. 200+</div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Referral Profit</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-950/30 group">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
                alt="Blackora Royal Chronograph"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/20 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#12141d]/90 backdrop-blur-md border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">
                    Flagship Timepiece
                  </span>
                  <h3 className="text-sm font-bold text-zinc-100 font-serif">
                    Royal Chronograph Matte Gold
                  </h3>
                  <p className="text-xs text-amber-300 font-bold mt-0.5">Rs. 4,999</p>
                </div>
                <Link
                  href="/product/prod-1"
                  className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  View Watch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
