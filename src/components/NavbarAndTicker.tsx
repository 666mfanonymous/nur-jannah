import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  MapPin,
  MessageCircle,
  Phone,
  Globe,
} from 'lucide-react';
import {
  SPOT_SUMMARY,
  BRAND_INFO,
  WorldSpotRef,
  getWhatsAppUrl,
  formatIDR,
} from '../data/goldData';

interface NavbarAndTickerProps {
  cartCount: number;
  lastUpdated: string;
  worldSpot: WorldSpotRef;
  onOpenCart: () => void;
  onOpenCustomRequest: () => void;
}

const NAV_LINKS = [
  { label: 'Harga', href: '#harga' },
  { label: 'Katalog', href: '#katalog' },
  { label: 'Kalkulator', href: '#kalkulator' },
  { label: 'Cara Jual', href: '#cara-jual' },
  { label: 'Member', href: '#member' },
  { label: 'Keaslian', href: '#keaslian' },
  { label: 'Lacak', href: '#lacak' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'FAQ', href: '#faq' },
];

export const CrownNJLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => {
  const crownClass =
    size === 'lg'
      ? 'w-11 h-5 sm:w-14 sm:h-7'
      : size === 'md'
      ? 'w-9 h-4.5'
      : 'w-6 h-3';
  const textClass =
    size === 'lg'
      ? 'text-3xl sm:text-4xl'
      : size === 'md'
      ? 'text-2xl'
      : 'text-lg';

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${
        size === 'lg' ? 'gap-0.5' : ''
      }`}
    >
      <svg viewBox="0 0 64 32" className={crownClass} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`crownGold-${size}`} x1="0" y1="0" x2="64" y2="32">
            <stop offset="0%" stopColor="#9E761A" />
            <stop offset="35%" stopColor="#E9CC6D" />
            <stop offset="65%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8E6714" />
          </linearGradient>
        </defs>
        <path
          d="M6 25L12 10L23 19L32 5L41 19L52 10L58 25H6Z"
          fill={`url(#crownGold-${size})`}
          stroke="#9E761A"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="4" r="2.4" fill="#F2D77E" stroke="#9E761A" strokeWidth="0.9" />
        <circle cx="11.5" cy="9" r="2" fill="#F2D77E" stroke="#9E761A" strokeWidth="0.9" />
        <circle cx="52.5" cy="9" r="2" fill="#F2D77E" stroke="#9E761A" strokeWidth="0.9" />
        <rect x="8" y="26.5" width="48" height="3" rx="1.5" fill={`url(#crownGold-${size})`} />
      </svg>
      <span
        className={`font-editorial font-bold tracking-[0.06em] leading-none text-gold-foil ${textClass}`}
      >
        {BRAND_INFO.monogram}
      </span>
    </div>
  );
};

export const NavbarAndTicker: React.FC<NavbarAndTickerProps> = ({
  cartCount,
  lastUpdated,
  worldSpot,
  onOpenCart,
  onOpenCustomRequest,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tickerItems = [
    {
      isWorldRef: true,
      label: 'Spot Emas Dunia (Referensi — BUKAN Harga Jual NJ)',
      value: `USD ${worldSpot.usdPerOz.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}/oz`,
      badge: 'Referensi Global',
    },
    {
      label: 'Semar Nusantara SMG 1g',
      value: formatIDR(SPOT_SUMMARY.semar1g),
      badge: `+${formatIDR(SPOT_SUMMARY.semar1gChange)}`,
    },
    {
      label: 'Buyback Semar Nusantara /g',
      value: formatIDR(SPOT_SUMMARY.semarBuybackPerGram),
      badge: 'Buyback Cepat Cair',
    },
    {
      label: 'ANTAM LM 1g (Opsi)',
      value: formatIDR(SPOT_SUMMARY.antam1g),
      badge: `+${formatIDR(SPOT_SUMMARY.antam1gChange)}`,
    },
    {
      label: 'Buyback ANTAM /g',
      value: formatIDR(SPOT_SUMMARY.antamBuybackPerGram),
      badge: 'CertiEye Resmi',
    },
    {
      label: 'Semar Jawa (Jawa Gold 0,5g)',
      value: formatIDR(SPOT_SUMMARY.semarJawa05g),
      badge: `Mulai ${formatIDR(SPOT_SUMMARY.semarJawaStartPrice)}`,
    },
    {
      label: 'Ismoyo (J5) Perhiasan 10K',
      value: `Mulai ${formatIDR(SPOT_SUMMARY.ismoyoStartPrice)}`,
      badge: 'Gerai Resmi Solo',
    },
    {
      label: 'Update terakhir',
      value: lastUpdated,
      badge: 'Gerai Solo • Bisa COD & Ambil di Rumah',
    },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* Soft Satin Pink Live Market Ticker (with World Spot Ref + NJ Rates + Official WA) */}
      <div className="bg-gradient-to-r from-[#F3DAD3] via-[#F9EDEA] to-[#F3DAD3] border-b border-[#E5C6BE] text-[#3D2C2C] overflow-hidden">
        <div className="flex items-center">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-[#B76E79] text-[#FFF9F7] shrink-0 z-10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7DF8D] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F7DF8D]" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase">
              Harga Live
            </span>
          </div>

          <div className="overflow-hidden py-1.5 flex-1">
            <div className="animate-ticker flex items-center gap-7 text-xs">
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 shrink-0">
                  {item.isWorldRef && (
                    <Globe className="w-3.5 h-3.5 text-[#8C4A55] shrink-0" />
                  )}
                  <span
                    className={
                      item.isWorldRef
                        ? 'text-[#8C4A55] font-bold'
                        : 'text-[#7A5C5C] font-medium'
                    }
                  >
                    {item.label}
                  </span>
                  <span className="font-mono font-bold text-[#3D2C2C] tabular-nums">
                    {item.value}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#8C4A55] bg-[#FFF9F7] border border-[#E6C7C0] px-2 py-0.5 rounded-full font-medium">
                    <TrendingUp className="w-3 h-3 text-[#C9A227]" />
                    {item.badge}
                  </span>
                  <span className="text-[#C9A227]/60 ml-1">✦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Visible Official WA Number in Top Header */}
          <a
            href={getWhatsAppUrl('Halo NJ, saya ingin tanya harga jual & beli emas hari ini.')}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF9F7] border-l border-[#E5C6BE] text-[#3D2C2C] hover:bg-[#F9EDEA] transition-colors shrink-0 z-10"
          >
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B76E79] text-[#FFF9F7] text-[10px] font-bold">
              <MessageCircle className="w-3 h-3 text-[#F7DF8D]" />
              Chat WA NJ
            </span>
            <span className="font-mono text-[11px] font-bold text-[#3D2C2C]">
              {BRAND_INFO.whatsappDisplay}
            </span>
          </a>
        </div>
      </div>

      {/* Main Ivory-Marble Navigation */}
      <nav
        className={`transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#FFF9F7]/96 backdrop-blur-md border-[#EAD3CC] shadow-[0_8px_28px_rgba(183,110,121,0.1)]'
            : 'bg-[#FFF9F7]/92 backdrop-blur-md border-[#F0DDD7]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-3 h-[64px] sm:h-[68px]">
            {/* Brand Logo: Crown + NJ */}
            <a
              href="#top"
              className="flex items-center gap-2 sm:gap-2.5 group min-w-0 shrink lg:shrink-0 min-h-[44px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-b from-[#FFF9F7] to-[#F9EDEA] border border-[#D4AF37]/55 flex items-center justify-center shadow-[0_4px_14px_rgba(201,162,39,0.16)] group-hover:border-[#C9A227] transition-all shrink-0">
                <CrownNJLogo size="sm" />
              </div>
              <div className="leading-none min-w-0">
                <div className="font-editorial text-[15px] sm:text-xl font-bold tracking-[0.03em] sm:tracking-[0.04em] text-[#3D2C2C] truncate">
                  NJ <span className="text-gold-foil">GOLD JASTIP</span>
                </div>
                <div className="hidden min-[360px]:block text-[9px] sm:text-[10px] uppercase tracking-[0.08em] sm:tracking-[0.14em] text-[#7A5C5C] font-medium mt-0.5 truncate">
                  Jual &amp; Beli Emas Amanah
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-[#5B4141] hover:text-[#B76E79] transition-colors whitespace-nowrap py-2 relative after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A227] hover:after:w-full after:transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={onOpenCustomRequest}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 min-h-[44px] rounded-full border border-[#B76E79]/60 bg-[#FFF9F7] text-[#8C4A55] text-xs font-semibold hover:bg-[#F9EDEA] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                Titip Custom
              </button>

              <button
                onClick={onOpenCart}
                aria-label="Buka Keranjang Titipan"
                className="relative inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 min-h-[44px] rounded-full btn-gold text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4 text-[#3D2C2C]" />
                <span className="hidden sm:inline">Keranjang</span>
                <span className="inline-flex items-center justify-center min-w-[20px] sm:min-w-[22px] h-[20px] sm:h-[22px] px-1 sm:px-1.5 rounded-full bg-[#3D2C2C] text-[#FFF9F7] font-mono text-[11px] font-bold">
                  {cartCount}
                </span>
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Buka Menu Navigasi"
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#F9EDEA] border border-[#E8CEC7] text-[#3D2C2C] hover:bg-[#F3DAD3] transition-colors cursor-pointer shrink-0"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#FFF9F7] border-t border-[#EAD3CC] px-4 pt-3 pb-5 space-y-1.5 shadow-[0_18px_40px_rgba(183,110,121,0.16)] max-h-[82vh] overflow-y-auto">
            <a
              href={getWhatsAppUrl('Halo NJ, saya ingin tanya layanan jastip jual & beli emas.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-2 px-4 min-h-[44px] rounded-2xl bg-[#F9EDEA] border border-[#E5C4BB] text-xs font-bold text-[#3D2C2C] mb-2"
            >
              <span className="inline-flex items-center gap-1.5 text-[#8C4A55]">
                <Phone className="w-3.5 h-3.5 text-[#B76E79]" />
                WA Resmi NJ
              </span>
              <span className="font-mono">{BRAND_INFO.whatsappDisplay}</span>
            </a>

            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center min-h-[44px] px-4 rounded-xl text-sm font-semibold text-[#3D2C2C] hover:bg-[#F9EDEA] hover:text-[#B76E79] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-[#F0DDD7] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenCustomRequest();
                }}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-full border border-[#B76E79] bg-[#F9EDEA] text-[#8C4A55] text-sm font-semibold cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                Titip Custom Perhiasan
              </button>
              <a
                href="#lokasi"
                onClick={() => setMobileOpen(false)}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-full btn-gold text-sm font-bold"
              >
                <MapPin className="w-4 h-4" />
                COD &amp; Lokasi Ambil di Rumah
              </a>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#7A5C5C] px-2">
              <ShieldCheck className="w-4 h-4 text-[#B76E79] shrink-0" />
              <span>100% Nota Resmi Semar Nusantara, Semar Jawa &amp; Ismoyo</span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
