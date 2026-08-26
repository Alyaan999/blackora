'use client';

import React, { useState, useEffect } from 'react';
import { StoreSettings } from '@/lib/types';
import { useToast } from '@/lib/toast-context';
import {
  Settings,
  Truck,
  Smartphone,
  Lock,
  Save,
  CheckCircle2,
  Shield,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { toast, success } = useToast();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [deliveryFee, setDeliveryFee] = useState('250');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('5000');
  const [defaultReferralReward, setDefaultReferralReward] = useState('200');

  const [easyPaisaAccountTitle, setEasyPaisaAccountTitle] = useState('');
  const [easyPaisaAccountNumber, setEasyPaisaAccountNumber] = useState('');

  const [jazzCashAccountTitle, setJazzCashAccountTitle] = useState('');
  const [jazzCashAccountNumber, setJazzCashAccountNumber] = useState('');

  const [supportPhone, setSupportPhone] = useState('');
  const [supportWhatsapp, setSupportWhatsapp] = useState('');

  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  useEffect(() => {
    fetch('/api/settings?admin=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          const s = data.settings;
          setSettings(s);
          setDeliveryFee(String(s.deliveryFee || 250));
          setFreeDeliveryThreshold(String(s.freeDeliveryThreshold || 5000));
          setDefaultReferralReward(String(s.defaultReferralReward || 200));

          setEasyPaisaAccountTitle(s.easyPaisaAccountTitle || '');
          setEasyPaisaAccountNumber(s.easyPaisaAccountNumber || '');

          setJazzCashAccountTitle(s.jazzCashAccountTitle || '');
          setJazzCashAccountNumber(s.jazzCashAccountNumber || '');

          setSupportPhone(s.supportPhone || '');
          setSupportWhatsapp(s.supportWhatsapp || '');

          setAdminUsername(s.adminUsername || 'admin');
          setAdminPassword(s.adminPassword || 'admin123');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Partial<StoreSettings> = {
      deliveryFee: Number(deliveryFee),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      defaultReferralReward: Number(defaultReferralReward),
      easyPaisaAccountTitle,
      easyPaisaAccountNumber,
      jazzCashAccountTitle,
      jazzCashAccountNumber,
      supportPhone,
      supportWhatsapp,
      adminUsername,
      adminPassword,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.settings) {
        success('Store settings & credentials updated successfully!');
      } else {
        toast('Failed to save settings', 'error');
      }
    } catch (e) {
      toast('Network error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>Store Settings & Configuration</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure delivery charges, EasyPaisa/JazzCash account details, default referral commission, and Admin login password.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8 text-xs">
        {/* 1. Delivery & Shipping Settings */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
          <h2 className="font-serif text-base font-bold text-zinc-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Delivery Charges & Free Shipping</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                Standard Delivery Fee (Rs.) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 font-serif font-bold text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">Charged on checkout for standard delivery</span>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                Free Delivery Above (Rs.) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 font-serif font-bold text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">Orders higher than this get 0 delivery fee</span>
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                Fallback Referral Reward (Rs.) *
              </label>
              <input
                type="number"
                required
                min={50}
                value={defaultReferralReward}
                onChange={(e) => setDefaultReferralReward(e.target.value)}
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 font-serif font-bold text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">Default profit if not set on product</span>
            </div>
          </div>
        </div>

        {/* 2. Payment Receiving Numbers (EasyPaisa & JazzCash) */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
          <h2 className="font-serif text-base font-bold text-zinc-100 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <span>EasyPaisa & JazzCash Receiving Numbers</span>
          </h2>
          <p className="text-zinc-400 text-xs">
            These numbers and titles are displayed to customers on checkout when they select EasyPaisa or JazzCash.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* EasyPaisa Box */}
            <div className="bg-[#181a24] p-5 rounded-2xl border border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                EasyPaisa Receiving Account
              </span>
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  Account Title:
                </label>
                <input
                  type="text"
                  value={easyPaisaAccountTitle}
                  onChange={(e) => setEasyPaisaAccountTitle(e.target.value)}
                  placeholder="Blackora Official"
                  className="w-full bg-[#12141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  EasyPaisa Mobile Number:
                </label>
                <input
                  type="text"
                  value={easyPaisaAccountNumber}
                  onChange={(e) => setEasyPaisaAccountNumber(e.target.value)}
                  placeholder="03001234567"
                  className="w-full bg-[#12141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* JazzCash Box */}
            <div className="bg-[#181a24] p-5 rounded-2xl border border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                JazzCash Receiving Account
              </span>
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  Account Title:
                </label>
                <input
                  type="text"
                  value={jazzCashAccountTitle}
                  onChange={(e) => setJazzCashAccountTitle(e.target.value)}
                  placeholder="Blackora Luxury"
                  className="w-full bg-[#12141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  JazzCash Mobile Number:
                </label>
                <input
                  type="text"
                  value={jazzCashAccountNumber}
                  onChange={(e) => setJazzCashAccountNumber(e.target.value)}
                  placeholder="03009876543"
                  className="w-full bg-[#12141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 font-mono focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Admin Credentials Manager */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
          <h2 className="font-serif text-base font-bold text-zinc-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>Admin Authentication Credentials</span>
          </h2>
          <p className="text-zinc-400 text-xs">
            Change your admin portal login username and password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                Admin Username *
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-300 block mb-1 uppercase tracking-wider">
                Admin Password *
              </label>
              <input
                type="text"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
