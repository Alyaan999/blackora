import React from 'react';
import type { Metadata } from 'next';
import { getPublicProducts } from '@/lib/db';
import { ProductCard } from '@/components/products/ProductCard';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Women’s Luxury Watches | Rose Gold & Diamond Bezel Timepieces',
  description:
    'Discover Blackora women’s luxury timepieces, diamond encrusted dials, rose gold finishes, and mother-of-pearl watch designs. Cash on Delivery across Pakistan.',
  keywords: [
    'women luxury watches Pakistan',
    'ladies watches Pakistan',
    'rose gold watches women',
    'diamond bezel watches',
    'Blackora women collection',
    'branded watches for women Pakistan',
  ],
  openGraph: {
    title: 'Women’s Luxury Watches | Blackora Pakistan',
    description: 'Radiant rose gold & diamond crystal timepieces crafted for sophisticated elegance.',
  },
};

export default async function WomenCollectionPage() {
  const allProducts = await getPublicProducts();
  const womenProducts = allProducts.filter((p) => p.category === 'women');

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header banner */}
        <div className="relative rounded-3xl p-8 sm:p-12 mb-12 bg-gradient-to-r from-[#1b1420] via-[#0e1017] to-[#1b1420] border border-zinc-800 text-center sm:text-left overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haute Radiance & Crystals</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-zinc-100">
              Women’s Luxury Watch Collection
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Timeless silhouettes, diamond-cut crystal bezels, natural mother-of-pearl dials, and silky rose gold Milanese mesh straps designed for everyday grace and gala events.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {womenProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
