'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order, Product, User, WithdrawalRequest, SupportMessage } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Landmark,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Headphones,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/products?admin=true').then((r) => r.json()),
      fetch('/api/users').then((r) => r.json()),
      fetch('/api/withdrawals').then((r) => r.json()),
      fetch('/api/support').then((r) => r.json()),
    ])
      .then(([ordData, prodData, userData, withData, suppData]) => {
        if (ordData.orders) setOrders(ordData.orders);
        if (prodData.products) setProducts(prodData.products);
        if (userData.users) setUsers(userData.users);
        if (withData.withdrawals) setWithdrawals(withData.withdrawals);
        if (suppData.messages) setSupportMessages(suppData.messages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  // Analytics Metrics
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const totalCommissionsPaid = users.reduce((sum, u) => sum + (u.totalEarned || 0), 0);
  const pendingCommissions = users.reduce((sum, u) => sum + (u.pendingBalance || 0), 0);
  const pendingWithdrawalRequests = withdrawals.filter((w) => w.status === 'pending');
  const pendingSupportTickets = supportMessages.filter((m) => m.status === 'pending');
  const lowStockProducts = products.filter((p) => (p.stock || 0) < 15);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
            Store Performance & Analytics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time sales, order fulfillment, stock management, and affiliate commission metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-md shadow-amber-500/20"
          >
            + Add New Watch
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Gross Revenue */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-amber-400">
            {formatPrice(totalSales)}
          </div>
          <p className="text-[11px] text-zinc-500">Across {orders.length} total orders</p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Orders Placed</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-zinc-100">
            {orders.length}
          </div>
          <p className="text-[11px] text-zinc-500">
            {pendingOrders.length} pending review • {deliveredOrders.length} delivered
          </p>
        </div>

        {/* Affiliate Commission Paid */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Affiliate Paid</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-400">
            {formatPrice(totalCommissionsPaid)}
          </div>
          <p className="text-[11px] text-zinc-500">
            {formatPrice(pendingCommissions)} in pending clearance
          </p>
        </div>

        {/* Pending Payout Requests */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Withdrawals</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-zinc-100">
            {pendingWithdrawalRequests.length}
          </div>
          <p className="text-[11px] text-zinc-500">
            <Link href="/admin/withdrawals" className="text-amber-400 hover:underline">
              Review payout requests →
            </Link>
          </p>
        </div>

        {/* Support Inquiries */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Help Desk</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <span>{supportMessages.length}</span>
            {pendingSupportTickets.length > 0 && (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                {pendingSupportTickets.length} new
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500">
            <Link href="/admin/support" className="text-amber-400 hover:underline">
              Respond to tickets →
            </Link>
          </p>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Stock Management Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Preview */}
        <div className="lg:col-span-7 bg-[#12141c] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-zinc-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Recent Orders</span>
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">No orders received yet.</div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#181a24] p-3.5 rounded-2xl flex items-center justify-between gap-4 border border-zinc-800/80 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-300">{ord.orderNumber}</span>
                      <span className="text-zinc-400">• {ord.customerName}</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">
                      {ord.city} • {ord.paymentMethod.toUpperCase()}
                      {ord.referralCodeUsed && (
                        <span className="text-amber-400/90 ml-2 font-mono">
                          (Ref: {ord.referralCodeUsed})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-zinc-100 block">
                      {formatPrice(ord.total)}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-950 text-emerald-300'
                          : ord.status === 'shipped'
                          ? 'bg-sky-950 text-sky-300'
                          : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts (Admin Hidden Feature) */}
        <div className="lg:col-span-5 bg-[#12141c] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-zinc-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Inventory Stock Alerts</span>
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Edit Stock
            </Link>
          </div>

          <p className="text-[11px] text-zinc-400">
            Note: Exact stock quantities are kept hidden from public visitors and only visible in this Admin Panel.
          </p>

          <div className="space-y-3">
            {products.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                className="bg-[#181a24] p-3 rounded-2xl flex items-center justify-between gap-3 border border-zinc-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.images[0]}
                    alt=""
                    className="w-10 h-10 object-cover rounded-lg bg-black/40 border border-zinc-800 shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-zinc-200 line-clamp-1">{prod.name}</h4>
                    <span className="text-[10px] text-zinc-500 uppercase">{prod.category}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-mono font-bold text-xs ${
                      (prod.stock || 0) < 10 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {prod.stock || 0} Units
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    Profit: {formatPrice(prod.commissionAmount || 200)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
