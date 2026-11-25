import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  Truck,
  ShieldCheck,
  UserCheck,
  MapPin,
} from 'lucide-react';
import { TrackingOrder, formatIDR } from '../data/goldData';

interface OrderTrackerProps {
  ordersMap: Record<string, TrackingOrder>;
  highlightedOrderId?: string | null;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  ordersMap,
  highlightedOrderId,
}) => {
  const defaultId = Object.keys(ordersMap)[0] ?? 'NJ-2611-8902';
  const [query, setQuery] = useState(defaultId);
  const [activeOrderId, setActiveOrderId] = useState(defaultId);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (highlightedOrderId && ordersMap[highlightedOrderId]) {
      setQuery(highlightedOrderId);
      setActiveOrderId(highlightedOrderId);
      setNotFound(false);
    }
  }, [highlightedOrderId, ordersMap]);

  const order = ordersMap[activeOrderId];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = query.trim().toUpperCase();
    if (ordersMap[cleaned]) {
      setActiveOrderId(cleaned);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
  };

  const quickOrderIds = Object.keys(ordersMap);

  return (
    <section
      id="lacak"
      className="py-16 sm:py-20 lg:py-24 bg-marble-luxury border-b border-[#EAD3CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Intro & Search */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
                Transparansi Real-Time NJ
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3D2C2C] mt-2 leading-[1.12]">
                Lacak Status{' '}
                <span className="italic text-gold-foil">Titipan Emas Anda</span>
              </h2>
              <p className="text-sm sm:text-base text-[#7A5C5C] mt-3 leading-relaxed">
                Pantau setiap progres titipan Anda — mulai dari konfirmasi harga harian, pembelian
                di gerai resmi, dokumentasi surat &amp; timbangan, hingga jadwal COD, ambil di
                rumah Mbak Jannah, atau resi ekspedisi.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A5C5C] block">
                Masukkan Nomor Order NJ
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setNotFound(false);
                    }}
                    placeholder="Contoh: NJ-2611-8902"
                    className="w-full min-h-[46px] pl-10 pr-4 rounded-2xl bg-[#FFF9F7] border border-[#DFC0B6] font-mono text-sm text-[#3D2C2C] focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 min-h-[46px] rounded-2xl btn-gold text-sm font-bold transition-all cursor-pointer"
                >
                  Lacak
                </button>
              </div>
              {notFound && (
                <p className="text-xs text-[#8C2B39] bg-[#FDEEEF] border border-[#EBC0C7] rounded-2xl px-4 py-2.5">
                  Nomor order <strong>{query}</strong> tidak ditemukan. Silakan pilih contoh
                  order aktif di bawah ini.
                </p>
              )}
            </form>

            {/* Quick Order Chips */}
            <div className="p-4 rounded-3xl bg-[#F9EDEA] border border-[#E8CEC7] space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C4A55]">
                Coba Lacak Order Aktif / Demo:
              </div>
              <div className="flex flex-wrap gap-2">
                {quickOrderIds.map((id) => {
                  const item = ordersMap[id];
                  const active = id === activeOrderId && !notFound;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setQuery(id);
                        setActiveOrderId(id);
                        setNotFound(false);
                      }}
                      className={`px-3.5 min-h-[38px] rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-[#B76E79] text-[#FFF9F7] shadow-sm'
                          : 'bg-[#FFF9F7] text-[#5E4545] border border-[#E5C6BE] hover:border-[#C9A227]'
                      }`}
                    >
                      {id} ({item.brandLabel})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Order Dossier Card */}
          <div className="lg:col-span-7 w-full">
            {order && (
              <div className="rounded-3xl bg-[#FFF9F7] border border-[#E6C7C0] shadow-[0_14px_40px_rgba(183,110,121,0.1)] overflow-hidden">
                {/* Blush Silk Header */}
                <div className="bg-blush-silk text-[#3D2C2C] p-5 sm:p-6 border-b border-[#E5C4BB] flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#FFF9F7] text-[#8C4A55] border border-[#D4AF37]/50">
                        {order.orderId}
                      </span>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#B76E79] text-[#FFF9F7]">
                        {order.brandLabel}
                      </span>
                    </div>
                    <h3 className="font-editorial text-xl sm:text-2xl font-bold mt-2.5 text-[#3D2C2C] break-words">
                      {order.itemsSummary}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6E5050] mt-2">
                      <span className="inline-flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#B76E79]" />
                        {order.customerName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B76E79]" />
                        {order.city}
                      </span>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-[#7A5C5C] font-bold">
                      Nilai Transaksi
                    </div>
                    <div className="font-mono text-lg sm:text-xl font-bold text-[#3D2C2C] tabular-nums">
                      {formatIDR(order.totalValue)}
                    </div>
                  </div>
                </div>

                {/* Metadata Verification Strip */}
                <div className="grid sm:grid-cols-2 gap-3.5 p-5 bg-[#FDF6F4] border-b border-[#F1DFDA] text-xs">
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-[#7A5C5C]">Sumber &amp; No. Nota Resmi</div>
                      <div className="font-bold text-[#3D2C2C] break-words">
                        {order.branchSource}
                      </div>
                      <div className="font-mono text-[11px] text-[#9C7418] mt-0.5 break-all">
                        {order.receiptNo}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-[#7A5C5C]">Pengambilan / Pengiriman</div>
                      <div className="font-bold text-[#3D2C2C] break-words">
                        {order.courierName}
                      </div>
                      <div className="font-mono text-[11px] text-[#8C4A55] mt-0.5 break-all">
                        {order.resiNumber} • {order.insurancePolicy}
                      </div>
                    </div>
                  </div>

                  {order.certiCode && (
                    <div className="sm:col-span-2 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#F9EDEA] border border-[#D4AF37]/45 text-[#3D2C2C]">
                      <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0" />
                      <span className="break-all">
                        <strong>CertiEye Verified:</strong>{' '}
                        <span className="font-mono text-[#8C4A55]">{order.certiCode}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* 5-Stage Timeline */}
                <div className="p-5 sm:p-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#7A5C5C] mb-5">
                    Progres Eksekusi ({order.runnerName})
                  </div>
                  <ol className="space-y-5">
                    {order.steps.map((step, idx) => {
                      const isCurrent = idx === order.currentStep;
                      return (
                        <li key={step.title} className="relative pl-8">
                          {idx < order.steps.length - 1 && (
                            <span
                              className={`absolute left-[11px] top-6 bottom-[-22px] w-[2px] ${
                                step.completed ? 'bg-[#C9A227]' : 'bg-[#EFE0DB]'
                              }`}
                            />
                          )}
                          <span
                            className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ${
                              step.completed
                                ? 'bg-[#B76E79] text-[#FFF9F7]'
                                : 'bg-[#F9EDEA] border border-[#E3C1B7] text-[#A28181]'
                            } ${isCurrent ? 'ring-4 ring-[#D4AF37]/30' : ''}`}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                          </span>

                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                step.completed ? 'text-[#3D2C2C]' : 'text-[#9B7E7E]'
                              }`}
                            >
                              {step.title}
                            </h4>
                            <span className="font-mono text-[11px] text-[#9C7418] font-medium">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-[#7A5C5C] mt-1 leading-relaxed">
                            {step.detail}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
