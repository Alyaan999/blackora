'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Share2, Star, Eye } from 'lucide-react';
import { ShareModal } from './ShareModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div className="group relative bg-[#12141c] border border-zinc-800/80 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/20 flex flex-col justify-between">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isNewArrival && (
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
              NEW
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-[#1f2833] border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
              BESTSELLER
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Share & Earn Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsShareModalOpen(true);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700/60 text-zinc-300 hover:text-amber-400 hover:border-amber-500/60 transition-all flex items-center justify-center shadow-lg"
          title="Share & Earn Referral Commission"
          aria-label="Share product"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-black/40">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
        </Link>

        {/* Content Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] text-zinc-400">
              <span className="uppercase tracking-widest text-amber-400/90 font-medium">
                {product.category === 'men' ? "Men's Luxury" : product.category === 'women' ? "Women's Grace" : 'Timepiece'}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-zinc-300">{product.rating || 4.9}</span>
                <span className="text-zinc-500">({product.reviewCount || 24})</span>
              </div>
            </div>

            {/* Title */}
            <Link href={`/product/${product.id}`}>
              <h3 className="font-serif text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {/* Tagline */}
            <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-light">
              {product.tagline || product.description}
            </p>
          </div>

          {/* Pricing & Action Buttons */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
            <div>
              <div className="text-base sm:text-lg font-bold text-amber-400 font-serif">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-xs text-zinc-500 line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/product/${product.id}`}
                className="p-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                title="View Watch Details"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={() => addItem(product)}
                className="bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 shadow-md shadow-amber-500/20 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Affiliate Modal */}
      <ShareModal
        productId={product.id}
        productName={product.name}
        productSlug={product.slug}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
