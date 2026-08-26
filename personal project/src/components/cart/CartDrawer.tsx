'use client';

import React from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f1118] border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif font-bold text-lg text-zinc-100">Your Shopping Bag</h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="p-4 bg-[#141620] border-b border-zinc-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-bold">You unlocked FREE Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-amber-300">{formatPrice(remainingForFreeShipping)}</strong> more for <strong>FREE Delivery</strong>
                  </span>
                )}
              </span>
              <span className="font-bold text-zinc-400">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-base font-bold text-zinc-300">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Explore our luxury Men’s and Women’s timepieces and elevate your wristwear.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-400 transition-colors"
                >
                  Explore Watches
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 bg-[#141722] border border-zinc-800/80 p-3.5 rounded-xl"
                >
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-black/40 shrink-0 border border-zinc-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-200 line-clamp-1">
                          {product.name}
                        </h4>
                        <span className="text-[10px] uppercase text-zinc-500 tracking-wider">
                          {product.category}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-700 bg-zinc-800/80 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-zinc-300 hover:text-white hover:bg-zinc-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-zinc-200">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-zinc-300 hover:text-white hover:bg-zinc-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif font-bold text-amber-400 text-sm">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-[#0c0d14] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-200 font-serif text-sm">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Delivery in Pakistan</span>
                  <span>{remainingForFreeShipping === 0 ? <strong className="text-emerald-400">FREE</strong> : 'Rs. 250'}</span>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-2 flex items-center justify-between">
                <span className="font-bold text-sm text-zinc-200">Estimated Total</span>
                <span className="font-serif font-bold text-lg text-amber-400">
                  {formatPrice(subtotal + (remainingForFreeShipping === 0 ? 0 : 250))}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-zinc-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Cash On Delivery, EasyPaisa & JazzCash Available</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
