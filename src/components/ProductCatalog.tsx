import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Plus,
  Check,
  X,
  ShieldCheck,
  Store,
  FileCheck2,
  Package,
  Banknote,
  MessageCircle,
  Clock,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Star,
  RotateCcw,
  Info,
} from 'lucide-react';
import {
  GoldProduct,
  BrandType,
  ItemCategory,
  KaratLevel,
  getPriceInquiryWaUrl,
  getPreorderWaUrl,
  getProductOrderWaUrl,
  formatProductPrice,
  getBrandVisualStyle,
  formatIDR,
} from '../data/goldData';

interface ProductCatalogProps {
  products: GoldProduct[];
  lastUpdated: string;
  activeBrand: 'ALL' | BrandType;
  onBrandChange: (brand: 'ALL' | BrandType) => void;
  onAddToCart: (product: GoldProduct) => void;
  onSellProduct: (
    brand: BrandType,
    weight: number,
    isJewelry?: boolean,
    karat?: '17K' | '10K'
  ) => void;
  onOpenCustomRequest: () => void;
}

const BRAND_FILTERS: { id: 'ALL' | BrandType; label: string }[] = [
  { id: 'ALL', label: 'Semua Brand' },
  { id: 'SEMAR_NUSANTARA', label: 'Semar Nusantara' },
  { id: 'SEMAR_JAWA', label: 'Semar Jawa' },
  { id: 'ISMOYO', label: 'Ismoyo (J5)' },
  { id: 'ANTAM', label: 'ANTAM (Opsi)' },
];

const ITEM_CATEGORY_FILTERS: ('ALL' | ItemCategory)[] = [
  'ALL',
  'Cincin',
  'Kalung',
  'Gelang',
  'Anting',
  'Liontin',
  'Logam Mulia',
];

const KARAT_FILTERS: ('ALL' | KaratLevel)[] = ['ALL', '10K', '17K', '24K'];

function resolveItemCategory(p: GoldProduct): ItemCategory {
  if (p.itemCategory) return p.itemCategory;
  const n = p.name.toLowerCase();
  if (n.includes('cincin')) return 'Cincin';
  if (n.includes('kalung')) return 'Kalung';
  if (n.includes('gelang') || n.includes('bangle')) return 'Gelang';
  if (n.includes('anting') || n.includes('giwang')) return 'Anting';
  if (n.includes('liontin') || n.includes('pendant')) return 'Liontin';
  return 'Logam Mulia';
}

function resolveKarat(p: GoldProduct): KaratLevel {
  if (p.karat) return p.karat;
  if (p.purity.includes('10K')) return '10K';
  if (p.purity.includes('17K')) return '17K';
  return '24K';
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  lastUpdated,
  activeBrand,
  onBrandChange,
  onAddToCart,
  onSellProduct,
  onOpenCustomRequest,
}) => {
  const [itemCategoryFilter, setItemCategoryFilter] = useState<'ALL' | ItemCategory>('ALL');
  const [karatFilter, setKaratFilter] = useState<'ALL' | KaratLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'bestseller' | 'price-asc' | 'price-desc'>('bestseller');
  const [selectedProduct, setSelectedProduct] = useState<GoldProduct | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: products.length };
    for (const p of products) {
      counts[p.brand] = (counts[p.brand] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (activeBrand !== 'ALL' && p.brand !== activeBrand) return false;
        const cat = resolveItemCategory(p);
        if (itemCategoryFilter !== 'ALL' && cat !== itemCategoryFilter) return false;
        const karat = resolveKarat(p);
        if (karatFilter !== 'ALL' && karat !== karatFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brandLabel.toLowerCase().includes(q) ||
            cat.toLowerCase().includes(q) ||
            karat.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          const pa = a.basePrice ?? Number.MAX_SAFE_INTEGER;
          const pb = b.basePrice ?? Number.MAX_SAFE_INTEGER;
          return pa - pb;
        }
        if (sortBy === 'price-desc') {
          const pa = a.priceMax ?? a.basePrice ?? -1;
          const pb = b.priceMax ?? b.basePrice ?? -1;
          return pb - pa;
        }
        // Default: Terlaris (interleaved showcase order across all 3 brands)
        const ra = a.popularityRank ?? 999;
        const rb = b.popularityRank ?? 999;
        if (ra !== rb) return ra - rb;
        return (b.isBestSeller || b.popular ? 1 : 0) - (a.isBestSeller || a.popular ? 1 : 0);
      });
  }, [products, activeBrand, itemCategoryFilter, karatFilter, searchQuery, sortBy]);

  const hasActiveFilter =
    activeBrand !== 'ALL' ||
    itemCategoryFilter !== 'ALL' ||
    karatFilter !== 'ALL' ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    onBrandChange('ALL');
    setItemCategoryFilter('ALL');
    setKaratFilter('ALL');
    setSearchQuery('');
    setSortBy('bestseller');
  };

  const handleAdd = (product: GoldProduct) => {
    if (product.stockStatus === 'Habis' || product.stock === 0 || product.basePrice === null) {
      return;
    }
    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  const handleSellClick = (product: GoldProduct) => {
    const itemCat = resolveItemCategory(product);
    const karat = resolveKarat(product);
    const isJewelry = itemCat !== 'Logam Mulia';
    onSellProduct(product.brand, product.weightGrams, isJewelry, karat === '10K' ? '10K' : '17K');
  };

  const openDetailModal = (product: GoldProduct) => {
    setSelectedProduct(product);
    setIsImageZoomed(false);
  };

  const renderImageCornerBadge = (product: GoldProduct) => {
    if (product.stockStatus === 'Habis' || (product.stock === 0 && product.stockStatus !== 'Pre-order')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6B6262]/92 text-white text-[9.5px] sm:text-[10px] font-bold shadow-sm backdrop-blur-sm">
          Habis
        </span>
      );
    }
    if (product.isBestSeller) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B5891C] text-[#2A1B0C] text-[9.5px] sm:text-[10px] font-extrabold shadow-sm">
          <Star className="w-2.5 h-2.5 fill-current" />
          Best Seller
        </span>
      );
    }
    if (product.stockStatus === 'Pre-order') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B76E79]/92 text-[#FFF9F7] text-[9.5px] sm:text-[10px] font-bold shadow-sm">
          Pre-order
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1E6E4B]/92 text-white text-[9.5px] sm:text-[10px] font-bold shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7DF2BA]" />
        Ready
      </span>
    );
  };

  const renderStockText = (product: GoldProduct) => {
    if (product.stockStatus === 'Habis') {
      return <span className="text-[#8B3A46] font-bold">Habis</span>;
    }
    if (product.stockStatus === 'Pre-order') {
      return <span className="text-[#8C4A55] font-semibold">{product.stockLabel ?? 'Pre-order'}</span>;
    }
    return (
      <span className="text-[#1E6346] font-semibold">
        {product.stockLabel ?? `Ready • Stok ${product.stock}`}
      </span>
    );
  };

  const renderProductVisual = (
    product: GoldProduct,
    imgClassName: string,
    eager = false
  ) => {
    if (product.imageFallback && product.image.endsWith('.webp')) {
      return (
        <picture>
          <source srcSet={product.image} type="image/webp" />
          <img
            src={product.imageFallback}
            alt={`${product.brandLabel} — ${product.name}`}
            loading={eager ? 'eager' : 'lazy'}
            className={imgClassName}
          />
        </picture>
      );
    }
    return (
      <img
        src={product.image}
        alt={`${product.brandLabel} — ${product.name}`}
        loading={eager ? 'eager' : 'lazy'}
        className={imgClassName}
      />
    );
  };

  return (
    <section
      id="katalog"
      className="scroll-mt-24 py-14 sm:py-20 lg:py-24 bg-[#F9EDEA] border-b border-[#E9CFC8]"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Header + Live Update Timestamp */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
              Katalog Produk Resmi 3 Brand Utama
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3D2C2C] mt-1.5 leading-[1.12]">
              Koleksi{' '}
              <span className="italic text-gold-foil">
                Semar Nusantara, Semar Jawa &amp; Ismoyo (J5)
              </span>
            </h2>
            <p className="text-xs sm:text-base text-[#7A5C5C] mt-2.5 leading-relaxed">
              Pilih perhiasan 10K/17K maupun logam mulia 24K dari etalase resmi 3 brand pilihan.
              Tanpa daftar akun — langsung tambah ke keranjang atau konfirmasi via WA NJ.
            </p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-full bg-[#FFF9F7] border border-[#E5C4BB] text-[11px] text-[#6E5050]">
              <Clock className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
              <span>
                Update terakhir: <strong className="text-[#3D2C2C]">{lastUpdated}</strong> •{' '}
                <strong className="text-[#8C4A55]">{products.length} Produk</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onOpenCustomRequest}
            className="inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-full bg-[#FFF9F7] border-2 border-[#B76E79] text-[#8C4A55] text-xs sm:text-sm font-bold hover:bg-[#F3DAD3] transition-all shadow-sm self-start lg:self-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            Titip Custom Model Perhiasan
          </button>
        </div>

        {/* Filter Panel — Compact & Horizontally Scrollable on Mobile */}
        <div className="space-y-3 mb-6 sm:mb-8">
          {/* 1. Brand Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {BRAND_FILTERS.map((b) => {
              const active = activeBrand === b.id;
              const count = brandCounts[b.id] ?? 0;
              return (
                <button
                  key={b.id}
                  onClick={() => onBrandChange(b.id)}
                  className={`shrink-0 px-3.5 sm:px-4 min-h-[40px] sm:min-h-[42px] rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    active
                      ? 'btn-gold'
                      : 'bg-[#FFF9F7] text-[#5B4040] border border-[#E5C5BB] hover:border-[#B76E79]'
                  }`}
                >
                  {b.id !== 'ALL' && !active && (
                    <span
                      className={`w-2 h-2 rounded-full ${getBrandVisualStyle(b.id).accentDot}`}
                    />
                  )}
                  <span>{b.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      active ? 'bg-[#3D2C2C]/15 text-[#2F1D0C]' : 'bg-[#F3DAD3]/80 text-[#7A5C5C]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Item Category Filter Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ITEM_CATEGORY_FILTERS.map((cat) => {
              const active = itemCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setItemCategoryFilter(cat)}
                  className={`shrink-0 px-3 sm:px-3.5 min-h-[36px] rounded-full text-[11.5px] sm:text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#B76E79] text-[#FFF9F7] shadow-sm'
                      : 'bg-[#FFF9F7]/90 text-[#6E5050] border border-[#EAD0C7] hover:border-[#B76E79]'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua Kategori' : cat}
                </button>
              );
            })}
          </div>

          {/* 3. Search + Karat + Sort Compact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-[#FFF9F7] p-3 rounded-2xl sm:rounded-3xl border border-[#E9CFC8] shadow-[0_6px_20px_rgba(183,110,121,0.08)]">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari model: Claretta, Pinzy, Rosèe, Velora, Lenora, SMG..."
                aria-label="Cari produk emas"
                className="w-full min-h-[42px] pl-10 pr-9 py-2 rounded-xl sm:rounded-2xl bg-[#F9EDEA]/65 border border-[#ECD5CE] text-xs sm:text-sm text-[#3D2C2C] placeholder:text-[#9D7F7F] focus:outline-none focus:border-[#C9A227]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#8C6E6E] hover:text-[#3D2C2C] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:col-span-6 gap-2.5">
              <select
                value={karatFilter}
                onChange={(e) => setKaratFilter(e.target.value as 'ALL' | KaratLevel)}
                aria-label="Filter kadar emas"
                className="w-full min-h-[42px] px-3 py-2 rounded-xl sm:rounded-2xl bg-[#F9EDEA]/65 border border-[#ECD5CE] text-xs sm:text-sm font-semibold text-[#3D2C2C] focus:outline-none focus:border-[#C9A227]"
              >
                {KARAT_FILTERS.map((k) => (
                  <option key={k} value={k}>
                    {k === 'ALL' ? 'Semua Kadar' : `Kadar ${k}`}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Urutkan produk"
                className="w-full min-h-[42px] px-3 py-2 rounded-xl sm:rounded-2xl bg-[#F9EDEA]/65 border border-[#ECD5CE] text-xs sm:text-sm font-semibold text-[#3D2C2C] focus:outline-none focus:border-[#C9A227]"
              >
                <option value="bestseller">Urutkan: Terlaris</option>
                <option value="price-asc">Harga Termurah</option>
                <option value="price-desc">Harga Termahal</option>
              </select>
            </div>
          </div>

          {/* Active Filter Status Bar */}
          <div className="flex items-center justify-between gap-2 text-[11.5px] sm:text-xs text-[#6E5050] px-1">
            <span>
              Menampilkan <strong className="text-[#3D2C2C]">{filteredProducts.length}</strong> dari{' '}
              {products.length} produk resmi
            </span>
            {hasActiveFilter && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-bold text-[#B76E79] hover:text-[#7B1E2B] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Products Grid: 1-col on 320-360px, 2-col on 380px+, 3-col lg, 4-col xl */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-14 bg-[#FFF9F7] rounded-3xl border border-[#E9CFC8] px-4">
            <p className="font-editorial text-2xl font-bold text-[#3D2C2C]">
              Produk tidak ditemukan untuk filter ini
            </p>
            <p className="text-xs sm:text-sm text-[#7A5C5C] mt-1.5">
              Coba kata kunci lain atau klik tombol Titip Custom untuk model yang Anda inginkan.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 min-h-[44px] rounded-full btn-gold text-xs font-bold cursor-pointer"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map((product) => {
              const isAdded = justAddedId === product.id;
              const isHabis = product.stockStatus === 'Habis';
              const isPreOrder = product.stockStatus === 'Pre-order';
              const canAddToCart =
                product.stockStatus === 'Ready' &&
                product.stock > 0 &&
                product.basePrice !== null;

              const brandStyle = getBrandVisualStyle(product.brand);
              const karat = resolveKarat(product);
              const itemCat = resolveItemCategory(product);
              const weightText = product.weightDisplay ?? `${product.weightGrams} gram`;
              const priceDisplay = formatProductPrice(product);

              return (
                <article
                  key={product.id}
                  className={`group bg-[#FFF9F7] rounded-2xl sm:rounded-3xl border overflow-hidden flex flex-col transition-all duration-300 ${
                    isHabis
                      ? 'border-[#E6CFCF] opacity-90'
                      : 'border-[#E8CEC7] hover:border-[#C9A227] hover:shadow-[0_14px_34px_rgba(183,110,121,0.16)]'
                  }`}
                >
                  {/* 1:1 Square Studio Image */}
                  <div
                    onClick={() => openDetailModal(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openDetailModal(product);
                      }
                    }}
                    aria-label={`Lihat detail ${product.name}`}
                    className="relative aspect-square w-full overflow-hidden bg-[#FFF9F7] border-b border-[#F1DDD6] cursor-pointer"
                  >
                    {renderProductVisual(
                      product,
                      `w-full h-full object-cover transition-transform duration-500 ${
                        isHabis ? 'grayscale-[45%] opacity-85' : 'group-hover:scale-105'
                      }`
                    )}

                    {/* Top-Left & Top-Right Non-Overlapping Corner Badges */}
                    <div className="absolute top-2 left-2 right-2 z-10 flex items-start justify-between gap-1 pointer-events-none">
                      <span
                        className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wide max-w-[62%] truncate ${brandStyle.solidBadge}`}
                      >
                        {brandStyle.shortUpper}
                      </span>
                      <div className="shrink-0">{renderImageCornerBadge(product)}</div>
                    </div>
                  </div>

                  {/* Card Body: Brand -> Name -> Kadar • Berat -> Price -> Buyback -> Stock -> 2 Buttons */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    {/* Prominent Brand Label + Item Category Above Product Name */}
                    <div className="mb-1.5 flex items-center justify-between gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-[11px] font-extrabold uppercase tracking-wide truncate ${brandStyle.softTag}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${brandStyle.accentDot}`} />
                        {brandStyle.shortUpper}
                      </span>
                      <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-[#8A6D6D] shrink-0">
                        {itemCat}
                      </span>
                    </div>

                    {/* Product Name */}
                    <button
                      type="button"
                      onClick={() => openDetailModal(product)}
                      className="text-left font-editorial text-[15px] sm:text-[17px] leading-snug font-bold text-[#3D2C2C] hover:text-[#9C7418] transition-colors line-clamp-2 min-h-[2.55em] cursor-pointer"
                    >
                      {product.name}
                    </button>

                    {/* Kadar • Berat */}
                    <div className="mt-1 text-[11px] sm:text-xs font-semibold text-[#7A5C5C]">
                      <span className="text-[#8C4A55] font-bold">{karat}</span> • {weightText}
                    </div>

                    {/* Large Price */}
                    <div className="mt-2.5 pt-2 border-t border-[#F2DFD9]">
                      <div
                        className={`font-mono font-bold tabular-nums leading-snug ${
                          product.basePrice === null
                            ? 'font-editorial text-base sm:text-lg text-[#8C4A55]'
                            : product.priceMax
                            ? 'text-[13px] sm:text-[14.5px] text-[#3D2C2C]'
                            : 'text-[15px] sm:text-[17px] text-[#3D2C2C]'
                        }`}
                      >
                        {priceDisplay}
                      </div>

                      {/* Buyback Small Line */}
                      <div className="mt-1 flex items-center justify-between gap-1 text-[10.5px] sm:text-[11px] text-[#7A5C5C]">
                        <span className="truncate">
                          Buyback:{' '}
                          <strong className="text-[#8C4A55] font-mono">
                            {product.buybackEstimate !== null
                              ? formatIDR(product.buybackEstimate)
                              : 'Tanya WA'}
                          </strong>
                        </span>
                      </div>

                      {/* Stock Line */}
                      <div className="mt-0.5 text-[10.5px] sm:text-[11px] text-[#7A5C5C] truncate">
                        Stok: {renderStockText(product)}
                      </div>
                    </div>

                    {/* 2 Action Buttons: + Keranjang (or Tanya WA) & Titip Jual */}
                    <div className="mt-3 pt-1 grid grid-cols-2 min-[380px]:grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 mt-auto">
                      {canAddToCart ? (
                        <button
                          onClick={() => handleAdd(product)}
                          className={`min-h-[40px] px-2.5 rounded-full text-[11.5px] sm:text-xs font-bold transition-all inline-flex items-center justify-center gap-1 cursor-pointer ${
                            isAdded ? 'bg-[#B76E79] text-[#FFF9F7]' : 'btn-gold'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 shrink-0" /> Masuk
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 shrink-0" /> Keranjang
                            </>
                          )}
                        </button>
                      ) : (
                        <a
                          href={
                            isHabis || isPreOrder
                              ? getPreorderWaUrl(
                                  product.brandLabel,
                                  product.name,
                                  product.stockStatus
                                )
                              : getPriceInquiryWaUrl(product.brandLabel, product.name)
                          }
                          target="_blank"
                          rel="noreferrer"
                          className={`min-h-[40px] px-2.5 rounded-full text-[11.5px] sm:text-xs font-bold transition-all inline-flex items-center justify-center gap-1 ${
                            isHabis
                              ? 'bg-[#ECE4E4] border border-[#D4C4C4] text-[#6E5C5C] hover:bg-[#E2D6D6]'
                              : 'btn-gold'
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Tanya WA</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleSellClick(product)}
                        className="min-h-[40px] px-2.5 rounded-full bg-[#FFF9F7] border border-[#B76E79] text-[#8C4A55] text-[11.5px] sm:text-xs font-bold hover:bg-[#F9EDEA] transition-all inline-flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Banknote className="w-3.5 h-3.5 shrink-0" />
                        <span>Titip Jual</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Required Official Price Disclaimer Below Catalog */}
        <div className="mt-7 p-4 rounded-2xl bg-[#FFF9F7] border border-[#E6C9BF] flex items-start gap-2.5 text-xs sm:text-[13px] text-[#6E5050] leading-relaxed shadow-sm">
          <Info className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#3D2C2C]">Catatan Harga:</strong> Harga mengikuti harga resmi
            toko. Harga dapat berubah mengikuti pasaran. Harga final dikonfirmasi via WA NJ.
          </p>
        </div>

        {/* Custom Personal Shopper Banner */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-[#FFF9F7] via-[#F9EDEA] to-[#F3DAD3] border border-[#E3BFB5] p-6 sm:p-8 text-[#3D2C2C] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[0_14px_38px_rgba(183,110,121,0.12)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#B76E79] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              Personal Shopper Perhiasan NJ
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold mt-1.5">
              Mengincar Model Lain dari Semar Nusantara, Semar Jawa, atau Ismoyo (J5)?
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5050] mt-2 leading-relaxed">
              Kirimkan nama model, ukuran cincin/gelang, kadar (10K / 17K), serta budget Anda.
              Tim kami akan mencarikan langsung di etalase gerai resmi dan mengirim foto
              timbangan digital sebelum dibayarkan. Refund 100% jika berat riil lebih ringan!
            </p>
          </div>
          <button
            onClick={onOpenCustomRequest}
            className="shrink-0 w-full sm:w-auto px-6 min-h-[48px] rounded-full btn-gold font-bold text-sm transition-all cursor-pointer"
          >
            Buat Request Custom Perhiasan
          </button>
        </div>
      </div>

      {/* Product Detail Modal with Zoomable 1:1 Image & Official Store Link */}
      {selectedProduct && (() => {
        const brandStyle = getBrandVisualStyle(selectedProduct.brand);
        const karat = resolveKarat(selectedProduct);
        const itemCat = resolveItemCategory(selectedProduct);
        const weightText = selectedProduct.weightDisplay ?? `${selectedProduct.weightGrams} gram`;
        const priceDisplay = formatProductPrice(selectedProduct);
        const canAddModal =
          selectedProduct.stockStatus === 'Ready' &&
          selectedProduct.stock > 0 &&
          selectedProduct.basePrice !== null;

        return (
          <div
            className="fixed inset-0 z-50 bg-[#3D2C2C]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-[#FFF9F7] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#E5C4BB] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Zoomable 1:1 Product Showcase */}
              <div className="relative bg-[#F9EDEA] border-b border-[#ECD4CC]">
                <div
                  onClick={() => setIsImageZoomed((z) => !z)}
                  className="relative max-h-[380px] sm:max-h-[420px] aspect-square mx-auto overflow-hidden cursor-zoom-in"
                >
                  {renderProductVisual(
                    selectedProduct,
                    `w-full h-full object-cover transition-transform duration-300 ${
                      isImageZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
                    }`,
                    true
                  )}
                </div>

                {/* Top Controls */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <span
                    className={`pointer-events-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${brandStyle.solidBadge}`}
                  >
                    {brandStyle.shortUpper}
                  </span>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => setIsImageZoomed((z) => !z)}
                      aria-label={isImageZoomed ? 'Perkecil gambar' : 'Perbesar gambar'}
                      className="h-9 px-3 rounded-full bg-[#FFF9F7]/92 text-[#3D2C2C] text-xs font-bold flex items-center gap-1 hover:bg-white shadow cursor-pointer"
                    >
                      {isImageZoomed ? (
                        <>
                          <ZoomOut className="w-4 h-4" /> Normal
                        </>
                      ) : (
                        <>
                          <ZoomIn className="w-4 h-4" /> Zoom
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      aria-label="Tutup detail produk"
                      className="w-9 h-9 rounded-full bg-[#FFF9F7]/92 text-[#3D2C2C] flex items-center justify-center hover:bg-white shadow cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-[#FFF9F7]/95 text-[#3D2C2C] text-[11px] font-bold border border-[#D4AF37]/50 shadow-sm">
                    {itemCat} • {karat} • {weightText}
                  </span>
                  {renderImageCornerBadge(selectedProduct)}
                </div>
              </div>

              <div className="p-5 sm:p-7 space-y-5">
                {/* Brand + Title + Description */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${brandStyle.softTag}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${brandStyle.accentDot}`} />
                      Brand: {selectedProduct.brandLabel}
                    </span>
                    <span className="text-[11px] font-mono text-[#8A6D6D]">
                      SKU: {selectedProduct.sku}
                    </span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#3D2C2C] mt-2 leading-snug">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E5050] mt-2 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Key Price / Kadar / Weight / Buyback / Stock Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-[#F9EDEA]/80 border border-[#ECD5CE]">
                    <div className="text-[10.5px] text-[#7A5C5C]">Kadar</div>
                    <div className="font-bold text-[#3D2C2C] mt-0.5">{karat}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F9EDEA]/80 border border-[#ECD5CE]">
                    <div className="text-[10.5px] text-[#7A5C5C]">Berat</div>
                    <div className="font-bold text-[#3D2C2C] mt-0.5">{weightText}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F9EDEA]/80 border border-[#ECD5CE] col-span-2 sm:col-span-1">
                    <div className="text-[10.5px] text-[#7A5C5C]">Status Stok</div>
                    <div className="mt-0.5">{renderStockText(selectedProduct)}</div>
                  </div>
                </div>

                {/* Store Details */}
                <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE] flex items-start gap-2.5">
                    <Store className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[#7A5C5C]">Sumber Pembelian</div>
                      <div className="font-bold text-[#3D2C2C] mt-0.5">
                        {selectedProduct.originStore}
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE] flex items-start gap-2.5">
                    <FileCheck2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[#7A5C5C]">Surat &amp; Sertifikat</div>
                      <div className="font-bold text-[#3D2C2C] mt-0.5">
                        {selectedProduct.certificate}
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE] flex items-start gap-2.5">
                    <Package className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[#7A5C5C]">Kemasan Resmi</div>
                      <div className="font-bold text-[#3D2C2C] mt-0.5">
                        {selectedProduct.packaging}
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE] flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[#7A5C5C]">Transparansi Harga</div>
                      <div className="font-bold text-[#3D2C2C] mt-0.5">
                        0% Markup • Fee Jastip +{formatIDR(selectedProduct.jastipFee)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specs List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A5C5C] mb-2">
                    Keunggulan &amp; Kelengkapan
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#3D2C2C]">
                    {selectedProduct.specs.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Official Store Reference Link */}
                {selectedProduct.sourceUrl && (
                  <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-[#F9EDEA]/60 border border-[#ECD4CC] text-xs">
                    <span className="text-[#6E5050]">Referensi katalog resmi brand:</span>
                    <a
                      href={selectedProduct.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#8C4A55] hover:text-[#7B1E2B] underline"
                    >
                      <span>Lihat di toko resmi</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Modal Price & Action Bar */}
                <div className="p-4 rounded-2xl bg-blush-silk border border-[#E5C4BB] space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <div className="text-[11px] text-[#7A5C5C]">Harga Referensi Resmi</div>
                      <div className="font-mono text-lg sm:text-xl font-bold text-[#3D2C2C] tabular-nums">
                        {priceDisplay}
                      </div>
                    </div>
                    <div className="text-xs text-[#6E5050]">
                      Buyback:{' '}
                      <strong className="font-mono text-[#8C4A55]">
                        {selectedProduct.buybackEstimate !== null
                          ? formatIDR(selectedProduct.buybackEstimate)
                          : 'Tanya WA'}
                      </strong>{' '}
                      • Fee{' '}
                      <strong className="font-mono text-[#9C7418]">
                        +{formatIDR(selectedProduct.jastipFee)}
                      </strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {canAddModal && (
                      <button
                        onClick={() => {
                          handleAdd(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 min-h-[46px] px-5 rounded-full btn-gold font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        + Keranjang
                      </button>
                    )}

                    <a
                      href={getProductOrderWaUrl(selectedProduct)}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex-1 min-h-[46px] px-5 rounded-full font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 ${
                        canAddModal
                          ? 'bg-[#B76E79] text-[#FFF9F7] hover:brightness-105'
                          : 'btn-gold'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {selectedProduct.stockStatus === 'Habis'
                        ? 'Tanya Restock via WA'
                        : 'Pesan via WA'}
                    </a>

                    <button
                      onClick={() => {
                        const p = selectedProduct;
                        setSelectedProduct(null);
                        handleSellClick(p);
                      }}
                      className="min-h-[46px] px-4 rounded-full bg-[#FFF9F7] border border-[#B76E79] text-[#8C4A55] font-bold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-[#F9EDEA] cursor-pointer"
                    >
                      <Banknote className="w-4 h-4" />
                      Titip Jual
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};
