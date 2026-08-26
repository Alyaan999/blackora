'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Eye,
} from 'lucide-react';

export default function AdminProductsPage() {
  const { toast, success } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'men' | 'women' | 'unisex'>('men');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('20');
  const [commissionAmount, setCommissionAmount] = useState('200'); // Custom profit for affiliate per sale (hidden from public)
  const [imageUrl, setImageUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [caseDiameter, setCaseDiameter] = useState('42 mm');
  const [movement, setMovement] = useState('Japanese Quartz');
  const [strapMaterial, setStrapMaterial] = useState('Solid Stainless Steel');
  const [waterResistance, setWaterResistance] = useState('5 ATM (50 Meters)');
  const [glassType, setGlassType] = useState('Sapphire Crystal');
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = () => {
    fetch('/api/products?admin=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('men');
    setPrice('');
    setOriginalPrice('');
    setStock('25');
    setCommissionAmount('250');
    setImageUrl('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop');
    setTagline('');
    setDescription('');
    setCaseDiameter('42 mm');
    setMovement('Japanese Quartz Chronograph');
    setStrapMaterial('316L Solid Stainless Steel');
    setWaterResistance('5 ATM (50 Meters)');
    setGlassType('Scratch-Resistant Sapphire Crystal');
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category as any);
    setPrice(String(p.price));
    setOriginalPrice(p.originalPrice ? String(p.originalPrice) : '');
    setStock(String(p.stock || 0));
    setCommissionAmount(String(p.commissionAmount || 200));
    setImageUrl(p.images[0] || '');
    setTagline(p.tagline || '');
    setDescription(p.description || '');
    setCaseDiameter(p.specs?.caseDiameter || '42 mm');
    setMovement(p.specs?.movement || 'Japanese Quartz');
    setStrapMaterial(p.specs?.strapMaterial || 'Stainless Steel');
    setWaterResistance(p.specs?.waterResistance || '3 ATM');
    setGlassType(p.specs?.glassType || 'Mineral Crystal');
    setIsAddModalOpen(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !imageUrl.trim()) {
      toast('Please fill all required watch details and add an image', 'error');
      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock || 0),
      commissionAmount: Number(commissionAmount || 200),
      images: [imageUrl.trim()],
      tagline: tagline.trim(),
      description: description.trim(),
      specs: {
        caseDiameter,
        movement,
        strapMaterial,
        waterResistance,
        glassType,
      },
    };

    try {
      if (editingProduct) {
        // Update product
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          success('Watch updated successfully!');
          setIsAddModalOpen(false);
          fetchProducts();
        } else {
          toast('Failed to update product', 'error');
        }
      } else {
        // Create new product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          success('New watch added to catalog!');
          setIsAddModalOpen(false);
          fetchProducts();
        } else {
          toast('Failed to add product', 'error');
        }
      }
    } catch (e) {
      toast('Network error occurred', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, pName: string) => {
    if (!confirm(`Are you sure you want to delete "${pName}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        success('Product deleted');
        fetchProducts();
      } else {
        toast('Failed to delete product', 'error');
      }
    } catch (e) {
      toast('Error deleting product', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            <span>Product Inventory & Stock</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your luxury catalog, stock quantities, Cloudinary images, and hidden affiliate commission margins per item.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Timepiece</span>
        </button>
      </div>

      {/* Secret Commission Note */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200/90 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Admin-Only Profit Settings:</strong> The "Affiliate Profit / Commission" amount configured on each watch is strictly hidden from public customers. When an affiliate’s referral order is delivered, this exact commission amount is credited into their wallet!
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#12141c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-500 animate-pulse">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">No products found. Add one above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#181a24] border-b border-zinc-800 text-[11px] text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Watch</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price (Sale)</th>
                  <th className="p-4 font-semibold">Stock Inventory</th>
                  <th className="p-4 font-semibold">Referral Commission</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-xl bg-black/40 border border-zinc-800 shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-zinc-100 line-clamp-1">{prod.name}</h4>
                          <span className="text-[10px] text-zinc-500">{prod.specs?.movement || 'Quartz'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="uppercase text-[10px] font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-300">
                        {prod.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-serif font-bold text-amber-400 text-sm">
                        {formatPrice(prod.price)}
                      </div>
                      {prod.originalPrice && (
                        <div className="text-[10px] text-zinc-500 line-through">
                          {formatPrice(prod.originalPrice)}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-mono font-bold text-xs px-2 py-1 rounded ${
                          (prod.stock || 0) < 10
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {prod.stock || 0} Units
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-serif font-bold text-emerald-400 text-sm">
                        {formatPrice(prod.commissionAmount || 200)}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">per sale reward</span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-2 bg-zinc-800 hover:bg-amber-500 hover:text-black rounded-lg transition-colors text-zinc-300"
                          title="Edit Watch & Stock"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-2 bg-zinc-800 hover:bg-rose-600 hover:text-white rounded-lg transition-colors text-zinc-400"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12141c] border border-zinc-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-serif text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <span>{editingProduct ? 'Edit Watch & Inventory' : 'Add New Timepiece'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Watch Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Blackora Royal Chronograph Matte Gold"
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="men">Men's Collection</option>
                    <option value="women">Women's Collection</option>
                    <option value="unisex">Unisex Executive</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Selling Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="4999"
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400 font-serif font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Original / Crossed Price (Rs.) (Optional)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="7999"
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Stock Inventory (Units) * (Hidden from public)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2 bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30">
                  <label className="font-bold text-amber-300 block mb-1 uppercase tracking-wider">
                    Affiliate Commission Profit (Rs.) * (Hidden from public)
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    placeholder="250"
                    className="w-full bg-[#12141c] border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-amber-200 font-serif font-bold text-sm focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    When someone buys this watch with an affiliate code, the referrer earns this exact profit upon delivery.
                  </span>
                </div>

                {/* Cloudinary Image Uploader */}
                <div className="sm:col-span-2">
                  <ImageUploader value={imageUrl} onChange={setImageUrl} />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Precision dual-dial chronograph with obsidian black accents"
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Engineered for distinction..."
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Specs */}
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Case Diameter
                  </label>
                  <input
                    type="text"
                    value={caseDiameter}
                    onChange={(e) => setCaseDiameter(e.target.value)}
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2 text-zinc-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                    Movement Type
                  </label>
                  <input
                    type="text"
                    value={movement}
                    onChange={(e) => setMovement(e.target.value)}
                    className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2 text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
