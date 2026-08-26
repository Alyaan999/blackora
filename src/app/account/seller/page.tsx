'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { WithdrawalRequest } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  Sparkles,
  TrendingUp,
  Wallet,
  Copy,
  Check,
  Share2,
  MessageCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Landmark,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export default function SellerPage() {
  const router = useRouter();
  const { user, isSeller, refreshUser, isLoading } = useAuth();
  const { toast, success } = useToast();

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Withdrawal modal state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'easypaisa' | 'jazzcash' | 'bank_transfer'>('easypaisa');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);

  const fetchWithdrawals = () => {
    if (!user?.id) return;
    fetch(`/api/withdrawals?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.withdrawals) setWithdrawals(data.withdrawals);
        setLoadingWithdrawals(false);
      })
      .catch(() => setLoadingWithdrawals(false));
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }
    if (user?.id) {
      fetchWithdrawals();
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://blackora.com';
  const referralLink = `${origin}?ref=${user.referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    success('Referral code copied!');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    success('Affiliate link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const shareWhatsApp = () => {
    const msg = `Explore luxury timepieces on Blackora with express delivery across Pakistan!\nShop with my exclusive link: ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);

    if (amount < 200) {
      toast('Minimum withdrawal amount is Rs. 200', 'error');
      return;
    }

    if (amount > (user.walletBalance || 0)) {
      toast('Insufficient wallet balance', 'error');
      return;
    }

    if (!accountTitle.trim() || !accountNumber.trim()) {
      toast('Please enter your complete account title and number', 'error');
      return;
    }

    setSubmittingWithdraw(true);

    try {
      const res = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount,
          paymentMethod: withdrawMethod,
          accountTitle,
          accountNumber,
          bankName: withdrawMethod === 'bank_transfer' ? bankName : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.withdrawal) {
        toast('Withdrawal request submitted for processing!', 'success');
        setIsWithdrawModalOpen(false);
        setWithdrawAmount('');
        setAccountTitle('');
        setAccountNumber('');
        await refreshUser();
        fetchWithdrawals();
      } else {
        toast(data.error || 'Failed to submit withdrawal', 'error');
      }
    } catch (e) {
      toast('Network error occurred', 'error');
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Affiliate & Reseller Hub</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
              Seller Portal & Earnings
            </h1>
          </div>

          <Link
            href="/account"
            className="text-xs text-zinc-400 hover:text-amber-400 transition-colors"
          >
            ← Back to Account
          </Link>
        </div>

        {/* NOT A SELLER YET NOTICE */}
        {!isSeller ? (
          <div className="bg-[#12141c] border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
                Unlock Your Seller Status
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                You are currently in customer status. Simply order any 1 luxury timepiece from Blackora. Once delivered, you will automatically unlock your <strong>Unique Referral Code</strong> and earn <strong>Rs. 200+ profit</strong> on every order placed by others!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/collections"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
              >
                Browse Watches to Unlock
              </Link>
            </div>
          </div>
        ) : (
          /* ACTIVE SELLER DASHBOARD */
          <div className="space-y-8">
            {/* Earnings Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Available for withdrawal */}
              <div className="bg-[#141724] border border-amber-500/40 p-6 rounded-3xl space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Available Balance
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-serif text-amber-300">
                  {formatPrice(user.walletBalance || 0)}
                </div>
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  disabled={(user.walletBalance || 0) < 200}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-black py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <span>Request Payout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pending Balance */}
              <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    In Transit / Pending
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-serif text-zinc-100">
                  {formatPrice(user.pendingBalance || 0)}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Auto-credits when customer orders are marked Delivered.
                </p>
              </div>

              {/* Lifetime Total */}
              <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Lifetime Earnings
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-serif text-emerald-400">
                  {formatPrice(user.totalEarned || 0)}
                </div>
                <p className="text-[11px] text-zinc-500">Total cumulative profit earned with Blackora.</p>
              </div>
            </div>

            {/* Referral Tools Card */}
            <div className="bg-[#12141c] border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <h2 className="font-serif text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" />
                <span>Your Referral & Affiliate Tools</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Unique Code */}
                <div className="bg-[#181a24] p-5 rounded-2xl border border-zinc-800 space-y-3">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                    Your Unique Referral Code
                  </span>
                  <div className="flex items-center justify-between bg-[#12141c] border border-zinc-700 p-3 rounded-xl">
                    <span className="font-mono text-base font-black text-amber-300">
                      {user.referralCode}
                    </span>
                    <button
                      onClick={copyCode}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Buyers can enter this code manually in the checkout box.
                  </p>
                </div>

                {/* 2. Direct Link */}
                <div className="bg-[#181a24] p-5 rounded-2xl border border-zinc-800 space-y-3">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                    Your Direct Share Link (Auto-Applies Code)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="w-full bg-[#12141c] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none select-all"
                    />
                    <button
                      onClick={copyLink}
                      className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <button
                    onClick={shareWhatsApp}
                    className="w-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Share Directly to WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Withdrawal History Table */}
            <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-amber-400" />
                  <span>Withdrawal Requests & History</span>
                </h2>
              </div>

              {loadingWithdrawals ? (
                <div className="py-8 text-center text-xs text-zinc-500 animate-pulse">
                  Loading withdrawal history...
                </div>
              ) : withdrawals.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">
                  No withdrawal requests made yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="border-b border-zinc-800 text-[11px] text-zinc-500 uppercase">
                      <tr>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Method</th>
                        <th className="pb-3 font-semibold">Account Info</th>
                        <th className="pb-3 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-zinc-850/40 transition-colors">
                          <td className="py-3.5 text-zinc-400">{formatDate(w.createdAt)}</td>
                          <td className="py-3.5 font-serif font-bold text-amber-400">
                            {formatPrice(w.amount)}
                          </td>
                          <td className="py-3.5 uppercase font-medium">{w.paymentMethod}</td>
                          <td className="py-3.5">
                            <span className="font-semibold text-zinc-200">{w.accountTitle}</span>
                            <span className="text-zinc-500 block font-mono text-[11px]">
                              {w.accountNumber} {w.bankName ? `(${w.bankName})` : ''}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {w.status === 'approved' ? (
                              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                SUCCESS / PAID
                              </span>
                            ) : w.status === 'rejected' ? (
                              <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                REJECTED
                              </span>
                            ) : (
                              <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 animate-pulse">
                                <Clock className="w-3 h-3" />
                                PROCESSING
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* WITHDRAWAL REQUEST MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12141c] border border-zinc-700 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <h3 className="font-serif text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-400" />
              <span>Request Wallet Withdrawal</span>
            </h3>

            <form onSubmit={handleRequestWithdrawal} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                  Withdrawal Amount (Rs.) * (Min: Rs. 200)
                </label>
                <input
                  type="number"
                  required
                  min={200}
                  max={user.walletBalance || 0}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Available: Rs. ${user.walletBalance || 0}`}
                  className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400 font-serif font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                  Select Payout Method *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'easypaisa', label: 'EasyPaisa' },
                    { id: 'jazzcash', label: 'JazzCash' },
                    { id: 'bank_transfer', label: 'Bank' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setWithdrawMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                        withdrawMethod === m.id
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-[#181a24] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                  Account Holder Title *
                </label>
                <input
                  type="text"
                  required
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="e.g. Hamza Khan"
                  className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                  Mobile / Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 03001234567"
                  className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              {withdrawMethod === 'bank_transfer' && (
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Meezan Bank / HBL"
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWithdraw}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {submittingWithdraw ? 'Submitting...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
