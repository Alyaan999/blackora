'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const deliveryThreshold = 5000;
  const isFreeDelivery = subtotal >= deliveryThreshold;
  const deliveryCharge = isFreeDelivery ? 0 : 250;
  const total = subtotal + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center space-y-5">
        <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
          Your Shopping Bag Is Empty
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Discover our curated collection of luxury timepieces for Men and Women.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
        >
          <span>Explore All Watches</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100 mb-8 flex items-center gap-3">
          <span>Shopping Bag</span>
          <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-sans">
            {totalItems} items
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-[#12141c] border border-zinc-800 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-black/40 border border-zinc-800 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-zinc-100 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-serif text-amber-300 font-bold">
                      {formatPrice(product.price)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-zinc-700 bg-zinc-800/80 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3.5 text-xs font-bold text-zinc-100">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="font-serif font-bold text-amber-400 text-base">
                    {formatPrice(product.price * quantity)}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1.5 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 bg-[#141620] border border-zinc-800 p-6 rounded-3xl space-y-6">
            <h2 className="font-serif text-lg font-bold text-zinc-100">Order Summary</h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-200 font-serif text-sm">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Standard Delivery (Pakistan)</span>
                <span>{isFreeDelivery ? <strong className="text-emerald-400 font-bold">FREE</strong> : 'Rs. 250'}</span>
              </div>
              {isFreeDelivery && (
                <div className="bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 p-2.5 rounded-xl text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Free Delivery unlocked (Orders over Rs. 5,000)!</span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
              <span className="font-bold text-sm text-zinc-200">Total</span>
              <span className="font-serif font-bold text-xl text-amber-400">
                {formatPrice(total)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 text-[10px] text-zinc-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Cash On Delivery, EasyPaisa & JazzCash Accepted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
