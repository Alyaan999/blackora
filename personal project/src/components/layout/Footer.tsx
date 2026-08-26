import React from 'react';
import Link from 'next/link';
import { BlackoraLogo } from '@/components/ui/BlackoraLogo';
import { Truck, Headphones, Smartphone, Award, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#08090c] border-t border-zinc-800 text-zinc-400 pt-16 pb-24 lg:pb-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">100% Genuine</h4>
              <p className="text-[11px] text-zinc-500">Premium Japanese & Swiss Movements</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Fast Shipping</h4>
              <p className="text-[11px] text-zinc-500">4-7 Days All Pakistan Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Help Center</h4>
              <p className="text-[11px] text-zinc-500">24/7 Concierge & Inquiry Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">COD & Online</h4>
              <p className="text-[11px] text-zinc-500">Cash on Delivery, EasyPaisa, JazzCash</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <BlackoraLogo size="lg" showTagline />
            <p className="text-xs leading-relaxed text-zinc-400 max-w-sm">
              Blackora is Pakistan’s premier destination for luxury timepieces and executive watches. Built on precision, engineered for prestige, and powered by an exclusive affiliate partner network.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-300">Payment Partners:</span>
              <span className="text-[10px] bg-zinc-800 text-amber-300 font-bold px-2 py-1 rounded border border-zinc-700">
                EasyPaisa
              </span>
              <span className="text-[10px] bg-zinc-800 text-amber-300 font-bold px-2 py-1 rounded border border-zinc-700">
                JazzCash
              </span>
              <span className="text-[10px] bg-zinc-800 text-zinc-200 font-bold px-2 py-1 rounded border border-zinc-700">
                COD
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest mb-4">Collections</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/men" className="hover:text-amber-400 transition-colors">
                  Men’s Chronographs
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-amber-400 transition-colors">
                  Women’s Diamond & Rose Gold
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-amber-400 transition-colors">
                  Automatic Skeleton Series
                </Link>
              </li>
              <li>
                <Link href="/collections?sort=newest" className="hover:text-amber-400 transition-colors">
                  New 2026 Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Seller / Affiliate Program */}
          <div>
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <span>Affiliate & Seller</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/account/seller" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Become a Seller (Buy 1 Watch)
                </Link>
              </li>
              <li>
                <Link href="/account/seller" className="hover:text-zinc-200 transition-colors">
                  Affiliate Link Generator
                </Link>
              </li>
              <li>
                <Link href="/account/seller" className="hover:text-zinc-200 transition-colors">
                  Direct Wallet Withdrawals
                </Link>
              </li>
              <li>
                <Link href="/account/seller" className="hover:text-zinc-200 transition-colors">
                  EasyPaisa / JazzCash Payouts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest mb-4">Concierge Support</h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/track" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Live Order Status</span>
                </Link>
              </li>
              <li>
                <Link href="/help" className="inline-flex items-center gap-2 text-zinc-300 hover:text-amber-300 font-medium transition-colors">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>24/7 Help Center & Inquiries</span>
                </Link>
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Karachi & Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} Blackora Haute Horlogerie. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
