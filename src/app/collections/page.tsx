'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Sparkles, Filter, Search } from 'lucide-react';

function CollectionsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'All Luxury Watches & Collections | Blackora Pakistan';
    }
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // default / featured
  });

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Complete Catalogue</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-zinc-100">
            Blackora Haute Horlogerie
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Select your statement timepiece. Every watch is crafted for timeless precision with express delivery across Pakistan.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#12141c] border border-zinc-800 rounded-2xl p-4 sm:p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Watches' },
              { id: 'men', label: "Men's Collection" },
              { id: 'women', label: "Women's Collection" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search watches..."
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3 py-2 pl-9 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181a24] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-zinc-900/60 rounded-2xl animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#12141c] rounded-3xl border border-zinc-800">
            <p className="text-sm font-serif text-zinc-300">No timepieces match your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearch('');
              }}
              className="mt-3 text-xs text-amber-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
        </div>
      }
    >
      <CollectionsContent />
    </Suspense>
  );
}
