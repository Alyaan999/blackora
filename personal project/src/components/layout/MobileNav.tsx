'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Watch, ShoppingBag, User, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export function MobileNav() {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const { user } = useAuth();

  // Don't show bottom nav on admin panel pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Men', href: '/men', icon: Watch },
    { label: 'Women', href: '/women', icon: Watch },
    { label: 'Earn', href: '/account/seller', icon: Sparkles, special: true },
    { label: user ? 'Account' : 'Login', href: user ? '/account' : '/auth/login', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1017]/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                item.special
                  ? 'text-amber-400 font-bold'
                  : isActive
                  ? 'text-amber-400'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.special ? 'text-amber-400 animate-pulse' : ''}`} />
              </div>
              <span className="text-[10px] tracking-wide mt-1 uppercase font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart Trigger */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-zinc-400 hover:text-amber-400 transition-all relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wide mt-1 uppercase font-medium">Bag</span>
        </button>
      </div>
    </div>
  );
}
