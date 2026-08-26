import React from 'react';
import { ShieldCheck, Truck, Zap, CreditCard } from 'lucide-react';

export function FeatureBadges() {
  const features = [
    {
      icon: ShieldCheck,
      title: '100% Genuine Craftsmanship',
      desc: 'Surgical stainless steel & sapphire glass',
    },
    {
      icon: Truck,
      title: 'Free Delivery Over Rs. 5,000',
      desc: 'Nationwide 4-7 days express tracked shipping',
    },
    {
      icon: Zap,
      title: 'Seller Affiliate Program',
      desc: 'Earn Rs. 200+ profit per referred delivery',
    },
    {
      icon: CreditCard,
      title: 'COD & EasyPaisa / JazzCash',
      desc: 'Convenient verified local payment options',
    },
  ];

  return (
    <section className="py-8 bg-[#0d0f15] border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#141620] border border-zinc-800/80 hover:border-amber-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-100 tracking-wide uppercase">{f.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
