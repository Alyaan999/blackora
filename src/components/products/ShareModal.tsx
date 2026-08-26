'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';

interface ShareModalProps {
  productId: string;
  productName: string;
  productSlug?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({
  productId,
  productName,
  isOpen,
  onClose,
}: ShareModalProps) {
  const { user, isSeller } = useAuth();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the affiliate share link
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://blackora.com';
  const refParam = user?.referralCode ? `?ref=${user.referralCode}` : '';
  const shareUrl = `${origin}/product/${productId}${refParam}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    success('Affiliate link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const shareViaWhatsApp = () => {
    const text = `Check out this luxury watch on Blackora: ${productName}!\n\nOrder here: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#12141c] border border-zinc-700/80 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <Share2 className="w-5 h-5" />
          <h3 className="font-serif font-bold text-lg text-zinc-100">Share & Earn Profit</h3>
        </div>

        <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
          Share this exclusive timepiece with your friends or followers. When someone buys using your link, commission will be credited directly to your Blackora wallet!
        </p>

        {isSeller && user ? (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                  Your Unique Referral Code
                </span>
                <span className="font-mono text-sm font-black text-amber-200">{user.referralCode}</span>
              </div>
              <span className="text-[11px] bg-emerald-950 text-emerald-300 font-semibold px-2 py-1 rounded border border-emerald-700/50">
                ACTIVE SELLER
              </span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
                Your Direct Affiliate Link:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none select-all"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              onClick={shareViaWhatsApp}
              className="w-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Share on WhatsApp
            </button>
          </div>
        ) : (
          <div className="bg-zinc-850/60 border border-zinc-800 rounded-xl p-4 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-200">How to Become a Blackora Seller?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Order at least 1 luxury watch from Blackora. Once your order is delivered, you automatically unlock your Unique Affiliate Code and earn commission on every referral!
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs bg-amber-500 text-black font-bold px-4 py-2.5 rounded-xl hover:bg-amber-400 transition-colors"
              >
                Shop Now to Unlock <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
