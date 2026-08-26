'use client';

import React, { useState, useEffect } from 'react';
import { User, WithdrawalRequest, WithdrawalStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import {
  Landmark,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Wallet,
  Sparkles,
  Phone,
  Check,
  X,
} from 'lucide-react';

export default function AdminWithdrawalsPage() {
  const { toast, success } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = () => {
    Promise.all([
      fetch('/api/users').then((r) => r.json()),
      fetch('/api/withdrawals').then((r) => r.json()),
    ])
      .then(([userData, withData]) => {
        if (userData.users) setUsers(userData.users);
        if (withData.withdrawals) setWithdrawals(withData.withdrawals);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateWithdrawal = async (id: string, status: WithdrawalStatus, adminNote?: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/withdrawals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote }),
      });

      const data = await res.json();
      if (res.ok && data.withdrawal) {
        if (status === 'approved') {
          success('Withdrawal marked as SUCCESS / PAID!');
        } else {
          toast(`Withdrawal marked as ${status}`, 'info');
        }
        fetchData();
      } else {
        toast('Failed to update withdrawal', 'error');
      }
    } catch (e) {
      toast('Network error occurred', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending' || w.status === 'processing');

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-400" />
            <span>Referrals, Wallets & Withdrawal Payouts</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review affiliate wallet balances, process EasyPaisa/JazzCash withdrawal requests, and mark payouts as Success.
          </p>
        </div>
      </div>

      {/* 1. Pending Withdrawal Requests (Action Required) */}
      <div className="bg-[#12141c] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-lg font-bold text-zinc-100">
              Withdrawal Requests Queue ({pendingWithdrawals.length} Pending)
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-zinc-500 animate-pulse">Loading withdrawals...</div>
        ) : withdrawals.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">No withdrawal requests yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#181a24] border-b border-zinc-800 text-[11px] text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">User / Affiliate</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Payout Method & Details</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Approve Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {withdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="p-4 text-zinc-400">{formatDate(req.createdAt)}</td>

                    <td className="p-4">
                      <span className="font-semibold text-zinc-100 block">{req.userName}</span>
                      <span className="text-[10px] text-zinc-400">{req.userEmail}</span>
                      <span className="text-[10px] text-zinc-500 block">{req.userPhone}</span>
                    </td>

                    <td className="p-4 font-serif font-bold text-amber-400 text-sm">
                      {formatPrice(req.amount)}
                    </td>

                    <td className="p-4">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-200">
                        {req.paymentMethod}
                      </span>
                      <div className="mt-1">
                        <span className="text-zinc-200 font-semibold block">{req.accountTitle}</span>
                        <span className="font-mono text-zinc-400 text-[11px]">
                          {req.accountNumber} {req.bankName ? `(${req.bankName})` : ''}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      {req.status === 'approved' ? (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          SUCCESS / PAID
                        </span>
                      ) : req.status === 'rejected' ? (
                        <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          REJECTED
                        </span>
                      ) : (
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3" />
                          PENDING
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {req.status === 'pending' || req.status === 'processing' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={processingId === req.id}
                            onClick={() => handleUpdateWithdrawal(req.id, 'approved', 'Transfer completed via EasyPaisa/JazzCash')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-md shadow-emerald-600/20"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Paid / Success</span>
                          </button>
                          <button
                            disabled={processingId === req.id}
                            onClick={() => handleUpdateWithdrawal(req.id, 'rejected', 'Invalid account number or title')}
                            className="bg-zinc-800 hover:bg-rose-600 hover:text-white text-zinc-400 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center"
                            title="Reject & Refund to Wallet"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. All Users & Wallet Balances */}
      <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-lg font-bold text-zinc-100">
              Registered Users & Affiliate Balances
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#181a24] border-b border-zinc-800 text-[11px] text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">User Name</th>
                <th className="p-4 font-semibold">Email & Phone</th>
                <th className="p-4 font-semibold">Referral Code</th>
                <th className="p-4 font-semibold">Seller Status</th>
                <th className="p-4 font-semibold">Available Wallet (Rs.)</th>
                <th className="p-4 font-semibold">Pending (Rs.)</th>
                <th className="p-4 font-semibold text-right">Lifetime Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-850/40 transition-colors">
                  <td className="p-4 font-semibold text-zinc-100">{u.name}</td>
                  <td className="p-4">
                    <span className="text-zinc-300 block">{u.email}</span>
                    <span className="text-[10px] text-zinc-500">{u.phone || 'No phone'}</span>
                  </td>
                  <td className="p-4 font-mono font-bold text-amber-300">{u.referralCode}</td>
                  <td className="p-4">
                    {u.isSeller ? (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ACTIVE SELLER
                      </span>
                    ) : (
                      <span className="bg-zinc-800 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        CUSTOMER
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-serif font-bold text-amber-400 text-sm">
                    {formatPrice(u.walletBalance || 0)}
                  </td>
                  <td className="p-4 font-serif text-zinc-400">
                    {formatPrice(u.pendingBalance || 0)}
                  </td>
                  <td className="p-4 font-serif font-bold text-emerald-400 text-right text-sm">
                    {formatPrice(u.totalEarned || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
