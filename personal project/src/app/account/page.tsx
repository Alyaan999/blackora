'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Order } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  User as UserIcon,
  Package,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  ExternalLink,
  LogOut,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, isSeller, logout, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user?.id) {
      fetch(`/api/orders?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
          setLoadingOrders(false);
        })
        .catch(() => setLoadingOrders(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">DELIVERED</span>;
      case 'shipped':
        return <span className="bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">SHIPPED / IN TRANSIT</span>;
      case 'processing':
      case 'confirmed':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">CONFIRMED</span>;
      case 'cancelled':
        return <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">CANCELLED</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded-full">PENDING</span>;
    }
  };

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card & Seller Banner */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-extrabold text-2xl font-serif">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-zinc-100">{user.name}</h1>
                {isSeller ? (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    SELLER ACTIVE
                  </span>
                ) : (
                  <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    CUSTOMER
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{user.email} • {user.phone || 'No phone set'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/account/seller"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Seller Hub & Wallet</span>
            </Link>
            <button
              onClick={logout}
              className="p-2.5 rounded-xl border border-zinc-700 hover:border-rose-500 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span>Your Orders & Live Tracking</span>
            </h2>
          </div>

          {loadingOrders ? (
            <div className="p-8 bg-[#12141c] rounded-2xl text-center text-xs text-zinc-500 animate-pulse">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-850 flex items-center justify-center mx-auto text-zinc-500">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-zinc-300">No Orders Yet</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Place your first watch order today to unlock your unique affiliate code and start earning profit!
              </p>
              <Link
                href="/collections"
                className="inline-block bg-amber-500 text-black px-6 py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-amber-400 transition-colors"
              >
                Explore Luxury Watches
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#12141c] border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
                    <div>
                      <span className="font-mono text-sm font-bold text-amber-300">
                        {order.orderNumber}
                      </span>
                      <span className="text-zinc-500 text-xs ml-3">
                        Placed on {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <span className="font-serif font-bold text-amber-400 text-base">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-[#181a24] p-3 rounded-xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg bg-black/40 border border-zinc-800"
                        />
                        <div className="text-xs">
                          <h4 className="font-semibold text-zinc-200 line-clamp-1">{item.name}</h4>
                          <span className="text-zinc-500">Qty: {item.quantity} • {formatPrice(item.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Payment info */}
                  <div className="pt-2 text-xs flex flex-wrap items-center justify-between gap-3 text-zinc-400 border-t border-zinc-800/80">
                    <div>
                      <span>Payment: <strong className="text-zinc-200 uppercase">{order.paymentMethod}</strong></span>
                      {order.transactionId && (
                        <span className="ml-2 font-mono text-[11px] text-emerald-400">
                          (TRX: {order.transactionId})
                        </span>
                      )}
                      <span className="ml-3">Delivery to: <strong className="text-zinc-300">{order.city}</strong></span>
                    </div>

                    <Link
                      href={`/track?order=${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold hover:underline"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Live Courier Progress →</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Concierge & Help Center Quick Card */}
        <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>Need Assistance or Have Questions?</span>
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Our 24/7 dedicated support desk is available to assist with order tracking, custom requests, and payment verifications.
            </p>
          </div>

          <Link
            href="/help"
            className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 shadow-md shadow-amber-500/20"
          >
            Open Help Center →
          </Link>
        </div>
      </div>
    </div>
  );
}
