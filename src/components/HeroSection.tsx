import React from 'react';
import {
  ArrowRight,
  Calculator,
  ShieldCheck,
  ReceiptText,
  Truck,
  Award,
  Sparkles,
  CheckCircle2,
  MapPin,
  Gem,
  Clock,
  Lock,
  Banknote,
  BadgeCheck,
  MessageCircle,
} from 'lucide-react';
import {
  SPOT_SUMMARY,
  BRAND_INFO,
  BrandType,
  getPriceInquiryWaUrl,
  formatIDR,
} from '../data/goldData';
import { CrownNJLogo } from './NavbarAndTicker';

interface HeroSectionProps {
  lastUpdated: string;
  onQuickSelectBrand: (brand: BrandType) => void;
  onStartSellHero: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lastUpdated,
  onQuickSelectBrand,
  onStartSellHero,
}) => {
  return (
    <section
      id="top"
      className="relative bg-hero-satin text-[#3D2C2C] overflow-hidden border-b border-[#EAD3CC]"
    >
      {/* Decorative Subtle Marble Arch & Sparkling Gems (Pure CSS/SVG) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[340px] rounded-full bg-[#FFF9F7]/75 blur-[70px]" />
        <svg
          viewBox="0 0 120 120"
          className="hidden md:block absolute top-8 left-6 w-16 h-16 text-[#D4AF37]/45"
          fill="currentColor"
        >
          <path d="M60 8L67 48L108 55L67 62L60 102L53 62L12 55L53 48L60 8Z" />
        </svg>
        <svg
          viewBox="0 0 100 100"
          className="hidden lg:block absolute top-14 right-8 w-14 h-14 text-[#D4AF37]/40"
          fill="currentColor"
        >
          <path d="M50 6L56 42L92 48L56 54L50 90L44 54L8 48L44 42L50 6Z" />
        </svg>
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#FFF9F7] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-10 lg:pt-6 lg:pb-12 space-y-6">
        {/* MAIN ABOVE-THE-FOLD GRID */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-7 items-start">
          {/* LEFT / MAIN LUXURY POSTER COMPOSITION */}
          <div className="lg:col-span-8 flex flex-col items-center text-center space-y-3 sm:space-y-3.5">
            {/* Top Monogram Crown NJ + MELAYANI */}
            <div className="flex flex-col items-center">
              <div className="px-5 py-2 rounded-2xl bg-[#FFF9F7]/90 border border-[#D4AF37]/50 shadow-[0_8px_22px_rgba(183,110,121,0.12)] backdrop-blur-sm">
                <CrownNJLogo size="lg" />
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#B76E79]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#8C4A55]">
                  MELAYANI
                </span>
                <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#B76E79]" />
              </div>
            </div>

            {/* Centerpiece Headline: JASTIP JUAL & BELI EMAS */}
            <div className="space-y-1 max-w-3xl">
              <h1 className="font-editorial font-bold tracking-tight text-[#3D2C2C] leading-[1.04]">
                <span className="block text-xl sm:text-2xl md:text-[28px] tracking-[0.07em]">
                  JASTIP JUAL &amp; BELI
                </span>
                <span className="block text-5xl sm:text-6xl lg:text-[62px] leading-[1.0] tracking-[0.09em] text-gold-foil mt-0.5">
                  EMAS
                </span>
              </h1>
              <p className="text-[10px] min-[390px]:text-xs sm:text-sm font-bold tracking-[0.06em] min-[390px]:tracking-[0.12em] sm:tracking-[0.2em] uppercase text-[#5E3E3E] pt-0.5 leading-relaxed">
                SEMAR NUSANTARA <span className="text-[#C9A227] mx-0.5 sm:mx-1">|</span> SEMAR JAWA{' '}
                <span className="text-[#C9A227] mx-0.5 sm:mx-1">|</span> ISMOYO
              </p>
            </div>

            {/* Tagline Ribbon Badge */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 rounded-full bg-gradient-to-r from-[#FFF9F7] via-[#FDF3EE] to-[#FFF9F7] border border-[#D4AF37]/60 shadow-[0_4px_16px_rgba(201,162,39,0.14)]">
              <Gem className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase text-[#7A5020]">
                {BRAND_INFO.tagline}
              </span>
              <Gem className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
            </div>

            {/* 3 Trust Badges */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                'PRODUK ASLI & RESMI',
                'KUALITAS TERJAMIN BERSTANDAR TINGGI',
                'TRANSAKSI AMAN & TERPERCAYA',
              ].map((badgeText) => (
                <div
                  key={badgeText}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-[#FFF9F7]/92 border border-[#EAD0C8] shadow-[0_3px_12px_rgba(183,110,121,0.08)]"
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.03em] text-[#3D2C2C] leading-tight">
                    {badgeText}
                  </span>
                </div>
              ))}
            </div>

            {/* 3 OFFICIAL BRAND PHOTO SHOWCASE CARDS (100% Real Official Brand Photography) */}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-3.5 pt-1">
              {/* CARD 1: SEMAR NUSANTARA */}
              <button
                type="button"
                onClick={() => onQuickSelectBrand('SEMAR_NUSANTARA')}
                className="group rounded-2xl sm:rounded-3xl bg-[#FFF9F7] border border-[#E5C7BE] p-1.5 sm:p-2.5 shadow-[0_12px_28px_rgba(183,110,121,0.13)] hover:border-[#C9A227] hover:shadow-[0_16px_34px_rgba(201,162,39,0.22)] hover:-translate-y-1 transition-all text-center flex flex-col items-center cursor-pointer"
              >
                <div className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#FAF0EC] via-[#FFF9F7] to-[#F4DFD8] border border-[#D4AF37]/45 p-1 sm:p-2 flex items-center justify-center">
                  <div className="w-full aspect-square max-w-[164px] mx-auto rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-[0_6px_16px_rgba(61,44,44,0.09)] ring-1 ring-[#D4AF37]/35">
                    <picture>
                      <source srcSet="./images/official/sn-smg-press-1g.webp" type="image/webp" />
                      <img
                        src="./images/official/sn-smg-press-1g.jpg"
                        alt="Logam Mulia SMG Press 24K Resmi Semar Nusantara"
                        width={640}
                        height={640}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                      />
                    </picture>
                  </div>
                </div>
                <div className="mt-2 pb-0.5 space-y-0.5 px-0.5">
                  <h2 className="font-editorial text-[11px] sm:text-sm md:text-[15px] font-bold text-[#3D2C2C] group-hover:text-[#B76E79] transition-colors leading-tight">
                    SEMAR NUSANTARA
                  </h2>
                  <p className="text-[9.5px] sm:text-[11px] font-bold text-[#9C7418] font-mono leading-tight">
                    1g {formatIDR(SPOT_SUMMARY.semar1g)}
                  </p>
                  <p className="hidden sm:block text-[10px] font-medium text-[#7A5C5C]">
                    SMG 24K &amp; Perhiasan • 19 Produk
                  </p>
                </div>
              </button>

              {/* CARD 2: SEMAR JAWA (TOKO MAS JAWA) */}
              <button
                type="button"
                onClick={() => onQuickSelectBrand('SEMAR_JAWA')}
                className="group rounded-2xl sm:rounded-3xl bg-[#FFF9F7] border border-[#E5C7BE] p-1.5 sm:p-2.5 shadow-[0_12px_28px_rgba(183,110,121,0.13)] hover:border-[#C9A227] hover:shadow-[0_16px_34px_rgba(201,162,39,0.22)] hover:-translate-y-1 transition-all text-center flex flex-col items-center cursor-pointer"
              >
                <div className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#FAF0EC] via-[#FFF9F7] to-[#F4DFD8] border border-[#D4AF37]/45 p-1 sm:p-2 flex items-center justify-center">
                  <div className="w-full aspect-square max-w-[164px] mx-auto rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-[0_6px_16px_rgba(61,44,44,0.09)] ring-1 ring-[#D4AF37]/35">
                    <picture>
                      <source srcSet="./images/catalog/semar-jawa-bar.webp" type="image/webp" />
                      <img
                        src="./images/catalog/semar-jawa-bar.jpg"
                        alt="Logam Mulia Jawa Gold 24K Resmi Toko Mas Jawa"
                        width={640}
                        height={640}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                      />
                    </picture>
                  </div>
                </div>
                <div className="mt-2 pb-0.5 space-y-0.5 px-0.5">
                  <h2 className="font-editorial text-[11px] sm:text-sm md:text-[15px] font-bold text-[#3D2C2C] group-hover:text-[#B76E79] transition-colors leading-tight">
                    SEMAR JAWA
                  </h2>
                  <p className="text-[9.5px] sm:text-[11px] font-bold text-[#7A4A21] font-mono leading-tight">
                    Mulai {formatIDR(SPOT_SUMMARY.semarJawaStartPrice)}
                  </p>
                  <p className="hidden sm:block text-[10px] font-medium text-[#7A5C5C]">
                    Jawa Gold 24K &amp; 17K • 14 Produk
                  </p>
                </div>
              </button>

              {/* CARD 3: ISMOYO (TOKO MAS J5) */}
              <button
                type="button"
                onClick={() => onQuickSelectBrand('ISMOYO')}
                className="group rounded-2xl sm:rounded-3xl bg-[#FFF9F7] border border-[#E5C7BE] p-1.5 sm:p-2.5 shadow-[0_12px_28px_rgba(183,110,121,0.13)] hover:border-[#C9A227] hover:shadow-[0_16px_34px_rgba(201,162,39,0.22)] hover:-translate-y-1 transition-all text-center flex flex-col items-center cursor-pointer"
              >
                <div className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#FAF0EC] via-[#FFF9F7] to-[#F4DFD8] border border-[#D4AF37]/45 p-1 sm:p-2 flex items-center justify-center">
                  <div className="w-full aspect-square max-w-[164px] mx-auto rounded-lg sm:rounded-xl overflow-hidden bg-[#FAF6F2] shadow-[0_6px_16px_rgba(61,44,44,0.09)] ring-1 ring-[#D4AF37]/35">
                    <picture>
                      <source srcSet="./images/official/j5-cincin-pinzy-10k.webp" type="image/webp" />
                      <img
                        src="./images/official/j5-cincin-pinzy-10k.jpg"
                        alt="Perhiasan Emas Asli 10K Resmi Toko Mas J5 Ismoyo"
                        width={640}
                        height={640}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                      />
                    </picture>
                  </div>
                </div>
                <div className="mt-2 pb-0.5 space-y-0.5 px-0.5">
                  <h2 className="font-editorial text-[11px] sm:text-sm md:text-[15px] font-bold text-[#3D2C2C] group-hover:text-[#7B1E2B] transition-colors leading-tight">
                    ISMOYO (J5)
                  </h2>
                  <p className="text-[9.5px] sm:text-[11px] font-bold text-[#7B1E2B] font-mono leading-tight">
                    Mulai {formatIDR(SPOT_SUMMARY.ismoyoStartPrice)}
                  </p>
                  <p className="hidden sm:block text-[10px] font-medium text-[#7A5C5C]">
                    Perhiasan 10K Resmi • 12 Produk
                  </p>
                </div>
              </button>
            </div>

            {/* 3 PROMINENT CTA BUTTONS IMMEDIATELY ABOVE THE FOLD */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 w-full pt-1.5">
              <a
                href="#katalog"
                className="inline-flex items-center justify-center gap-2 px-6 min-h-[46px] rounded-full btn-gold font-bold text-xs sm:text-sm tracking-wide transition-all"
              >
                Jelajahi Katalog Emas
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#kalkulator"
                className="inline-flex items-center justify-center gap-2 px-5 min-h-[46px] rounded-full bg-[#FFF9F7] border-2 border-[#B76E79] text-[#8C4A55] font-bold text-xs sm:text-sm hover:bg-[#F9EDEA] transition-all shadow-sm"
              >
                <Calculator className="w-4 h-4 text-[#B76E79]" />
                Hitung Simulasi Biaya
              </a>

              <button
                type="button"
                onClick={onStartSellHero}
                className="inline-flex items-center justify-center gap-2 px-5 min-h-[46px] rounded-full bg-[#B76E79] text-[#FFF9F7] font-bold text-xs sm:text-sm hover:brightness-105 transition-all shadow-[0_8px_20px_rgba(183,110,121,0.28)] cursor-pointer"
              >
                <Banknote className="w-4 h-4 text-[#F7DF8D]" />
                Jual Emas
              </button>
            </div>
          </div>

          {/* RIGHT ELEVATED LIVE RATE CARD (Cleaned Antam Layout & Real/Tanya WA Rates) */}
          <div className="lg:col-span-4 w-full">
            <div className="rounded-3xl bg-[#FFF9F7]/96 border border-[#E3C1B7] backdrop-blur-md p-5 shadow-[0_20px_48px_rgba(183,110,121,0.16)] space-y-3.5">
              <div className="flex items-start justify-between gap-2 border-b border-[#F0DCD6] pb-3">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#B76E79] font-bold">
                    Acuan Harga Resmi Hari Ini
                  </span>
                  <p className="text-[11px] text-[#7A5C5C] mt-0.5">
                    Update terakhir: <strong className="text-[#3D2C2C]">{lastUpdated}</strong>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F9EDEA] border border-[#D4AF37]/45 text-[#8C4A55] text-[10px] font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                  Lock Dibuka
                </span>
              </div>

              {/* 1. SEMAR NUSANTARA (Verified Price) */}
              <div className="p-3.5 rounded-2xl bg-[#F9EDEA]/80 border border-[#EBD2CA] hover:border-[#C9A227] transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B76E79] text-[#FFF9F7] text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
                    SEMAR NUSANTARA
                  </span>
                  <span className="text-[11px] text-[#8C4A55] font-mono font-semibold whitespace-nowrap">
                    +{formatIDR(SPOT_SUMMARY.semar1gChange)}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <h3 className="font-sans text-xs sm:text-[13px] font-bold text-[#3D2C2C] whitespace-nowrap">
                    SMG Press 24K (1g)
                  </h3>
                  <div className="font-mono text-base font-bold text-[#3D2C2C] tabular-nums whitespace-nowrap">
                    {formatIDR(SPOT_SUMMARY.semar1g)}
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#E8CEC7] flex items-center justify-between text-[11px]">
                  <span className="text-[#7A5C5C]">
                    Buyback:{' '}
                    <strong className="text-[#3D2C2C] font-mono">
                      {formatIDR(SPOT_SUMMARY.semarBuybackPerGram)}
                    </strong>
                    /g
                  </span>
                  <button
                    onClick={() => onQuickSelectBrand('SEMAR_NUSANTARA')}
                    className="text-[#9C7418] font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5 py-1"
                  >
                    Katalog <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 2. SEMAR JAWA & ISMOYO (J5) — HARGA RESMI TERVERIFIKASI + TANYA WA BUYBACK */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE] hover:border-[#C9A227] transition-colors flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#F3DAD3] text-[#7A4A21] text-[9.5px] font-bold uppercase tracking-wider">
                      SEMAR JAWA
                    </span>
                    <div className="text-[10px] font-semibold text-[#7A5C5C] mt-1.5">
                      Jawa Gold 0,5g
                    </div>
                    <div className="font-mono text-[15px] font-bold text-[#3D2C2C] tabular-nums leading-tight mt-0.5">
                      {formatIDR(SPOT_SUMMARY.semarJawa05g)}
                    </div>
                    <div className="text-[10px] text-[#7A5C5C] leading-snug mt-0.5">
                      Mini 0,1g {formatIDR(SPOT_SUMMARY.semarJawaStartPrice)} • Buyback WA
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onQuickSelectBrand('SEMAR_JAWA')}
                      className="flex-1 inline-flex items-center justify-center min-h-[34px] px-2 rounded-full bg-[#F9EDEA] border border-[#D4AF37]/50 text-[#7A4A21] text-[10.5px] font-bold hover:bg-[#F3DAD3] transition-colors cursor-pointer"
                    >
                      Katalog
                    </button>
                    <a
                      href={getPriceInquiryWaUrl('Semar Jawa (Toko Mas Jawa Solo)')}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Tanya WA Semar Jawa"
                      className="inline-flex items-center justify-center min-h-[34px] px-2.5 rounded-full bg-[#FFF9F7] border border-[#B76E79]/45 text-[#8C4A55] text-[10.5px] font-bold hover:bg-[#F9EDEA] transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE] hover:border-[#C9A227] transition-colors flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#7B1E2B]/12 text-[#7B1E2B] text-[9.5px] font-bold uppercase tracking-wider">
                      ISMOYO (J5)
                    </span>
                    <div className="text-[10px] font-semibold text-[#7A5C5C] mt-1.5">
                      Perhiasan 10K Mulai
                    </div>
                    <div className="font-mono text-[15px] font-bold text-[#7B1E2B] tabular-nums leading-tight mt-0.5">
                      {formatIDR(SPOT_SUMMARY.ismoyoStartPrice)}
                    </div>
                    <div className="text-[10px] text-[#7A5C5C] leading-snug mt-0.5">
                      12 model resmi • Buyback WA
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onQuickSelectBrand('ISMOYO')}
                      className="flex-1 inline-flex items-center justify-center min-h-[34px] px-2 rounded-full bg-[#F9EDEA] border border-[#7B1E2B]/35 text-[#7B1E2B] text-[10.5px] font-bold hover:bg-[#F3DAD3] transition-colors cursor-pointer"
                    >
                      Katalog
                    </button>
                    <a
                      href={getPriceInquiryWaUrl('Ismoyo (Toko Mas J5 Solo)')}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Tanya WA Ismoyo J5"
                      className="inline-flex items-center justify-center min-h-[34px] px-2.5 rounded-full bg-[#FFF9F7] border border-[#7B1E2B]/35 text-[#7B1E2B] text-[10.5px] font-bold hover:bg-[#F9EDEA] transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 3. ANTAM LM (Clean Single-Line Unclipped Layout Matching Semar Nusantara!) */}
              <div className="p-3.5 rounded-2xl bg-[#FCF6F4] border border-[#EBD4CC] hover:border-[#C9A227] transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/25 text-[#6F4E0E] text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
                      ANTAM LM
                    </span>
                    <span className="text-[10px] font-semibold text-[#8C6E6E] whitespace-nowrap">
                      • Opsi Tambahan
                    </span>
                  </div>
                  <span className="text-[11px] text-[#9C7418] font-mono font-semibold whitespace-nowrap">
                    +{formatIDR(SPOT_SUMMARY.antam1gChange)}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <h3 className="font-sans text-xs sm:text-[13px] font-bold text-[#3D2C2C] whitespace-nowrap">
                    CertiCard / CertiEye (1g)
                  </h3>
                  <div className="font-mono text-base font-bold text-[#3D2C2C] tabular-nums whitespace-nowrap">
                    {formatIDR(SPOT_SUMMARY.antam1g)}
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#EFE0DB] flex items-center justify-between text-[11px]">
                  <span className="text-[#7A5C5C]">
                    Buyback:{' '}
                    <strong className="text-[#3D2C2C] font-mono">
                      {formatIDR(SPOT_SUMMARY.antamBuybackPerGram)}
                    </strong>
                    /g
                  </span>
                  <button
                    onClick={() => onQuickSelectBrand('ANTAM')}
                    className="text-[#8C4A55] font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5 py-1"
                  >
                    Opsi Antam <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Fee & Refund Guarantee */}
              <div className="flex items-start gap-2 text-[11px] text-[#5E4545] bg-[#F9EDEA] rounded-2xl p-3 border border-[#E8CEC7]">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Fee jastip flat mulai{' '}
                  <strong className="text-[#3D2C2C]">Rp15.000/item</strong>.{' '}
                  <strong className="text-[#8C4A55]">Refund 100% otomatis</strong> bila kuota
                  habis atau berat riil lebih ringan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4 BADGE KEUNGGULAN REFERENSI + COD / AMBIL DI RUMAH STRIP    */}
        {/* ============================================================ */}
        <div className="space-y-4 pt-2 border-t border-[#E6CBC3]/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: ShieldCheck,
                title: 'INVESTASI AMAN',
                sub: 'NILAI STABIL',
              },
              {
                icon: Banknote,
                title: 'LIKUIDITAS TINGGI',
                sub: 'MUDAH DICAIRKAN',
              },
              {
                icon: Lock,
                title: 'PRIVASI TERJAGA',
                sub: 'PELAYANAN PREMIUM',
              },
              {
                icon: Clock,
                title: 'FAST RESPONSE',
                sub: 'RAMAH & PROFESIONAL',
              },
            ].map((adv) => (
              <div
                key={adv.title}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#FFF9F7]/95 border border-[#E6C7C0] text-left shadow-[0_6px_18px_rgba(183,110,121,0.09)]"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F9EDEA] to-[#F3DAD3] border border-[#D4AF37]/45 flex items-center justify-center shrink-0">
                  <adv.icon className="w-4 h-4 text-[#B76E79]" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-bold tracking-[0.06em] text-[#3D2C2C]">
                    {adv.title}
                  </div>
                  <div className="text-[11px] font-bold text-[#9C7418] mt-0.5">{adv.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* COD / Ambil di Rumah + 4 Original Trust Proofs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#lokasi"
                className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full bg-[#B76E79] text-[#FFF9F7] text-xs font-bold shadow-sm hover:brightness-105 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F7DF8D]" />
                Bisa COD (Tanpa Ongkir)
              </a>
              <a
                href="#lokasi"
                className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full bg-[#FFF9F7] border border-[#C9A227]/70 text-[#7A5020] text-xs font-bold shadow-sm hover:bg-[#F9EDEA] transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                Bisa Ambil di Rumah (Mbak Jannah — Sragen)
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 lg:max-w-2xl">
              {[
                { icon: ReceiptText, title: '0% Markup', sub: 'Persis nota toko' },
                { icon: ShieldCheck, title: 'CertiEye & Surat', sub: 'Surat asli resmi' },
                { icon: Truck, title: 'Asuransi 100%', sub: 'JNE Gold & kayu' },
                { icon: Award, title: '14.800+ Gram', sub: 'Terkirim aman' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-[#FFF9F7]/80 border border-[#EED7D0] px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-1.5 text-[#B76E79]">
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold text-[#3D2C2C]">{item.title}</span>
                  </div>
                  <p className="text-[10px] text-[#7A5C5C] mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
