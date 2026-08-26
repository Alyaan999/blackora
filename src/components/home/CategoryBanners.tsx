import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CategoryBanners() {
  return (
    <section className="py-16 bg-[#0b0c10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
            Curated For Distinction
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-100">
            Explore Blackora Collections
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Designed for those who value punctuality, prestige, and timeless luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Men's Category Card */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] border border-zinc-800 group hover:border-amber-500/50 transition-all duration-500">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
              alt="Men's Luxury Watches"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Executive Series
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Men’s Timepieces
              </h3>
              <p className="text-xs text-zinc-300 max-w-sm line-clamp-2">
                Heavyweight chronographs, skeleton open-heart mechanics, and obsidian dials.
              </p>
              <div className="pt-2">
                <Link
                  href="/men"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl transition-all"
                >
                  <span>Explore Men’s</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Women's Category Card */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] border border-zinc-800 group hover:border-amber-500/50 transition-all duration-500">
            <img
              src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop"
              alt="Women's Luxury Watches"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Elegance & Radiance
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Women’s Timepieces
              </h3>
              <p className="text-xs text-zinc-300 max-w-sm line-clamp-2">
                Diamond bezel accents, mother-of-pearl dials, and rose gold Milanese mesh bracelets.
              </p>
              <div className="pt-2">
                <Link
                  href="/women"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl transition-all"
                >
                  <span>Explore Women’s</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
