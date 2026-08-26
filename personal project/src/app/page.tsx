import React from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeatureBadges } from '@/components/home/FeatureBadges';
import { CategoryBanners } from '@/components/home/CategoryBanners';
import { SellerCallout } from '@/components/home/SellerCallout';
import { ProductCard } from '@/components/products/ProductCard';
import { getPublicProducts } from '@/lib/db';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getPublicProducts();
  const menProducts = products.filter((p) => p.category === 'men').slice(0, 3);
  const womenProducts = products.filter((p) => p.category === 'women').slice(0, 3);

  return (
    <div className="space-y-0">
      {/* 1. Hero Showcase */}
      <HeroBanner />

      {/* 2. Trust & Service Badges */}
      <FeatureBadges />

      {/* 3. Category Explorers */}
      <CategoryBanners />

      {/* 4. Men's Executive Timepieces */}
      <section className="py-16 bg-[#0b0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Series</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
                Men’s Masterpieces
              </h2>
            </div>
            <Link
              href="/men"
              className="text-xs uppercase tracking-wider font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View All Men’s Watches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {menProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Women's Diamond & Rose Gold Collection */}
      <section className="py-16 bg-[#0d0f17] border-y border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Haute Elegance</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
                Women’s Luxury Collection
              </h2>
            </div>
            <Link
              href="/women"
              className="text-xs uppercase tracking-wider font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View All Women’s Watches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {womenProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Reseller & Affiliate Callout (Earn Rs. 200+ per order) */}
      <SellerCallout />

      {/* 7. Customer Reviews & VIP Trust */}
      <section className="py-16 bg-[#0b0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Verified Experience
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
              What Blackora Connoisseurs Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Zaryab Farooq',
                city: 'Lahore, Pakistan',
                rating: 5,
                watch: 'Royal Chronograph Matte Gold',
                text: 'The weight, build quality, and dial finish exceeded my expectations. Delivered in 2 days via TCS with COD. Absolutely stellar packaging!',
              },
              {
                name: 'Ayesha Malik',
                city: 'Islamabad, Pakistan',
                rating: 5,
                watch: 'Aurora Diamond Petite (Rose Gold)',
                text: 'Received so many compliments at a wedding dinner. The mother of pearl dial shines elegantly under lights. 10/10 recommendation.',
              },
              {
                name: 'Bilal Ahmed',
                city: 'Karachi, Pakistan',
                rating: 5,
                watch: 'Obsidian Skeleton Automatic',
                text: 'Bought 1 watch for myself, unlocked the Seller status, and already earned Rs. 1,400 just by sharing links in my office group! Payout arrived on EasyPaisa smoothly.',
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="bg-[#12141c] border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{review.text}"
                </p>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100">{review.name}</h4>
                    <span className="text-[10px] text-zinc-500">{review.city}</span>
                  </div>
                  <span className="text-[10px] text-amber-400/90 font-medium">{review.watch}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
