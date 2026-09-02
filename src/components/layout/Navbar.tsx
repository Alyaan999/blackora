'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { BlackoraLogo } from '@/components/ui/BlackoraLogo';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openCart, totalItems } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Men's Collection", href: '/men' },
    { label: "Women's Collection", href: '/women' },
    { label: 'All Timepieces', href: '/collections' },
    { label: 'Track Order', href: '/track' },
    { label: 'Help Center', href: '/help' },
    { label: 'Seller & Earn', href: '/account/seller', highlight: true },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#0b0c10] via-amber-950/40 to-[#0b0c10] border-b border-amber-500/20 text-amber-200/90 text-[10px] sm:text-xs py-2 px-3 sm:px-4 text-center font-medium tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 max-w-full overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
        <span className="truncate">ELEVATE YOUR STYLE • FREE DELIVERY OVER RS. 5,000 • COD & EASYPAISA</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full max-w-full ${
          isScrolled
            ? 'bg-[#0b0c10]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-xl shadow-black/40'
            : 'bg-[#0b0c10]/80 backdrop-blur-sm border-b border-zinc-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile menu button */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-zinc-300 hover:text-amber-400 transition-colors focus:outline-none"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <BlackoraLogo showTagline />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium tracking-wider uppercase transition-all duration-200 relative py-1 ${
                      link.highlight
                        ? 'text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30'
                        : isActive
                        ? 'text-amber-400'
                        : 'text-zinc-300 hover:text-amber-400'
                    }`}
                  >
                    {link.highlight && <TrendingUp className="w-3.5 h-3.5 text-amber-400" />}
                    {link.label}
                    {isActive && !link.highlight && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-zinc-300 hover:text-amber-400 transition-colors rounded-full hover:bg-zinc-800/50"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Admin Panel Link (if logged in as admin) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 text-xs bg-amber-500 text-black px-3 py-1.5 rounded-lg font-bold hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </Link>
              )}

              {/* User Account / Login */}
              {user ? (
                <div className="relative group">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-sm text-zinc-200 hover:text-amber-400 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-bold text-xs shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline font-medium text-xs max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-[#12141a] border border-zinc-800 rounded-xl shadow-2xl p-2 hidden group-hover:block transition-all duration-200">
                    <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                      {user.isSeller && (
                        <span className="inline-block mt-1 text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                          SELLER ACTIVE
                        </span>
                      )}
                    </div>
                    <Link
                      href="/account"
                      className="block px-3 py-2 text-xs text-zinc-300 hover:text-amber-400 hover:bg-zinc-850 rounded-lg transition-colors"
                    >
                      My Orders & Account
                    </Link>
                    <Link
                      href="/account/seller"
                      className="block px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors font-medium"
                    >
                      Seller Portal & Wallet
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-xs text-zinc-300 hover:text-amber-400 hover:bg-zinc-850 rounded-lg transition-colors"
                      >
                        Admin Control Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="p-2 text-zinc-300 hover:text-amber-400 transition-colors rounded-full hover:bg-zinc-800/50 flex items-center gap-1.5"
                  aria-label="Account Login"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">Login</span>
                </Link>
              )}

              {/* Shopping Bag Button */}
              <button
                onClick={openCart}
                className="relative p-2.5 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl text-amber-300 hover:text-amber-200 hover:border-amber-400 transition-all duration-200 flex items-center gap-2 shadow-sm shadow-amber-950/20"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">{totalItems}</span>
              </button>
            </div>
          </div>

          {/* Quick Search Bar Drawer */}
          {isSearchOpen && (
            <div className="pb-4 pt-2 border-t border-zinc-800/60 animate-in fade-in slide-in-from-top-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
                    setIsSearchOpen(false);
                  }
                }}
                className="relative max-w-2xl mx-auto"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search luxury watches, chronograph, skeleton, emerald..."
                  className="w-full bg-[#14161f] border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 pl-11 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                  autoFocus
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-4" />
                <button
                  type="submit"
                  className="absolute right-2.5 top-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0e1017] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider ${
                  link.highlight
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-amber-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-2.5 rounded-lg text-sm font-bold bg-amber-500 text-black uppercase tracking-wider"
              >
                Admin Control Center
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
