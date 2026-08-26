'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { ShareModal } from '@/components/products/ShareModal';
import {
  ShoppingBag,
  Share2,
  Star,
  ShieldCheck,
  Truck,
  Headphones,
  Sparkles,
  CheckCircle2,
  Minus,
  Plus,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.images[0] || '');
          if (typeof window !== 'undefined') {
            document.title = `${data.product.name} | Blackora Luxury Watches`;
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-zinc-900 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-zinc-900 rounded-xl w-3/4" />
            <div className="h-4 bg-zinc-900 rounded-xl w-1/2" />
            <div className="h-10 bg-zinc-900 rounded-xl w-1/3" />
            <div className="h-32 bg-zinc-900 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-zinc-200">Watch Not Found</h2>
        <p className="text-xs text-zinc-500 mt-2">The timepiece you are looking for is unavailable.</p>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-black/60 border border-zinc-800 shadow-2xl">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-lg">
                  {discountPercent}% SAVE
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-amber-500 scale-95'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchase */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {product.category === 'men' ? "Men's Luxury" : "Women's Grace"}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-zinc-100">{product.rating || 4.9}</span>
                  <span className="text-zinc-500">({product.reviewCount || 34} Reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-zinc-100">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">{product.tagline}</p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#141620] border border-zinc-800/80 flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-bold font-serif text-amber-400">
                  {formatPrice(product.price)}
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-xs text-zinc-500 line-through mt-0.5">
                    Original: {formatPrice(product.originalPrice)}
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock • Dispatch Ready
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs text-zinc-300 leading-relaxed bg-[#11131a] p-4 rounded-2xl border border-zinc-800/60">
              <p>{product.description}</p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-zinc-700 bg-zinc-850 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-zinc-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Bag & Share */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => addItem(product, quantity)}
                  className="flex-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-4 bg-[#181a24] hover:bg-zinc-800 border border-zinc-700 rounded-xl text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-2 text-xs font-bold shrink-0"
                  title="Share Affiliate Link & Earn Commission"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share & Earn</span>
                </button>
              </div>
            </div>

            {/* Specifications Accordion/Table */}
            {product.specs && (
              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <h3 className="font-serif text-sm font-bold text-zinc-200 uppercase tracking-wider">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.specs.caseDiameter && (
                    <div className="p-2.5 bg-[#12141c] rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Case Size</span>
                      <span className="text-zinc-200 font-medium">{product.specs.caseDiameter}</span>
                    </div>
                  )}
                  {product.specs.movement && (
                    <div className="p-2.5 bg-[#12141c] rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Movement</span>
                      <span className="text-zinc-200 font-medium">{product.specs.movement}</span>
                    </div>
                  )}
                  {product.specs.strapMaterial && (
                    <div className="p-2.5 bg-[#12141c] rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Strap Material</span>
                      <span className="text-zinc-200 font-medium">{product.specs.strapMaterial}</span>
                    </div>
                  )}
                  {product.specs.waterResistance && (
                    <div className="p-2.5 bg-[#12141c] rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Water Resistance</span>
                      <span className="text-zinc-200 font-medium">{product.specs.waterResistance}</span>
                    </div>
                  )}
                  {product.specs.glassType && (
                    <div className="p-2.5 bg-[#12141c] rounded-xl border border-zinc-800/80 col-span-2">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Glass Protection</span>
                      <span className="text-zinc-200 font-medium">{product.specs.glassType}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assurances */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Express TCS / Leopard Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
                <span>24/7 Concierge Help Center</span>
              </div>
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
    </div>
  );
}
