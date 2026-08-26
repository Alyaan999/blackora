'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BlackoraLogo } from '@/components/ui/BlackoraLogo';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Landmark,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout, isLoading } = useAuth();

  // If visiting admin login page, bypass auth check
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAdmin && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAdmin, isLoading, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading || !isAdmin) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products & Stock', href: '/admin/products', icon: Package },
    { label: 'Orders & Payments', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Referrals & Payouts', href: '/admin/withdrawals', icon: Landmark },
    { label: 'Help Desk & Inquiries', href: '/admin/support', icon: Headphones },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#090a0e] text-zinc-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0f1118] border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <BlackoraLogo size="sm" />
            <div className="mt-2 flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 w-fit">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Management</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-zinc-400 hover:text-amber-400 p-2 rounded-xl hover:bg-zinc-800/50 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-xs text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
