import React, { useState, useMemo } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Copy,
  MessageCircle,
  ArrowRight,
  Search,
  MapPin,
  Info,
  Handshake,
  Home,
  Truck,
  History,
} from 'lucide-react';
import {
  GoldProduct,
  SHIPPING_OPTIONS,
  TrackingOrder,
  Order,
  OrderMethod,
  BRAND_INFO,
  getWhatsAppUrl,
  getBrandVisualStyle,
  formatProductPrice,
  formatIDR,
} from '../data/goldData';
import { ORDER_LOG_URL, ORDERS_STORAGE_KEY } from '../config';

export interface CartItem {
  product: GoldProduct;
  quantity: number;
  customNote?: string;
}

interface CartAndCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  savedOrders: Order[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderCreated: (newTrackingOrder: TrackingOrder, standardOrder: Order) => void;
  onJumpToTracker: (orderId: string) => void;
}

export const CartAndCheckout: React.FC<CartAndCheckoutProps> = ({
  isOpen,
  onClose,
  items,
  savedOrders,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
  onJumpToTracker,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'success'>('bag');
  const [method, setMethod] = useState<OrderMethod>('COD');
  const [courierId, setCourierId] = useState<'jne-gold' | 'paxel-insured'>('jne-gold');

  // Streamlined No-Login Checkout Form (HANYA field yang diminta!)
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [jadwal, setJadwal] = useState('');
  const [notes, setNotes] = useState('');

  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    total: number;
    waMessage: string;
    waUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const activeShipping = useMemo(() => {
    if (method === 'COD') {
      return SHIPPING_OPTIONS.find((s) => s.id === 'cod') ?? SHIPPING_OPTIONS[0];
    }
    if (method === 'Ambil di Rumah') {
      return SHIPPING_OPTIONS.find((s) => s.id === 'ambil-rumah') ?? SHIPPING_OPTIONS[1];
    }
    return SHIPPING_OPTIONS.find((s) => s.id === courierId) ?? SHIPPING_OPTIONS[2];
  }, [method, courierId]);

  const totals = useMemo(() => {
    const hasTanyaWaItems = items.some((i) => i.product.basePrice === null);
    const hasRangePriceItems = items.some(
      (i) =>
        i.product.basePrice !== null &&
        Boolean(i.product.priceMax && i.product.priceMax > i.product.basePrice)
    );
    const subtotalGold = items.reduce(
      (sum, item) => sum + (item.product.basePrice ?? 0) * item.quantity,
      0
    );
    const totalFee = items.reduce(
      (sum, item) => sum + item.product.jastipFee * item.quantity,
      0
    );
    const totalWeight = items.reduce(
      (sum, item) => sum + item.product.weightGrams * item.quantity,
      0
    );
    const shippingFee =
      items.length > 0 && method === 'Kirim'
        ? activeShipping.baseCost + activeShipping.woodenCrateFee
        : 0;
    const insuranceCost =
      items.length > 0 && method === 'Kirim'
        ? Math.round(subtotalGold * activeShipping.insuranceRate)
        : 0;
    const grandTotal = subtotalGold + totalFee + shippingFee + insuranceCost;

    return {
      hasTanyaWaItems,
      hasRangePriceItems,
      subtotalGold,
      totalFee,
      totalWeight: Number(totalWeight.toFixed(2)),
      shippingFee,
      insuranceCost,
      grandTotal,
    };
  }, [items, method, activeShipping]);

  if (!isOpen) return null;

  const isCodOrHome = method === 'COD' || method === 'Ambil di Rumah';

  const handleClose = () => {
    if (step === 'success') {
      setStep('bag');
    }
    onClose();
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const randCode = Math.floor(1000 + Math.random() * 9000);
    const orderId = `NJ-2611-${randCode}`;
    const nowIso = new Date().toISOString();
    const firstItem = items[0];
    const primaryBrand = firstItem?.product.brand ?? 'SEMAR_NUSANTARA';
    const primaryBrandLabel = firstItem?.product.brandLabel ?? 'Semar Nusantara';

    const metodeDisplay =
      method === 'Kirim'
        ? `Kirim via Ekspedisi (${activeShipping.courier})`
        : method;

    // Exact requested WhatsApp order message format with explicit Brand label
    const itemLines = items.map((i) => {
      const karatText =
        i.product.karat ??
        (i.product.purity.includes('10K')
          ? '10K'
          : i.product.purity.includes('17K')
          ? '17K'
          : '24K');
      const weightText = i.product.weightDisplay ?? `${i.product.weightGrams} gram`;
      const isRange =
        i.product.basePrice !== null &&
        Boolean(i.product.priceMax && i.product.priceMax > i.product.basePrice);
      const linePrice =
        i.product.basePrice === null
          ? 'Tanya WA'
          : isRange
          ? `Mulai ${formatIDR(i.product.basePrice * i.quantity)} (estimasi rentang ${formatProductPrice(i.product)})`
          : formatIDR(i.product.basePrice * i.quantity);
      const notePart = i.customNote ? ` (${i.customNote})` : '';
      return `- Brand: ${i.product.brandLabel} | ${i.product.name} (${karatText} • ${weightText}) x${i.quantity} — ${linePrice}${notePart}`;
    });

    const waLines = [
      `Halo NJ, saya mau order:`,
      ...itemLines,
      `Fee jastip: ${formatIDR(totals.totalFee)}`,
      method === 'Kirim'
        ? `Ongkir & Packing Kayu: ${formatIDR(totals.shippingFee)}`
        : null,
      method === 'Kirim' && totals.insuranceCost > 0
        ? `Asuransi 100%: ${formatIDR(totals.insuranceCost)}`
        : null,
      `Total${totals.hasRangePriceItems ? ' (Estimasi Mulai)' : ''}: ${formatIDR(totals.grandTotal)}${
        totals.hasTanyaWaItems ? ' (+ harga item Tanya WA sesuai nota)' : ''
      }`,
      totals.hasRangePriceItems
        ? `Catatan Harga: Harga final mengikuti berat riil di nota resmi toko.`
        : null,
      `Nama: ${fullName.trim()}`,
      `WA: ${whatsapp.trim()}`,
      `Metode: ${metodeDisplay}`,
      method === 'Kirim' ? `Alamat: ${address.trim()}` : null,
      isCodOrHome && jadwal.trim() ? `Jadwal: ${jadwal.trim()}` : null,
      notes.trim() ? `Catatan: ${notes.trim()}` : null,
    ].filter(Boolean);

    const waMessage = waLines.join('\n');
    const waUrl = getWhatsAppUrl(waMessage);

    // Standard Order Object saved to localStorage ('nj_orders')
    const standardOrder: Order = {
      id: orderId,
      tanggal: nowIso,
      nama: fullName.trim(),
      waPelanggan: whatsapp.trim(),
      metode: method,
      ...(method === 'Kirim' ? { alamat: address.trim() } : {}),
      ...(isCodOrHome && jadwal.trim() ? { jadwal: jadwal.trim() } : {}),
      items: items.map((i) => ({
        brand: i.product.brandLabel,
        produk: i.product.name,
        gram: i.product.weightGrams,
        qty: i.quantity,
        harga: i.product.basePrice ?? 0,
      })),
      feeJastip: totals.totalFee,
      total: totals.grandTotal,
      ...(notes.trim() ? { catatan: notes.trim() } : {}),
    };

    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      const existing: Order[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify([standardOrder, ...existing].slice(0, 50))
      );
    } catch {
      // Ignore storage quota / private mode errors safely
    }

    // Optional future webhook / Google Sheet log (non-blocking, never breaks checkout)
    if (ORDER_LOG_URL) {
      fetch(ORDER_LOG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(standardOrder),
      }).catch(() => {});
    }

    const itemsListStr = items
      .map((i) => `${i.quantity}× ${i.product.name}`)
      .join(' + ');

    const newTrackingOrder: TrackingOrder = {
      orderId,
      customerName: fullName.trim(),
      city:
        method === 'Ambil di Rumah'
          ? 'Sragen, Jawa Tengah (Ambil di Rumah)'
          : method === 'COD'
          ? 'COD (Konfirmasi Lokasi via WA)'
          : address.trim().slice(0, 48),
      brand: primaryBrand,
      brandLabel: primaryBrandLabel,
      transactionType: 'Beli',
      itemsSummary: itemsListStr,
      totalValue: totals.grandTotal,
      branchSource: `Gerai Resmi ${primaryBrandLabel}`,
      runnerName: `Tim NJ (${BRAND_INFO.locationPinName})`,
      receiptNo: `ORDER WA (${orderId})`,
      courierName: activeShipping.name,
      resiNumber: isCodOrHome
        ? jadwal.trim() || 'Konfirmasi Jadwal via WA NJ'
        : 'Menunggu Konfirmasi & Packing Kayu',
      insurancePolicy: isCodOrHome ? 'SERAH TERIMA LANGSUNG' : `DRAFT-POL-${randCode}`,
      currentStep: 0,
      steps: [
        {
          title: 'Order Disiapkan & Dikirim ke WhatsApp NJ',
          timestamp: 'Baru saja',
          detail: `Order ${orderId} (${totals.totalWeight}g) telah disiapkan untuk konfirmasi bersama NJ (${BRAND_INFO.whatsappDisplay}).`,
          completed: true,
        },
        {
          title: 'Konfirmasi Stok & Pembelian di Gerai Resmi',
          timestamp: 'Menunggu Konfirmasi WA',
          detail:
            'Tim NJ membelikan langsung di gerai resmi dan mengirimkan foto nota asli serta fisik emas.',
          completed: false,
        },
        {
          title: 'Verifikasi Fisik & Foto Nota Resmi',
          timestamp: 'Tahap Berikutnya',
          detail: 'Dokumentasi HD emas dan surat resmi dikirimkan ke WA Anda.',
          completed: false,
        },
        {
          title: isCodOrHome
            ? 'Jadwal COD / Ambil di Rumah Mbak Jannah'
            : 'Packing Kayu & Pengiriman Berasuransi 100%',
          timestamp: 'Tahap Berikutnya',
          detail: isCodOrHome
            ? 'Tanpa ongkir! Konfirmasi jadwal & lokasi via WA NJ sebelum ketemuan.'
            : `Dikirim via ${activeShipping.name}.`,
          completed: false,
        },
        {
          title: 'Serah Terima & Selesai',
          timestamp: 'Segera',
          detail: isCodOrHome
            ? 'Cek fisik emas & surat resmi secara langsung.'
            : 'Rekam video unboxing tanpa jeda saat paket tiba.',
          completed: false,
        },
      ],
    };

    onOrderCreated(newTrackingOrder, standardOrder);
    setConfirmedOrder({
      orderId,
      total: totals.grandTotal,
      waMessage,
      waUrl,
    });
    onClearCart();
    setStep('success');

    // Automatically open WhatsApp with the formatted order message
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    if (!confirmedOrder) return;
    navigator.clipboard.writeText(confirmedOrder.waMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#3D2C2C]/55 backdrop-blur-sm flex justify-end"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFF9F7] h-full flex flex-col shadow-2xl border-l border-[#E5C4BB]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-5 bg-blush-silk text-[#3D2C2C] flex items-center justify-between border-b border-[#E5C4BB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF9F7] border border-[#D4AF37]/60 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-[#B76E79]" />
            </div>
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold">
                {step === 'bag'
                  ? 'Keranjang Titipan NJ'
                  : step === 'checkout'
                  ? 'Checkout Cepat via WA'
                  : 'Order Siap di WhatsApp'}
              </h3>
              <p className="text-[11px] text-[#7A5C5C]">
                {step === 'success'
                  ? 'Tersimpan otomatis di riwayat browser Anda'
                  : `Tanpa daftar akun • ${items.reduce((s, i) => s + i.quantity, 0)} item (${totals.totalWeight}g)`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Tutup keranjang"
            className="w-10 h-10 rounded-full bg-[#FFF9F7]/80 text-[#3D2C2C] flex items-center justify-center hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {step === 'bag' && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-10 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#F9EDEA] border border-[#E5C4BB] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7 text-[#B76E79]" />
                  </div>
                  <div>
                    <h4 className="font-editorial text-2xl font-bold text-[#3D2C2C]">
                      Keranjang Titipan Masih Kosong
                    </h4>
                    <p className="text-xs sm:text-sm text-[#7A5C5C] mt-1 max-w-xs mx-auto">
                      Pilih produk Ready Stock dari katalog — keranjang otomatis tersimpan di HP
                      / browser Anda tanpa perlu login.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="px-6 min-h-[46px] rounded-full btn-gold text-xs font-bold cursor-pointer"
                  >
                    Jelajahi Katalog Sekarang
                  </button>

                  {savedOrders.length > 0 && (
                    <div className="mt-6 text-left p-4 rounded-2xl bg-[#F9EDEA] border border-[#E5C4BB] space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C4A55]">
                        <History className="w-4 h-4 text-[#C9A227]" />
                        Riwayat Order Terakhir Anda ({savedOrders.length})
                      </div>
                      {savedOrders.slice(0, 3).map((ord) => (
                        <div
                          key={ord.id}
                          className="p-3 rounded-xl bg-[#FFF9F7] border border-[#ECD5CE] flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="font-mono font-bold text-[#3D2C2C]">{ord.id}</div>
                            <div className="text-[11px] text-[#7A5C5C] truncate">
                              {ord.metode} • {formatIDR(ord.total)}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              onClose();
                              onJumpToTracker(ord.id);
                            }}
                            className="px-3 min-h-[36px] rounded-full bg-[#F9EDEA] text-[#8C4A55] font-bold text-[11px] shrink-0 cursor-pointer"
                          >
                            Lacak
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {items.map(({ product, quantity, customNote }) => {
                      const brandStyle = getBrandVisualStyle(product.brand);
                      const isRange =
                        product.basePrice !== null &&
                        Boolean(product.priceMax && product.priceMax > product.basePrice);
                      const weightText = product.weightDisplay ?? `${product.weightGrams}g`;
                      return (
                        <div
                          key={product.id}
                          className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#E8CEC7] flex gap-3 shadow-sm"
                        >
                          <img
                            src={product.imageFallback ?? product.image}
                            alt={product.name}
                            className="w-16 h-16 aspect-square rounded-xl object-cover shrink-0 bg-[#F9EDEA] border border-[#EDD5CE]"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wide ${brandStyle.softTag}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${brandStyle.accentDot}`}
                                    />
                                    {brandStyle.shortUpper}
                                  </span>
                                  <span className="text-[10.5px] font-semibold text-[#7A5C5C]">
                                    {product.karat ?? '24K'} • {weightText}
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-[#3D2C2C] leading-snug break-words">
                                  {product.name}
                                </h4>
                              </div>
                              <button
                                onClick={() => onRemoveItem(product.id)}
                                aria-label="Hapus item"
                                className="text-[#9E7F7F] hover:text-[#B76E79] p-1.5 cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {customNote && (
                              <p className="text-[11px] text-[#8C4A55] bg-[#F9EDEA] px-2.5 py-1 rounded-lg mt-1.5 break-words">
                                {customNote}
                              </p>
                            )}

                            <div className="mt-2.5 flex items-center justify-between gap-2">
                              <div className="text-xs">
                                <div className="font-mono font-bold text-[#3D2C2C]">
                                  {product.basePrice === null
                                    ? 'Harga Tanya WA'
                                    : isRange
                                    ? `Mulai ${formatIDR(product.basePrice * quantity)}`
                                    : formatIDR(product.basePrice * quantity)}
                                </div>
                                {isRange && (
                                  <div className="text-[10px] text-[#7A5C5C]">
                                    Rentang: {formatProductPrice(product)}
                                  </div>
                                )}
                                <div className="font-mono text-[11px] text-[#9C7418]">
                                  +Fee {formatIDR(product.jastipFee * quantity)}
                                </div>
                              </div>
                              <div className="inline-flex items-center rounded-full border border-[#E5C4BB] bg-[#F9EDEA]">
                                <button
                                  onClick={() => onUpdateQty(product.id, -1)}
                                  className="w-9 h-9 text-sm font-bold text-[#3D2C2C] hover:bg-[#F3DAD3] rounded-l-full cursor-pointer"
                                >
                                  −
                                </button>
                                <span className="px-2.5 text-xs font-mono font-bold">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQty(product.id, 1)}
                                  className="w-9 h-9 text-sm font-bold text-[#3D2C2C] hover:bg-[#F3DAD3] rounded-r-full cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 3 Metode Pengambilan Quick Picker */}
                  <div className="p-4 rounded-2xl bg-[#FFF9F7] border border-[#E8CEC7] space-y-2.5">
                    <div className="text-xs font-bold text-[#3D2C2C]">
                      Pilih Metode Pengambilan
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: 'COD', label: 'COD', icon: Handshake },
                          { id: 'Ambil di Rumah', label: 'Ambil Rumah', icon: Home },
                          { id: 'Kirim', label: 'Ekspedisi', icon: Truck },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setMethod(opt.id)}
                          className={`min-h-[48px] px-2 py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            method === opt.id
                              ? 'btn-gold border-[#C9A227]'
                              : 'bg-[#F9EDEA]/60 border-[#E5C4BB] text-[#6E5050]'
                          }`}
                        >
                          <opt.icon className="w-3.5 h-3.5" />
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>

                    {method === 'Kirim' ? (
                      <select
                        value={courierId}
                        onChange={(e) =>
                          setCourierId(e.target.value as 'jne-gold' | 'paxel-insured')
                        }
                        aria-label="Pilih kurir ekspedisi"
                        className="w-full min-h-[44px] px-3 rounded-xl bg-[#F9EDEA]/70 border border-[#DFC0B6] text-xs font-semibold text-[#3D2C2C] focus:outline-none focus:border-[#C9A227]"
                      >
                        <option value="jne-gold">
                          JNE Gold Shipment — Rp 63.000 + Asuransi 0,35%
                        </option>
                        <option value="paxel-insured">
                          Paxel Insured — Rp 47.000 + Asuransi 0,30%
                        </option>
                      </select>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#F9EDEA] border border-[#D4AF37]/45 text-[11px] text-[#7A444E] flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                        <span>
                          <strong>Tanpa Ongkir (Rp 0)!</strong> Konfirmasi jadwal &amp; lokasi
                          dulu via WA (<strong>{BRAND_INFO.whatsappDisplay}</strong>) sebelum COD
                          / ambil di rumah.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-2xl bg-[#F9EDEA] border border-[#E5C4BB] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#6E5050]">Subtotal Emas (0% Markup)</span>
                      <span className="font-mono font-bold text-[#3D2C2C]">
                        {formatIDR(totals.subtotalGold)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E5050]">Fee Jastip Flat</span>
                      <span className="font-mono font-bold text-[#9C7418]">
                        {formatIDR(totals.totalFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E5050]">Ongkir &amp; Packing</span>
                      <span className="font-mono font-semibold text-[#8C4A55]">
                        {totals.shippingFee === 0
                          ? 'GRATIS (Rp 0)'
                          : formatIDR(totals.shippingFee)}
                      </span>
                    </div>
                    {totals.insuranceCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#8C4A55] font-semibold">
                          Asuransi Pengiriman 100%
                        </span>
                        <span className="font-mono text-[#8C4A55] font-bold">
                          {formatIDR(totals.insuranceCost)}
                        </span>
                      </div>
                    )}
                    <div className="pt-2.5 mt-1 border-t border-[#DFC0B6] flex justify-between items-baseline">
                      <span className="font-bold text-[#3D2C2C] text-sm">Total</span>
                      <span className="font-mono text-lg font-bold text-[#3D2C2C]">
                        {formatIDR(totals.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Ringkasan Item + Label Brand Jelas di Checkout */}
              <div className="p-3.5 rounded-2xl bg-[#F9EDEA]/80 border border-[#E5C4BB] space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A5C5C]">
                  Ringkasan Item ({items.reduce((s, i) => s + i.quantity, 0)} produk)
                </div>
                {items.map(({ product, quantity }) => {
                  const brandStyle = getBrandVisualStyle(product.brand);
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-2 text-xs bg-[#FFF9F7] px-3 py-2 rounded-xl border border-[#ECD5CE]"
                    >
                      <div className="min-w-0">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${brandStyle.softTag}`}
                        >
                          {brandStyle.shortUpper}
                        </span>
                        <div className="font-bold text-[#3D2C2C] truncate mt-0.5">
                          {product.name} ×{quantity}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#3D2C2C] shrink-0">
                        {product.basePrice !== null
                          ? formatIDR(product.basePrice * quantity)
                          : 'Tanya WA'}
                      </span>
                    </div>
                  );
                })}
                {totals.hasRangePriceItems && (
                  <p className="text-[10.5px] text-[#7A5C5C] leading-snug">
                    * Produk dengan rentang berat mengikuti berat riil di nota resmi toko (harga
                    final dikonfirmasi via WA NJ).
                  </p>
                )}
              </div>

              {/* Required Pickup Method Selector inside Checkout */}
              <div>
                <label className="text-xs font-bold text-[#3D2C2C] block mb-1.5">
                  Metode Pengambilan *
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(
                    [
                      {
                        id: 'COD',
                        title: 'COD — Ketemuan Langsung (Tanpa Ongkir)',
                        sub: 'Bayar di tempat setelah cek fisik emas & surat',
                      },
                      {
                        id: 'Ambil di Rumah',
                        title: `Ambil di Rumah — ${BRAND_INFO.locationPinName} (Tanpa Ongkir)`,
                        sub: 'Mororejo RT16 RW 07 Sambiduwur, Kec. Tanon, Sragen',
                      },
                      {
                        id: 'Kirim',
                        title: 'Kirim via Ekspedisi Berasuransi',
                        sub: 'Packing kayu + asuransi pengiriman 100% nilai',
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setMethod(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        method === opt.id
                          ? 'bg-[#F9EDEA] border-[#C9A227] shadow-sm'
                          : 'bg-[#FFF9F7] border-[#E5C4BB]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#3D2C2C]">{opt.title}</div>
                      <div className="text-[11px] text-[#7A5C5C] mt-0.5">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {isCodOrHome && (
                <div className="p-3.5 rounded-2xl bg-[#F9EDEA] border border-[#D4AF37]/55 text-xs text-[#6E444D] flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-[#3D2C2C]">
                      Konfirmasi jadwal &amp; lokasi dulu via WA sebelum COD / ambil di rumah.
                    </p>
                    {method === 'Ambil di Rumah' && (
                      <p className="text-[11px] leading-relaxed">
                        Alamat (<strong>{BRAND_INFO.locationPinName}</strong>):{' '}
                        {BRAND_INFO.locationAddress}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                  Nama Lengkap *
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Ibu Rahmawati"
                  className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                  No. WA Pelanggan *
                </label>
                <input
                  required
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 0856-xxxx-xxxx"
                  className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              {/* Conditional: Alamat HANYA kalau Kirim via Ekspedisi; Jadwal kalau COD / Ambil di Rumah */}
              {method === 'Kirim' ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                      Pilih Kurir Berasuransi
                    </label>
                    <select
                      value={courierId}
                      onChange={(e) =>
                        setCourierId(e.target.value as 'jne-gold' | 'paxel-insured')
                      }
                      className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                    >
                      <option value="jne-gold">
                        JNE Gold Shipment (+Rp 63.000 &amp; Asuransi 0,35%)
                      </option>
                      <option value="paxel-insured">
                        Paxel Insured (+Rp 47.000 &amp; Asuransi 0,30%)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                      Alamat Lengkap Pengiriman *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                    Jam / Jadwal Ketemuan yang Diinginkan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={jadwal}
                    onChange={(e) => setJadwal(e.target.value)}
                    placeholder="Contoh: Besok sore jam 16.00 WIB / Hari Sabtu pagi"
                    className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                  Catatan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Request kartu ucapan, ukuran cincin, atau patokan COD..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </form>
          )}

          {step === 'success' && confirmedOrder && (
            <div className="space-y-5 py-2">
              <div className="text-center space-y-2.5">
                <div className="w-14 h-14 rounded-full bg-[#F9EDEA] border border-[#D4AF37]/60 text-[#B76E79] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-[#3D2C2C]">
                  Order kamu sudah disiapkan di WhatsApp, lanjut chat dengan NJ untuk konfirmasi.
                </h4>
                <p className="text-xs sm:text-sm text-[#7A5C5C]">
                  Jika tab WhatsApp belum terbuka otomatis, klik tombol di bawah untuk langsung
                  chat ke <strong>{BRAND_INFO.whatsappDisplay}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blush-silk border border-[#E5C4BB] text-center space-y-1">
                <div className="text-[11px] uppercase tracking-widest text-[#7A5C5C] font-bold">
                  Nomor Order Tersimpan
                </div>
                <div className="font-mono text-2xl font-bold text-[#3D2C2C]">
                  {confirmedOrder.orderId}
                </div>
                <div className="text-xs text-[#8C4A55] font-mono font-bold">
                  Total: {formatIDR(confirmedOrder.total)}
                </div>
              </div>

              <pre className="p-4 rounded-2xl bg-[#FFF9F7] border border-[#E8CEC7] text-[11px] font-mono text-[#3D2C2C] whitespace-pre-wrap break-words leading-relaxed max-h-52 overflow-y-auto">
                {confirmedOrder.waMessage}
              </pre>

              <div className="space-y-2.5">
                <a
                  href={confirmedOrder.waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full min-h-[48px] px-5 rounded-full btn-gold font-bold text-sm transition-all inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Buka WhatsApp NJ ({BRAND_INFO.whatsappDisplay})
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleCopyMessage}
                    className="min-h-[44px] px-4 rounded-full bg-[#FFF9F7] border border-[#DFC0B6] text-xs font-bold text-[#3D2C2C] hover:bg-[#F9EDEA] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Tersalin!' : 'Salin Pesan'}
                  </button>
                  <button
                    onClick={() => {
                      const id = confirmedOrder.orderId;
                      setStep('bag');
                      onClose();
                      onJumpToTracker(id);
                    }}
                    className="min-h-[44px] px-4 rounded-full bg-[#B76E79] text-[#FFF9F7] text-xs font-bold hover:brightness-105 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Lihat di Tracker
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Actions */}
        {step !== 'success' && items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#FFF9F7] border-t border-[#E8CEC7]">
            {step === 'bag' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full min-h-[48px] px-5 rounded-full btn-gold font-bold text-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                Lanjut Checkout ({formatIDR(totals.grandTotal)})
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="px-4 min-h-[48px] rounded-full border border-[#B76E79] text-xs font-bold text-[#8C4A55] hover:bg-[#F9EDEA] cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 min-h-[48px] px-5 rounded-full btn-gold font-bold text-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Pesan via WA ({formatIDR(totals.grandTotal)})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
