import React from 'react';
import type { Metadata } from 'next';
import { getPublicProducts } from '@/lib/db';
import { ProductCard } from '@/components/products/ProductCard';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Men’s Luxury Watch Collection | Chronographs & Automatics',
  description:
    'Explore Blackora men’s luxury chronographs, automatic skeleton watches, and Swiss-inspired executive timepieces. Free express delivery in Pakistan & Cash on Delivery.',
  keywords: [
    'men watches Pakistan',
    'mens luxury watches',
    'chronograph watches for men',
    'automatic skeleton watches Pakistan',
    'Blackora men timepieces',
    'executive watches Karachi Lahore',
  ],
  openGraph: {
    title: 'Men’s Luxury Watch Collection | Blackora Pakistan',
    description: 'Executive chronographs and automatic skeleton timepieces engineered for prestige.',
  },
};

export default async function MenCollectionPage() {
  const allProducts = await getPublicProducts();
  const menProducts = allProducts.filter((p) => p.category === 'men');

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header banner */}
        <div className="relative rounded-3xl p-8 sm:p-12 mb-12 bg-gradient-to-r from-[#141724] via-[#0e1017] to-[#141724] border border-zinc-800 text-center sm:text-left overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive & Chronograph</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-zinc-100">
              Men’s Luxury Watch Collection
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Explore our selection of automatic skeleton watches, dual-dial chronographs, and deep emerald dials engineered with surgical-grade 316L stainless steel.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {menProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
