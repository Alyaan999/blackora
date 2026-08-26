'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  CheckCircle2,
  Package,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#10b981'],
      });
    } catch (e) {}

    if (id) {
      fetch(`/api/orders/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) setOrder(data.order);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <div className="animate-spin w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-zinc-400 mt-4">Retrieving order details...</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-[#0b0c10] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Confirmed</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Your order number is <strong className="text-amber-300 font-mono">{order?.orderNumber || id}</strong>.
            </p>
          </div>

          {/* Seller Milestone Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-zinc-900 to-amber-600/15 border border-amber-500/30 text-left space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Affiliate Seller Unlock In Progress</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Once this watch is delivered to you, your account will automatically unlock <strong>Blackora Seller Status</strong> and a unique referral code to start earning profit on every sale!
            </p>
          </div>

          {/* Order Info Table */}
          {order && (
            <div className="bg-[#181a24] rounded-2xl p-5 border border-zinc-800 text-left space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] font-bold">Customer</span>
                  <span className="text-zinc-200 font-semibold">{order.customerName}</span>
                  <span className="text-zinc-400 block">{order.customerPhone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] font-bold">Delivery Address</span>
                  <span className="text-zinc-200">{order.address}, {order.city}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] font-bold">Payment Method</span>
                  <span className="text-zinc-200 font-semibold uppercase">{order.paymentMethod}</span>
                  {order.transactionId && (
                    <span className="text-emerald-400 block font-mono text-[11px]">
                      TRX ID: {order.transactionId}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase text-[10px] font-bold">Total Amount</span>
                  <span className="text-amber-400 font-serif font-bold text-base">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <span className="text-zinc-500 block uppercase text-[10px] font-bold mb-2">Items Ordered</span>
                <div className="space-y-2">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-zinc-300">
                      <span>{it.name} (x{it.quantity})</span>
                      <span className="font-serif font-bold text-zinc-100">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={`/track?order=${order?.orderNumber || id}`}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Dispatch Status</span>
            </Link>
            <Link
              href="/collections"
              className="w-full sm:w-auto bg-[#181a24] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
