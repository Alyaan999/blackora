'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import {
  ShoppingBag,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  X,
  Phone,
  MapPin,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { toast, success } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newStatus === 'delivered' ? 'paid' : undefined,
          note: `Admin marked order as ${newStatus}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        if (newStatus === 'delivered') {
          success(`Order ${data.order.orderNumber} marked Delivered! Affiliate commission automatically credited.`);
        } else {
          success(`Order updated to ${newStatus}`);
        }
        setSelectedOrder(data.order);
        fetchOrders();
      } else {
        toast('Failed to update order status', 'error');
      }
    } catch (e) {
      toast('Network error occurred', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <span>Orders & Payment Approvals</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review customer orders, verify EasyPaisa/JazzCash transaction IDs, and update fulfillment status.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'pending', label: 'Pending' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'shipped', label: 'Shipped' },
          { id: 'delivered', label: 'Delivered' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
              filterStatus === tab.id
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-[#141620] border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#12141c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-500 animate-pulse">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">No orders found for this status.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#181a24] border-b border-zinc-800 text-[11px] text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Order #</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Payment & TRX ID</th>
                  <th className="p-4 font-semibold">Referral Bonus</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-300">
                      {order.orderNumber}
                      <span className="text-[10px] text-zinc-500 block font-sans">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-zinc-100 block">{order.customerName}</span>
                      <span className="text-[10px] text-zinc-400 block">{order.customerPhone}</span>
                      <span className="text-[10px] text-zinc-500">{order.city}</span>
                    </td>

                    <td className="p-4">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-200">
                        {order.paymentMethod}
                      </span>
                      {order.transactionId ? (
                        <div className="mt-1">
                          <span className="font-mono text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                            TRX: {order.transactionId}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-500 block mt-0.5">Pay on Arrival</span>
                      )}
                    </td>

                    <td className="p-4">
                      {order.referralCodeUsed ? (
                        <div>
                          <span className="text-amber-400 font-mono font-bold text-[11px] block">
                            Code: {order.referralCodeUsed}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            Reward: {formatPrice(order.totalCommissionEarned)} {order.commissionPaid ? '✓ Paid' : '⏳ Pending'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-[10px]">No code</span>
                      )}
                    </td>

                    <td className="p-4 font-serif font-bold text-zinc-100 text-sm">
                      {formatPrice(order.total)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : order.status === 'shipped'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : order.status === 'cancelled'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER INSPECTION & STATUS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12141c] border border-zinc-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="font-mono text-sm font-bold text-amber-300">
                  {selectedOrder.orderNumber}
                </span>
                <p className="text-[11px] text-zinc-500">Placed on {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-zinc-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Updater */}
            <div className="bg-[#181a24] p-4 rounded-2xl border border-zinc-800 space-y-3">
              <label className="text-[11px] uppercase font-bold text-zinc-300 block tracking-wider">
                Update Order Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(['confirmed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    disabled={updating || selectedOrder.status === st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={`py-2 px-3 rounded-xl font-bold uppercase text-[10px] transition-all ${
                      selectedOrder.status === st
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              {selectedOrder.status === 'delivered' && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Delivered • Affiliate referral commission rewarded.</span>
                </div>
              )}
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#181a24] p-4 rounded-2xl border border-zinc-800">
              <div>
                <span className="text-zinc-500 uppercase text-[10px] font-bold block mb-1">Customer Info</span>
                <p className="font-semibold text-zinc-100">{selectedOrder.customerName}</p>
                <p className="text-zinc-400">{selectedOrder.customerPhone}</p>
                <p className="text-zinc-500">{selectedOrder.customerEmail}</p>
              </div>

              <div>
                <span className="text-zinc-500 uppercase text-[10px] font-bold block mb-1">Delivery Address</span>
                <p className="text-zinc-200">{selectedOrder.address}</p>
                <p className="text-amber-400 font-semibold">{selectedOrder.city}</p>
              </div>
            </div>

            {/* Payment & Transaction Proof */}
            <div className="bg-[#181a24] p-4 rounded-2xl border border-zinc-800 text-xs space-y-2">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">Payment Verification</span>
              <div className="flex items-center justify-between">
                <span>Payment Method: <strong className="text-zinc-200 uppercase">{selectedOrder.paymentMethod}</strong></span>
                <span className="text-amber-400 font-serif font-bold text-sm">
                  Total: {formatPrice(selectedOrder.total)}
                </span>
              </div>
              {selectedOrder.transactionId && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/40 rounded-xl flex items-center justify-between">
                  <span className="text-emerald-300 font-semibold">Online TRX ID Proof:</span>
                  <span className="font-mono text-emerald-200 font-bold text-sm">
                    {selectedOrder.transactionId}
                  </span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">Ordered Items</span>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#181a24] p-3 rounded-xl text-xs">
                  <div className="flex items-center gap-3">
                    <img src={it.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-black/40" />
                    <div>
                      <h4 className="font-semibold text-zinc-100">{it.name}</h4>
                      <span className="text-zinc-500">Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-amber-400">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
