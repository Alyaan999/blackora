'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Phone,
  Headphones,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('order') || '';

  const { error: toastError } = useToast();
  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (searchVal?: string) => {
    const q = (searchVal !== undefined ? searchVal : query).trim();
    if (!q) {
      toastError('Please enter your Order Number (e.g. BLK-1234), Phone, or Email.');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/orders?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        // Try direct lookup by ID
        const singleRes = await fetch(`/api/orders/${encodeURIComponent(q)}`);
        const singleData = await singleRes.json();
        if (singleData.order) {
          setOrders([singleData.order]);
        } else {
          setOrders([]);
        }
      }
    } catch {
      setOrders([]);
      toastError('Failed to retrieve order tracking information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Live Order Tracking & Courier Status | Blackora';
    }
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 3;
      case 'shipped':
        return 2;
      case 'processing':
      case 'confirmed':
        return 1;
      case 'cancelled':
        return -1;
      default:
        return 0; // pending
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & Queued' },
    { title: 'Confirmed', desc: 'Verified & Prepared' },
    { title: 'Dispatched', desc: 'Express TCS / Leopard' },
    { title: 'Delivered', desc: 'Fulfilled Successfully' },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 shadow-sm">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Dispatch & Fulfillment</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight">
            Track Your Timepiece
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Enter your <strong>Order Number</strong> (e.g. <span className="font-mono text-amber-400">BLK-8921</span>), registered Phone Number, or Email address to inspect real-time courier progress.
          </p>
        </div>

        {/* Search Bar Box */}
        <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order # (e.g. BLK-1234), Mobile #, or Email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#171924] border border-zinc-700/80 focus:border-amber-400 rounded-xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-black px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
            <p className="text-xs text-zinc-400 mt-3">Connecting to courier database...</p>
          </div>
        )}

        {!loading && hasSearched && orders.length === 0 && (
          <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mx-auto text-zinc-500">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-200">No Orders Found</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              We couldn’t find an order matching <span className="font-mono text-amber-400 font-bold">"{query}"</span>. Please make sure the order number or phone number is correct.
            </p>
            <div className="pt-2">
              <Link
                href="/help"
                className="text-xs text-amber-400 hover:underline font-semibold inline-flex items-center gap-1.5"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Contact Concierge Help Desk for Assistance →</span>
              </Link>
            </div>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
              <span>Showing {orders.length} order(s) for your inquiry</span>
              <button
                onClick={() => handleTrack()}
                className="flex items-center gap-1.5 text-amber-400 hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Live Status</span>
              </button>
            </div>

            {orders.map((order) => {
              const currentStep = getStepIndex(order.status);
              const isCancelled = order.status === 'cancelled';

              return (
                <div
                  key={order.id}
                  className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-zinc-400">
                          Placed {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-2 font-medium">
                        Recipient: <strong className="text-zinc-100">{order.customerName}</strong> ({order.customerPhone})
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-zinc-400 text-xs block uppercase font-semibold">
                        Total Amount
                      </span>
                      <span className="font-serif text-2xl font-bold text-amber-400">
                        {formatPrice(order.total)}
                      </span>
                      <span className="text-[11px] text-zinc-500 block uppercase font-medium mt-0.5">
                        {order.paymentMethod.toUpperCase()} • {order.paymentStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Visual Stepper Tracker */}
                  {isCancelled ? (
                    <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-5 flex items-center gap-3 text-rose-200 text-xs">
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>
                        <strong className="block text-sm font-bold text-rose-300">Order Cancelled</strong>
                        <span>This order was marked as cancelled. If this was a mistake, please reach out to our concierge desk.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        <span>Live Shipment Progress</span>
                        <span className="text-amber-400">
                          Status: {order.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Step Progress Bar */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                        {steps.map((step, idx) => {
                          const isCompleted = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div
                              key={idx}
                              className={`p-4 rounded-2xl border transition-all ${
                                isCurrent
                                  ? 'bg-[#1b1e2c] border-amber-500 shadow-lg shadow-amber-500/10'
                                  : isCompleted
                                  ? 'bg-[#151722] border-zinc-700 text-zinc-200'
                                  : 'bg-[#0f1017] border-zinc-800/80 text-zinc-600'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 mb-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    isCompleted
                                      ? 'bg-amber-500 text-black'
                                      : 'bg-zinc-800 text-zinc-500'
                                  }`}
                                >
                                  {isCompleted ? '✓' : idx + 1}
                                </div>
                                <span className={`text-xs font-bold ${isCompleted ? 'text-zinc-100' : 'text-zinc-500'}`}>
                                  {step.title}
                                </span>
                              </div>
                              <p className={`text-[11px] ${isCompleted ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                {step.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Destination & Ordered Items Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800 text-xs">
                    {/* Delivery Destination */}
                    <div className="bg-[#181a24] p-5 rounded-2xl border border-zinc-800/80 space-y-3">
                      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Delivery Destination</span>
                      </div>
                      <p className="text-zinc-200 leading-relaxed">
                        {order.address}, <strong>{order.city}</strong>
                        {order.postalCode ? ` (${order.postalCode})` : ''}
                      </p>
                      <div className="pt-2 border-t border-zinc-800/60 text-zinc-400 space-y-1 text-[11px]">
                        <div>Courier: <strong className="text-zinc-200">Express TCS / Leopard</strong></div>
                        {order.transactionId && (
                          <div>TRX Reference: <strong className="text-emerald-400 font-mono">{order.transactionId}</strong></div>
                        )}
                        {order.notes && <div>Notes: {order.notes}</div>}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-[#181a24] p-5 rounded-2xl border border-zinc-800/80 space-y-3">
                      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-amber-400" />
                        <span>Watches in this Package ({order.items.length})</span>
                      </div>

                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-[#13141d] p-2.5 rounded-xl border border-zinc-800/60">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg bg-black/40 border border-zinc-800"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-zinc-200 truncate">{item.name}</h4>
                              <div className="text-[11px] text-zinc-400 flex items-center justify-between mt-0.5">
                                <span>Qty: {item.quantity}</span>
                                <span className="font-serif font-bold text-amber-400">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Concierge Help Callout */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-[#171924] to-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-zinc-300 text-center sm:text-left">
                      Have questions or need to update your shipping address for this order?
                    </span>
                    <Link
                      href="/help"
                      className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-colors shrink-0"
                    >
                      Contact Support Desk
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
