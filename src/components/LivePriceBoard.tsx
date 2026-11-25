import React, { useState } from 'react';
import {
  TrendingUp,
  Info,
  Plus,
  Check,
  ArrowUpRight,
  Scale,
  Camera,
  Calculator,
  Wallet,
  MessageCircle,
} from 'lucide-react';
import {
  PRICE_MATRIX,
  HISTORICAL_PRICES,
  SPOT_SUMMARY,
  GoldProduct,
  BrandType,
  getWhatsAppUrl,
  getPriceInquiryWaUrl,
  formatIDR,
} from '../data/goldData';

interface LivePriceBoardProps {
  products: GoldProduct[];
  lastUpdated: string;
  onAddToCart: (product: GoldProduct) => void;
  onStartSellFlow: (brand: BrandType, weight: number) => void;
}

type RangeKey = '7D' | '30D' | '90D';

const BRAND_LABEL_MAP: Record<BrandType, string> = {
  SEMAR_NUSANTARA: 'Semar Nusantara',
  SEMAR_JAWA: 'Semar Jawa (Jawa Toko Mas)',
  ISMOYO: 'Ismoyo (J5)',
  ANTAM: 'ANTAM LM',
};

export const LivePriceBoard: React.FC<LivePriceBoardProps> = ({
  products,
  lastUpdated,
  onAddToCart,
  onStartSellFlow,
}) => {
  const [range, setRange] = useState<RangeKey>('30D');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const [mobileBrandTab, setMobileBrandTab] = useState<BrandType>('SEMAR_NUSANTARA');

  const series = HISTORICAL_PRICES[range];
  const allValues = [...series.antam, ...series.semar];
  const minVal = Math.min(...allValues) - 40000;
  const maxVal = Math.max(...allValues) + 40000;

  const chartWidth = 640;
  const chartHeight = 230;
  const padX = 36;
  const padY = 22;

  const getX = (idx: number) =>
    padX + (idx / (series.labels.length - 1)) * (chartWidth - padX * 2);
  const getY = (val: number) =>
    chartHeight - padY - ((val - minVal) / (maxVal - minVal)) * (chartHeight - padY * 2);

  const buildPath = (vals: number[]) =>
    vals
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(v).toFixed(1)}`)
      .join(' ');

  const buildArea = (vals: number[]) => {
    const line = buildPath(vals);
    const lastX = getX(vals.length - 1).toFixed(1);
    const firstX = getX(0).toFixed(1);
    const bottomY = (chartHeight - padY).toFixed(1);
    return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const activeIdx = hoveredIdx ?? series.labels.length - 1;

  const semarGrowthPct = (
    ((series.semar[series.semar.length - 1] - series.semar[0]) / series.semar[0]) *
    100
  ).toFixed(2);
  const antamGrowthPct = (
    ((series.antam[series.antam.length - 1] - series.antam[0]) / series.antam[0]) *
    100
  ).toFixed(2);

  const getBrandCell = (row: (typeof PRICE_MATRIX)[number], brand: BrandType) => {
    if (brand === 'SEMAR_NUSANTARA') {
      return {
        available: row.semarNusantaraFee !== undefined,
        price: row.semarNusantaraPrice ?? null,
        fee: row.semarNusantaraFee,
      };
    }
    if (brand === 'SEMAR_JAWA') {
      return {
        available: row.semarJawaFee !== undefined,
        price: row.semarJawaPrice ?? null,
        fee: row.semarJawaFee,
      };
    }
    if (brand === 'ISMOYO') {
      return {
        available: row.ismoyoFee !== undefined,
        price: row.ismoyoPrice ?? null,
        fee: row.ismoyoFee,
      };
    }
    return {
      available: row.antamFee !== undefined,
      price: row.antamPrice ?? null,
      fee: row.antamFee,
    };
  };

  const handleQuickAddByWeight = (brand: BrandType, weight: number) => {
    const match = products.find(
      (p) =>
        p.brand === brand &&
        p.category !== 'Perhiasan 17K & 10K' &&
        p.weightGrams === weight
    );
    if (match) {
      if (match.stock === 0 || match.stockStatus === 'Habis' || match.basePrice === null) {
        return;
      }
      onAddToCart(match);
    } else {
      const row = PRICE_MATRIX.find((r) => r.weight === weight);
      if (!row) return;
      const { price, fee } = getBrandCell(row, brand);
      if (price === null || !fee) return;

      const buybackRate =
        brand === 'ANTAM'
          ? SPOT_SUMMARY.antamBuybackPerGram
          : SPOT_SUMMARY.semarBuybackPerGram;

      const synthetic: GoldProduct = {
        id: `${brand.toLowerCase()}-matrix-${weight}`,
        sku: `${brand.slice(0, 3)}-${weight}G`,
        name: `${BRAND_LABEL_MAP[brand]} 24K — ${row.label}`,
        brand,
        brandLabel: BRAND_LABEL_MAP[brand],
        category:
          brand === 'SEMAR_NUSANTARA'
            ? 'Semar Nusantara'
            : brand === 'SEMAR_JAWA'
            ? 'Semar Jawa'
            : brand === 'ISMOYO'
            ? 'Ismoyo (J5)'
            : 'ANTAM (Opsi Tambahan)',
        purity: '24K • 999.9 Fine Gold',
        weightGrams: weight,
        basePrice: price,
        buybackEstimate: Math.round(weight * buybackRate),
        jastipFee: fee,
        taxApplicable: brand === 'ANTAM',
        stock: 5,
        stockStatus: 'Ready',
        image:
          brand === 'SEMAR_NUSANTARA'
            ? '/images/official/sn-smg-press-1g.jpg'
            : brand === 'SEMAR_JAWA'
            ? '/images/official/tmj-lm-jawa-05g.jpg'
            : brand === 'ISMOYO'
            ? '/images/official/j5-cincin-pinzy-10k.jpg'
            : '/images/official/antam-certieye-1g.jpg',
        originStore: `Gerai Resmi ${BRAND_LABEL_MAP[brand]}`,
        packaging: `Kemasan Press Resmi ${BRAND_LABEL_MAP[brand]}`,
        certificate: `Surat Resmi Asli ${BRAND_LABEL_MAP[brand]}`,
        description: 'Pembelian langsung dari gerai resmi mengikuti nota harian.',
        specs: ['0% markup harga emas', 'Nota fisik asli terlampir'],
      };
      onAddToCart(synthetic);
    }
    const key = `${brand}-${weight}`;
    setAddedKey(key);
    setTimeout(() => setAddedKey(null), 1600);
  };

  return (
    <section
      id="harga"
      className="py-16 sm:py-20 lg:py-24 bg-marble-luxury border-b border-[#EAD3CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
              Transparansi Harga Harian NJ
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3D2C2C] mt-2 leading-[1.12]">
              Papan Harga Resmi &amp;{' '}
              <span className="italic text-gold-foil">Tren Emas Hari Ini</span>
            </h2>
            <p className="text-sm sm:text-base text-[#7A5C5C] mt-3 leading-relaxed">
              Pantau harga resmi <strong>Semar Nusantara</strong> &amp; opsi tambahan{' '}
              <strong>ANTAM LM</strong> secara terbuka, serta cek harga harian resmi toko{' '}
              <strong>Semar Jawa</strong> &amp; <strong>Ismoyo (J5)</strong> langsung via WA NJ.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F9EDEA] border border-[#E5C6BE] text-xs text-[#5E4545] self-start lg:self-auto">
            <Scale className="w-4 h-4 text-[#C9A227] shrink-0" />
            <span>
              Update terakhir: <strong>{lastUpdated}</strong> • Auto-refresh 5 mnt
            </span>
          </div>
        </div>

        {/* Trend Chart + Brand Guide */}
        <div className="grid lg:grid-cols-12 gap-6 mb-10">
          {/* Interactive SVG Chart */}
          <div className="lg:col-span-8 rounded-3xl bg-[#FFF9F7] text-[#3D2C2C] p-5 sm:p-7 border border-[#E6C7C0] shadow-[0_14px_40px_rgba(183,110,121,0.1)]">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-[#B76E79] font-bold">
                  Grafik Tren Emas 24K (Pecahan 1 Gram)
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" />
                    <span className="text-xs text-[#7A5C5C]">Semar SMG:</span>
                    <span className="font-mono text-sm font-bold text-[#3D2C2C] tabular-nums">
                      {formatIDR(series.semar[activeIdx])}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#8C4A55] bg-[#F9EDEA] px-1.5 py-0.5 rounded-full">
                      +{semarGrowthPct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B76E79]" />
                    <span className="text-xs text-[#7A5C5C]">ANTAM LM:</span>
                    <span className="font-mono text-sm font-bold text-[#3D2C2C] tabular-nums">
                      {formatIDR(series.antam[activeIdx])}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#9C7418] bg-[#FFF4D9] px-1.5 py-0.5 rounded-full">
                      +{antamGrowthPct}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="inline-flex rounded-full bg-[#F9EDEA] p-1 border border-[#E8CEC7]">
                {(['7D', '30D', '90D'] as RangeKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setRange(key);
                      setHoveredIdx(null);
                    }}
                    className={`px-3.5 min-h-[44px] rounded-full text-xs font-bold transition-all cursor-pointer ${
                      range === key ? 'btn-gold' : 'text-[#7A5C5C] hover:text-[#3D2C2C]'
                    }`}
                  >
                    {key === '7D' ? '7 Hari' : key === '30D' ? '30 Hari' : '90 Hari'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto select-none"
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <defs>
                  <linearGradient id="semarGoldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="antamRoseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B76E79" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#B76E79" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
                  const y = padY + t * (chartHeight - padY * 2);
                  return (
                    <line
                      key={idx}
                      x1={padX}
                      x2={chartWidth - padX}
                      y1={y}
                      y2={y}
                      stroke="rgba(183,110,121,0.16)"
                      strokeDasharray="3 4"
                    />
                  );
                })}

                <path d={buildArea(series.antam)} fill="url(#antamRoseFill)" />
                <path d={buildArea(series.semar)} fill="url(#semarGoldFill)" />

                <path
                  d={buildPath(series.antam)}
                  fill="none"
                  stroke="#B76E79"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={buildPath(series.semar)}
                  fill="none"
                  stroke="#C9A227"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <line
                  x1={getX(activeIdx)}
                  x2={getX(activeIdx)}
                  y1={padY}
                  y2={chartHeight - padY}
                  stroke="rgba(201,162,39,0.45)"
                  strokeDasharray="3 3"
                />

                {series.labels.map((label, i) => {
                  const cx = getX(i);
                  const yAntam = getY(series.antam[i]);
                  const ySemar = getY(series.semar[i]);
                  const isActive = i === activeIdx;
                  return (
                    <g
                      key={label}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(i)}
                      onClick={() => setHoveredIdx(i)}
                    >
                      <rect
                        x={cx - 32}
                        y={0}
                        width={64}
                        height={chartHeight}
                        fill="transparent"
                      />
                      <circle
                        cx={cx}
                        cy={yAntam}
                        r={isActive ? 5.5 : 3.2}
                        fill="#B76E79"
                        stroke="#FFF9F7"
                        strokeWidth="2"
                      />
                      <circle
                        cx={cx}
                        cy={ySemar}
                        r={isActive ? 5.5 : 3.4}
                        fill="#C9A227"
                        stroke="#FFF9F7"
                        strokeWidth="2"
                      />
                      <text
                        x={cx}
                        y={chartHeight - 4}
                        textAnchor="middle"
                        className="text-[10px] font-mono"
                        fill={isActive ? '#3D2C2C' : '#9B7F7F'}
                        fontWeight={isActive ? 700 : 500}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="mt-3 pt-3 border-t border-[#F1E0DA] flex flex-wrap items-center justify-between gap-2 text-xs text-[#7A5C5C]">
              <span>
                Tanggal terpilih:{' '}
                <strong className="text-[#3D2C2C]">{series.labels[activeIdx]} 2026</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-[#9C7418] font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                Sentuh / klik titik grafik untuk detail historis
              </span>
            </div>
          </div>

          {/* Right Brand Comparison Guide */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="rounded-3xl bg-gradient-to-b from-[#F9EDEA] to-[#F3DAD3] border border-[#E5C5BC] p-6 flex-1 flex flex-col justify-between shadow-[0_12px_32px_rgba(183,110,121,0.1)]">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#B76E79]">
                  Panduan 3 Brand Utama + Opsi
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#3D2C2C] mt-1.5">
                  Pilih Emas Sesuai Tujuan Anda
                </h3>
                <ul className="mt-4 space-y-3 text-xs sm:text-[13px] text-[#5B4141] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#C9A227] mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-[#3D2C2C]">Semar Nusantara (SMG &amp; Perhiasan)</strong>:
                      Tersedia mulai 0,1g dengan spread tipis serta koleksi perhiasan kekinian
                      10K &amp; 17K (Nikita Willy Gold).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B76E79] mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-[#3D2C2C]">Semar Jawa (Toko Mas Jawa Solo)</strong>:
                      Logam mulia Jawa Gold 24K motif Gunungan mulai 0,1g (Rp 337.000) serta
                      perhiasan 10K &amp; 17K seri CLARETTA dan Rosèe.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#7B1E2B] mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-[#3D2C2C]">Ismoyo (Toko Mas J5 Solo)</strong>:
                      Koleksi perhiasan emas asli 10K model Pinzy, Rolly, Lenora mulai Rp 317.000
                      serta layanan buyback cepat di Solo Raya.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#9C7418] mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-[#3D2C2C]">ANTAM LM (Opsi Tambahan)</strong>:
                      Tersedia pula CertiEye 999.9 LBMA bagi investor yang menginginkan standar
                      internasional.
                    </span>
                  </li>
                </ul>
              </div>
              <a
                href="#kalkulator"
                className="mt-5 inline-flex items-center justify-between px-4 min-h-[46px] rounded-full btn-gold text-xs font-bold transition-all"
              >
                <span>Bandingkan Beli &amp; Jual di Kalkulator</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Full Price Matrix — Mobile Cards + Desktop Table (NO Fake Numbers!) */}
        <div className="rounded-3xl bg-[#FFF9F7] border border-[#E6C7C0] shadow-[0_14px_40px_rgba(183,110,121,0.09)] overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-[#F0DDD7] flex flex-wrap items-center justify-between gap-4 bg-[#FDF6F3]">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-[#3D2C2C]">
                Matriks Harga Dasar &amp; Fee Jastip per Gramasi
              </h3>
              <p className="text-xs text-[#7A5C5C] mt-0.5">
                Untuk brand bertanda <strong>Tanya WA</strong>, klik langsung tombol WA untuk
                mendapatkan rilis harga resmi toko hari ini tanpa markup.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B4E4E] bg-[#F9EDEA] px-3.5 py-2 rounded-2xl border border-[#E8CEC7]">
              <Info className="w-4 h-4 text-[#B76E79] shrink-0" />
              <span>
                3 Brand Utama: <strong>Nett Nota Toko</strong> • ANTAM:{' '}
                <strong>PPh 22 0,25% (NPWP)</strong>
              </span>
            </div>
          </div>

          {/* MOBILE VIEW (Zero horizontal scroll!) */}
          <div className="md:hidden p-4 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'SEMAR_NUSANTARA', label: 'Semar Nusantara' },
                  { id: 'SEMAR_JAWA', label: 'Semar Jawa' },
                  { id: 'ISMOYO', label: 'Ismoyo (J5)' },
                  { id: 'ANTAM', label: 'ANTAM (Opsi)' },
                ] as { id: BrandType; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMobileBrandTab(tab.id)}
                  className={`min-h-[44px] px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    mobileBrandTab === tab.id
                      ? 'btn-gold'
                      : 'bg-[#F9EDEA] text-[#7A5C5C] border border-[#E8CEC7]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {PRICE_MATRIX.map((row) => {
                const { available, price, fee } = getBrandCell(row, mobileBrandTab);
                if (!available || !fee) return null;
                const isAdded = addedKey === `${mobileBrandTab}-${row.weight}`;
                return (
                  <div
                    key={row.weight}
                    className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#B76E79]">{row.label}</div>
                      {price !== null ? (
                        <div className="font-mono text-base font-bold text-[#3D2C2C] tabular-nums">
                          {formatIDR(price)}
                        </div>
                      ) : (
                        <div className="font-editorial text-base font-bold text-[#8C4A55]">
                          Tanya WA
                        </div>
                      )}
                      <div className="text-[11px] font-mono text-[#9C7418]">
                        Fee +{formatIDR(fee)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onStartSellFlow(mobileBrandTab, row.weight)}
                        className="px-3 min-h-[44px] rounded-full border border-[#B76E79] text-[#8C4A55] text-xs font-bold cursor-pointer"
                      >
                        Jual
                      </button>
                      {price !== null ? (
                        <button
                          onClick={() => handleQuickAddByWeight(mobileBrandTab, row.weight)}
                          className={`px-3.5 min-h-[44px] rounded-full text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${
                            isAdded ? 'bg-[#B76E79] text-white' : 'btn-gold'
                          }`}
                        >
                          {isAdded ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          {isAdded ? 'Masuk' : 'Beli'}
                        </button>
                      ) : (
                        <a
                          href={getPriceInquiryWaUrl(
                            BRAND_LABEL_MAP[mobileBrandTab],
                            row.label
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 min-h-[44px] rounded-full btn-gold text-xs font-bold inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Tanya WA
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9EDEA] text-[11px] uppercase tracking-[0.12em] text-[#7A5C5C] border-b border-[#EBD2CA]">
                  <th className="py-3.5 px-5 font-bold">Gramasi</th>
                  <th className="py-3.5 px-4 font-bold">Semar Nusantara</th>
                  <th className="py-3.5 px-4 font-bold border-l border-[#EBD2CA]">
                    Semar Jawa
                  </th>
                  <th className="py-3.5 px-4 font-bold border-l border-[#EBD2CA]">
                    Ismoyo (J5)
                  </th>
                  <th className="py-3.5 px-4 font-bold border-l border-[#EBD2CA]">
                    ANTAM <span className="normal-case font-normal">(Opsi)</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3E3DE] text-sm">
                {PRICE_MATRIX.map((row) => (
                  <tr key={row.weight} className="hover:bg-[#FDF6F4] transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#3D2C2C] whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                        {row.label}
                      </span>
                    </td>

                    {(
                      ['SEMAR_NUSANTARA', 'SEMAR_JAWA', 'ISMOYO', 'ANTAM'] as BrandType[]
                    ).map((brand, bIdx) => {
                      const { available, price, fee } = getBrandCell(row, brand);
                      const isAdded = addedKey === `${brand}-${row.weight}`;
                      return (
                        <td
                          key={brand}
                          className={`py-3 px-4 ${bIdx > 0 ? 'border-l border-[#F3E3DE]' : ''}`}
                        >
                          {available && fee ? (
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                {price !== null ? (
                                  <div className="font-mono font-bold text-[#3D2C2C] tabular-nums text-[13px]">
                                    {formatIDR(price)}
                                  </div>
                                ) : (
                                  <div className="font-editorial font-bold text-[#8C4A55] text-sm">
                                    Tanya WA
                                  </div>
                                )}
                                <div className="font-mono text-[10px] text-[#9C7418]">
                                  Fee +{formatIDR(fee)}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {price !== null ? (
                                  <button
                                    onClick={() => handleQuickAddByWeight(brand, row.weight)}
                                    className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-0.5 ${
                                      isAdded ? 'bg-[#B76E79] text-white' : 'btn-gold'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <Check className="w-3 h-3" />
                                    ) : (
                                      <Plus className="w-3 h-3" />
                                    )}
                                    {isAdded ? 'Ok' : 'Beli'}
                                  </button>
                                ) : (
                                  <a
                                    href={getPriceInquiryWaUrl(
                                      BRAND_LABEL_MAP[brand],
                                      row.label
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1.5 rounded-full btn-gold text-[11px] font-bold inline-flex items-center gap-1 whitespace-nowrap"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    WA
                                  </a>
                                )}
                                <button
                                  onClick={() => onStartSellFlow(brand, row.weight)}
                                  title="Simulasi Jual Emas"
                                  className="px-2 py-1.5 rounded-full border border-[#B76E79]/60 text-[#8C4A55] text-[10px] font-bold hover:bg-[#F9EDEA] cursor-pointer"
                                >
                                  Jual
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-[#C2A8A8]">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION SINGKAT: CARA JUAL EMAS (3 LANGKAH MUDAH & CEPAT CAIR)   */}
        {/* ================================================================ */}
        <div
          id="cara-jual"
          className="scroll-mt-24 mt-14 rounded-3xl bg-blush-silk border border-[#E5C4BB] p-6 sm:p-9 shadow-[0_16px_42px_rgba(183,110,121,0.12)]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C4A55]">
                Layanan Buyback Cepat &amp; Amanah
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#3D2C2C] mt-1.5">
                Cara <span className="italic text-gold-foil">Jual Emas</span> di NJ — 3 Langkah
                Mudah
              </h3>
              <p className="text-xs sm:text-sm text-[#6E5050] mt-2 leading-relaxed">
                Ingin mencairkan emas batangan atau perhiasan Semar Nusantara, Semar Jawa,
                Ismoyo, maupun ANTAM Anda? Proses transparan tanpa ribet dan dana langsung cair!
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => onStartSellFlow('SEMAR_NUSANTARA', 1)}
                className="inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-full bg-[#FFF9F7] border border-[#B76E79] text-[#8C4A55] text-xs font-bold hover:bg-[#F9EDEA] transition-colors cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                Hitung Estimasi Buyback
              </button>
              <a
                href={getWhatsAppUrl(
                  'Halo NJ, saya ingin jual emas (buyback). Mohon info penawaran harga buyback hari ini.'
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-full btn-gold text-xs font-bold transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Jual Emas via WA NJ
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                icon: Camera,
                title: 'Kirim Foto & Berat Emas via WA',
                desc: 'Foto fisik emas/perhiasan beserta surat resmi (nota toko) dan kirimkan ke WhatsApp NJ (+62 856-4121-3142) beserta informasi berat gramasinya.',
              },
              {
                step: '02',
                icon: Calculator,
                title: 'Dapat Penawaran Harga Buyback',
                desc: 'Tim kami langsung menghitung penawaran harga buyback harian terbaik secara terbuka dan ramah tanpa potongan tersembunyi.',
              },
              {
                step: '03',
                icon: Wallet,
                title: 'Dana Cair Setelah Verifikasi',
                desc: 'Serah terima fisik bisa lewat COD, datang ke rumah Mbak Jannah (Sragen), atau kirim paket. Setelah cek keaslian & timbang, dana langsung cair tunai / transfer!',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl bg-[#FFF9F7] border border-[#E9CFC8] p-5 sm:p-6 shadow-[0_8px_24px_rgba(183,110,121,0.09)] flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#F9EDEA] border border-[#D4AF37]/45 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#B76E79]" />
                  </div>
                  <span className="font-editorial text-3xl font-bold text-gold-foil">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h4 className="font-editorial text-xl font-bold text-[#3D2C2C]">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-[#7A5C5C] mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
