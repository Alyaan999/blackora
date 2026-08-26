'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { formatPrice } from '@/lib/utils';
import { StoreSettings } from '@/lib/types';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Sparkles,
  ArrowRight,
  Lock,
  UserPlus,
  HelpCircle,
  X,
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Guest Seller Alert Modal
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [city, setCity] = useState('Karachi');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Referral code logic
  const initialRef = searchParams.get('ref') || '';
  const [referralCode, setReferralCode] = useState(initialRef);
  const [referralValidation, setReferralValidation] = useState<{
    checked: boolean;
    valid: boolean;
    referrerName?: string;
    error?: string;
  }>({ checked: false, valid: false });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'easypaisa' | 'jazzcash'>('cod');
  const [transactionId, setTransactionId] = useState('');

  // Load Settings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(console.error);
  }, []);

  // Autofill user info if logged in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Validate referral code whenever it changes
  useEffect(() => {
    if (!referralCode.trim()) {
      setReferralValidation({ checked: false, valid: false });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/referral/validate?code=${encodeURIComponent(referralCode.trim())}`);
        const data = await res.json();
        if (data.valid) {
          setReferralValidation({
            checked: true,
            valid: true,
            referrerName: data.referrerName,
          });
        } else {
          setReferralValidation({
            checked: true,
            valid: false,
            error: data.error || 'Invalid referral code',
          });
        }
      } catch (e) {
        setReferralValidation({ checked: true, valid: false, error: 'Validation failed' });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [referralCode]);

  const freeShippingThreshold = settings?.freeDeliveryThreshold || 5000;
  const isFreeDelivery = subtotal >= freeShippingThreshold;
  const deliveryFee = isFreeDelivery ? 0 : settings?.deliveryFee || 250;
  const total = subtotal + deliveryFee;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast('Your bag is empty.', 'error');
      return;
    }

    if (!customerName || !customerPhone || !city || !address) {
      toast('Please fill all required shipping fields.', 'error');
      return;
    }

    if ((paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && !transactionId.trim()) {
      toast('Please enter your Transaction ID for online payment verification.', 'error');
      return;
    }

    // If user is NOT logged in, show the special seller invitation modal first!
    if (!user) {
      setShowGuestModal(true);
      return;
    }

    // Otherwise place order directly
    executeOrderPlacement();
  };

  const executeOrderPlacement = async () => {
    setShowGuestModal(false);
    setLoading(true);

    try {
      const orderPayload = {
        userId: user?.id,
        customerName,
        customerEmail: customerEmail || 'guest@blackora.com',
        customerPhone,
        city,
        address,
        postalCode,
        notes,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        paymentMethod,
        transactionId: paymentMethod !== 'cod' ? transactionId.trim() : undefined,
        referralCode: referralValidation.valid ? referralCode.trim() : undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && data.order) {
        clearCart();
        toast('Order placed successfully!', 'success');
        router.push(`/order-success/${data.order.id}`);
      } else {
        toast(data.error || 'Failed to place order', 'error');
        setLoading(false);
      }
    } catch (err) {
      toast('Network error occurred. Please try again.', 'error');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-2xl font-bold text-zinc-200">Your Bag is Empty</h2>
        <p className="text-xs text-zinc-400 mt-2 mb-6">
          Please add a watch to your shopping bag before proceeding to checkout.
        </p>
        <button
          onClick={() => router.push('/collections')}
          className="bg-amber-500 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase"
        >
          Browse Watches
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Lock className="w-4 h-4 text-amber-400" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Shipping & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Details */}
            <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <span>Shipping Information</span>
                </h2>
                {!user && (
                  <Link
                    href="/auth/login"
                    className="text-[11px] text-amber-400 hover:underline font-semibold"
                  >
                    Already have an account? Sign In
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ali Raza"
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ali@example.com"
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Destination City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    {[
                      'Karachi',
                      'Lahore',
                      'Islamabad',
                      'Rawalpindi',
                      'Faisalabad',
                      'Multan',
                      'Peshawar',
                      'Quetta',
                      'Sialkot',
                      'Gujranwala',
                      'Hyderabad',
                      'Other Cities (Pakistan)',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Complete Street Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat #, Street, Sector/Area, Landmark..."
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* 2. Referral Code Box */}
            <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Affiliate / Referral Code</span>
                </h2>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Optional</span>
              </div>

              <p className="text-xs text-zinc-400">
                Have a Blackora referral code from a friend or seller? Enter it here.
              </p>

              <div className="relative">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BLK-HAMZA77"
                  className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono tracking-wider focus:outline-none focus:border-amber-400 uppercase"
                />
              </div>

              {referralValidation.checked && referralValidation.valid && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Valid referral code! Referred by <strong>{referralValidation.referrerName}</strong>.
                  </span>
                </div>
              )}

              {referralValidation.checked && !referralValidation.valid && referralCode.trim() && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/50 border border-rose-800/40 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{referralValidation.error}</span>
                </div>
              )}
            </div>

            {/* 3. Payment Method */}
            <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-3xl space-y-5 shadow-xl">
              <h2 className="font-serif text-lg font-bold text-zinc-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>Choose Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-[#181a24] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-5 h-5 text-amber-400" />
                    {paymentMethod === 'cod' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100">Cash on Delivery</h4>
                    <p className="text-[10px] text-zinc-400">Pay when watch arrives</p>
                  </div>
                </button>

                {/* EasyPaisa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('easypaisa')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                    paymentMethod === 'easypaisa'
                      ? 'bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-500/10'
                      : 'bg-[#181a24] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    {paymentMethod === 'easypaisa' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100">EasyPaisa</h4>
                    <p className="text-[10px] text-zinc-400">Direct mobile transfer</p>
                  </div>
                </button>

                {/* JazzCash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                    paymentMethod === 'jazzcash'
                      ? 'bg-rose-500/15 border-rose-400 shadow-md shadow-rose-500/10'
                      : 'bg-[#181a24] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className="w-5 h-5 text-rose-400" />
                    {paymentMethod === 'jazzcash' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100">JazzCash</h4>
                    <p className="text-[10px] text-zinc-400">Direct mobile transfer</p>
                  </div>
                </button>
              </div>

              {/* Online Payment Details & Transaction ID Input */}
              {paymentMethod === 'easypaisa' && (
                <div className="p-4 rounded-2xl bg-[#141b18] border border-emerald-800/60 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">EasyPaisa Account Title:</span>
                    <span className="text-emerald-300 font-bold font-mono">
                      {settings?.easyPaisaAccountTitle || 'Blackora Official Store'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">EasyPaisa Number:</span>
                    <span className="text-emerald-300 font-bold font-mono text-sm">
                      {settings?.easyPaisaAccountNumber || '03001234567'}
                    </span>
                  </div>
                  <div className="border-t border-emerald-900/60 pt-3">
                    <label className="text-[11px] font-semibold text-zinc-200 block mb-1 uppercase tracking-wider">
                      Enter EasyPaisa Transaction ID (TRX ID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 892301934"
                      className="w-full bg-[#0d1410] border border-emerald-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-400"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Our finance team will verify the TRX ID and approve your order.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'jazzcash' && (
                <div className="p-4 rounded-2xl bg-[#1b1414] border border-rose-800/60 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">JazzCash Account Title:</span>
                    <span className="text-rose-300 font-bold font-mono">
                      {settings?.jazzCashAccountTitle || 'Blackora Luxury Watches'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">JazzCash Number:</span>
                    <span className="text-rose-300 font-bold font-mono text-sm">
                      {settings?.jazzCashAccountNumber || '03009876543'}
                    </span>
                  </div>
                  <div className="border-t border-rose-900/60 pt-3">
                    <label className="text-[11px] font-semibold text-zinc-200 block mb-1 uppercase tracking-wider">
                      Enter JazzCash Transaction ID (TID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 748291032"
                      className="w-full bg-[#140d0d] border border-rose-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-400"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Our finance team will verify the TID and approve your order.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review & Submit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141620] border border-zinc-800 p-6 rounded-3xl space-y-6 shadow-2xl">
              <h2 className="font-serif text-lg font-bold text-zinc-100">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-black/40 border border-zinc-800"
                      />
                      <div>
                        <h4 className="font-semibold text-zinc-200 line-clamp-1">{product.name}</h4>
                        <span className="text-[10px] text-zinc-500">Qty: {quantity}</span>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-amber-400">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-zinc-800 pt-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-200 font-serif text-sm">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Delivery Charges</span>
                  <span>{isFreeDelivery ? <strong className="text-emerald-400">FREE</strong> : formatPrice(deliveryFee)}</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-200">Total Payable</span>
                  <span className="font-serif font-bold text-2xl text-amber-400">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order ({formatPrice(total)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>SSL Encrypted • 100% Guaranteed Safe Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* GUEST CHECKOUT / SELLER UNLOCK DIALOG MODAL */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12141c] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowGuestModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-100">
                Unlock Blackora Seller Status?
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                If you <strong>Log In / Sign Up</strong> before ordering, you will automatically become a <strong>Verified Blackora Seller</strong> once your watch is delivered, and get your Unique Referral Code to earn <strong className="text-amber-400">Rs. 200+ profit</strong> on every referral!
              </p>
              <p className="text-[11px] text-zinc-500 pt-1">
                If you continue as Guest, your order will still be processed normally, but you won't unlock the Seller referral earnings.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Login / Sign Up Action */}
              <Link
                href="/auth/login"
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>Log In / Sign Up (Recommended)</span>
              </Link>

              {/* Continue as Guest Action */}
              <button
                type="button"
                onClick={executeOrderPlacement}
                className="w-full bg-[#181a24] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Continue as Guest (Normal Buyer)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
