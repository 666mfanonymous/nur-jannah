import {
  WA_NUMBER,
  WA_DISPLAY,
  WA_LINK,
  MAPS_LINK,
  MAPS_EMBED_URL,
  LOCATION_PIN_NAME,
  LOCATION_ADDRESS,
  LOCATION_LAT,
  LOCATION_LNG,
  PRICES_JSON_URL,
  MEMBERS_JSON_URL,
} from '../config';

export type BrandType = 'SEMAR_NUSANTARA' | 'SEMAR_JAWA' | 'ISMOYO' | 'ANTAM';

export type ProductCategory =
  | 'Semar Nusantara'
  | 'Semar Jawa'
  | 'Ismoyo (J5)'
  | 'Perhiasan 17K & 10K'
  | 'ANTAM (Opsi Tambahan)';

export type ItemCategory =
  | 'Cincin'
  | 'Kalung'
  | 'Gelang'
  | 'Anting'
  | 'Liontin'
  | 'Logam Mulia';

export type KaratLevel = '10K' | '17K' | '24K';

export type StockStatus = 'Ready' | 'Pre-order' | 'Habis';

export type OrderMethod = 'COD' | 'Ambil di Rumah' | 'Kirim';

export type Order = {
  id: string;
  tanggal: string;
  nama: string;
  waPelanggan: string;
  metode: OrderMethod;
  alamat?: string;
  jadwal?: string;
  items: {
    brand: string;
    produk: string;
    gram: number;
    qty: number;
    harga: number;
  }[];
  feeJastip: number;
  total: number;
  catatan?: string;
};

export interface PriceJsonItem {
  id: string;
  brand: string;
  produk: string;
  gram: number;
  hargaBeli: number | null;
  hargaBeliMax?: number | null;
  buyback: number | null;
  feeJastip: number;
  stok: number;
  status: StockStatus;
  stockLabel?: string;
}

export interface WorldSpotRef {
  usdPerOz: number;
  idrPerGram: number;
  label: string;
  isLiveApi?: boolean;
}

export interface PricesPayload {
  updatedAt: string;
  worldSpotRef: WorldSpotRef;
  brandBuyback: Record<string, number | null>;
  items: PriceJsonItem[];
}

export interface GoldProduct {
  id: string;
  sku: string;
  name: string;
  brand: BrandType;
  brandLabel: string;
  category: ProductCategory;
  itemCategory?: ItemCategory;
  karat?: KaratLevel;
  purity: string;
  weightGrams: number;
  weightDisplay?: string;
  basePrice: number | null; // null = Tanya WA; if priceMax present, this is starting price
  priceMax?: number | null; // exact upper price for official multi-size/weight ranges
  buybackEstimate: number | null; // null = Tanya WA
  jastipFee: number;
  taxApplicable: boolean;
  stock: number;
  stockStatus: StockStatus;
  stockLabel?: string;
  badge?: string;
  isBestSeller?: boolean;
  popularityRank?: number;
  image: string;
  imageFallback?: string;
  galleryImages?: string[];
  sourceUrl?: string;
  sourceName?: string;
  originStore: string;
  packaging: string;
  certificate: string;
  description: string;
  specs: string[];
  popular?: boolean;
}

export interface PriceRow {
  weight: number;
  label: string;
  semarNusantaraPrice?: number | null;
  semarNusantaraFee?: number;
  semarJawaPrice?: number | null;
  semarJawaFee?: number;
  ismoyoPrice?: number | null;
  ismoyoFee?: number;
  antamPrice?: number | null;
  antamFee?: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  shortLabel: string;
  methodKey: OrderMethod;
  courier: string;
  eta: string;
  baseCost: number;
  woodenCrateFee: number;
  insuranceRate: number;
  coverage: string;
  isPickupOrCod?: boolean;
  recommended?: boolean;
}

export interface BoutiqueLocation {
  id: string;
  brand: BrandType;
  brandLabel: string;
  city: string;
  branchName: string;
  address: string;
  runnerSchedule: string;
  status: 'Runner Standby' | 'Jadwal Rutin';
}

export interface RunnerScheduleItem {
  day: string;
  time: string;
  brand: BrandType;
  brandLabel: string;
  activity: string;
  branch: string;
  slotsTotal: number;
  slotsLeft: number;
  type: 'Belanja Gerai' | 'Live Shopping';
}

export interface TrackingOrder {
  orderId: string;
  customerName: string;
  city: string;
  brand: BrandType;
  brandLabel: string;
  transactionType: 'Beli' | 'Jual';
  itemsSummary: string;
  totalValue: number;
  branchSource: string;
  runnerName: string;
  receiptNo: string;
  certiCode?: string;
  courierName: string;
  resiNumber: string;
  insurancePolicy: string;
  currentStep: number;
  steps: {
    title: string;
    timestamp: string;
    detail: string;
    completed: boolean;
  }[];
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  verifiedDate: string;
  brand: BrandType;
  brandLabel: string;
  itemPurchased: string;
  rating: number;
  quote: string;
  proofTag: string;
}

export interface FaqItem {
  category: 'Keaslian & Surat' | 'Jual & Beli' | 'COD & Pengiriman' | 'Biaya & Pajak';
  question: string;
  answer: string;
}

// =========================================================================
// KONTAK RESMI & LOKASI NJ (BERSUMBER DARI src/config.ts)
// =========================================================================
export const BRAND_INFO = {
  monogram: 'NJ',
  headline: 'JASTIP JUAL & BELI EMAS',
  subHeadline: 'SEMAR NUSANTARA | SEMAR JAWA | ISMOYO',
  tagline: 'EMAS BERKUALITAS, INVESTASI BERKELAS',
  footerTagline: 'PERCAYA, MUDAH, AMANAH',
  whatsappNumber: WA_NUMBER,
  whatsappDisplay: WA_DISPLAY,
  whatsappBaseUrl: WA_LINK,
  locationPinName: LOCATION_PIN_NAME,
  locationAddress: LOCATION_ADDRESS,
  locationLat: LOCATION_LAT,
  locationLng: LOCATION_LNG,
  googleMapsUrl: MAPS_LINK,
  googleMapsEmbedUrl: MAPS_EMBED_URL,
};

export const getWhatsAppUrl = (message: string): string => {
  return `${WA_LINK}?text=${encodeURIComponent(message)}`;
};

export const getPriceInquiryWaUrl = (brandName: string, detail?: string): string => {
  const suffix = detail ? ` (${detail})` : '';
  return getWhatsAppUrl(
    `Halo NJ, mohon info harga beli & buyback resmi hari ini untuk emas ${brandName}${suffix}. Terima kasih.`
  );
};

export const getPreorderWaUrl = (
  brandName: string,
  productName: string,
  status: StockStatus
): string => {
  return getWhatsAppUrl(
    `Halo NJ, saya tertarik dengan produk ini:\n• Brand: ${brandName}\n• Produk: ${productName}\n• Status: ${status}\nMohon info stok, berat tersedia & harga resmi hari ini. Terima kasih.`
  );
};

export const formatProductPrice = (product: Pick<GoldProduct, 'basePrice' | 'priceMax'>): string => {
  if (product.basePrice === null) return 'Tanya WA';
  if (product.priceMax && product.priceMax > product.basePrice) {
    return `${formatIDR(product.basePrice)} – ${formatIDR(product.priceMax)}`;
  }
  return formatIDR(product.basePrice);
};

export const getProductOrderWaUrl = (product: GoldProduct): string => {
  const karatText = product.karat ?? (product.purity.includes('10K') ? '10K' : product.purity.includes('17K') ? '17K' : '24K');
  const weightText = product.weightDisplay ?? `${product.weightGrams} gram`;
  const priceText = formatProductPrice(product);
  return getWhatsAppUrl(
    `Halo NJ, saya mau pesan / tanya produk ini:\n• Brand: ${product.brandLabel}\n• Produk: ${product.name}\n• Kadar & Berat: ${karatText} • ${weightText}\n• Harga Referensi: ${priceText}\n• Fee Jastip Flat: ${formatIDR(product.jastipFee)}\nMohon konfirmasi stok & harga final hari ini. Terima kasih.`
  );
};

export const getBrandVisualStyle = (brand: BrandType) => {
  if (brand === 'ISMOYO') {
    return {
      shortUpper: 'ISMOYO (J5)',
      solidBadge: 'bg-[#7B1E2B] text-[#FFF4D2] border border-[#E7C86B]/70 shadow-sm',
      softTag: 'bg-[#7B1E2B]/10 text-[#7B1E2B] border border-[#7B1E2B]/35',
      accentDot: 'bg-[#7B1E2B]',
    };
  }
  if (brand === 'SEMAR_JAWA') {
    return {
      shortUpper: 'SEMAR JAWA',
      solidBadge: 'bg-[#7A4A21] text-[#FFF9F7] border border-[#F2D77E]/65 shadow-sm',
      softTag: 'bg-[#7A4A21]/10 text-[#7A4A21] border border-[#7A4A21]/35',
      accentDot: 'bg-[#7A4A21]',
    };
  }
  if (brand === 'ANTAM') {
    return {
      shortUpper: 'ANTAM LM',
      solidBadge: 'bg-[#5B4310] text-[#FCEB9D] border border-[#D4AF37]/70 shadow-sm',
      softTag: 'bg-[#5B4310]/10 text-[#5B4310] border border-[#5B4310]/35',
      accentDot: 'bg-[#5B4310]',
    };
  }
  return {
    shortUpper: 'SEMAR NUSANTARA',
    solidBadge: 'bg-[#9C7418] text-[#FFF9F7] border border-[#F7E093]/75 shadow-sm',
    softTag: 'bg-[#C9A227]/15 text-[#7A590C] border border-[#C9A227]/45',
    accentDot: 'bg-[#C9A227]',
  };
};

export const LAST_UPDATED = '25 Nov 2026 08:30 WIB';

export const DEFAULT_WORLD_SPOT: WorldSpotRef = {
  usdPerOz: 2642.5,
  idrPerGram: 1354000,
  label: 'Referensi Pasar Dunia (XAU/USD)',
};

// =========================================================================
// DATA HARGA RESMI TERKINI (BERSUMBER LANGSUNG DARI TOKO RESMI)
// Edit harga utama cukup di public/prices.json!
// =========================================================================
export const SEMAR_NUSANTARA_RATES = {
  buybackPerGram: 2149000,
  bars: {
    0.1: 275870,
    0.5: 1267630,
    1: 2257000,
    2: 4424000,
    3: 6636000,
    5: 10955000,
    10: 21710000,
    25: 53750000,
  },
};

export const ANTAM_RATES = {
  buybackPerGram: 2150000,
  bars: {
    0.5: 1303500,
    1: 2507000,
    2: 4964000,
    3: 7428000,
    5: 12350000,
    10: 24620000,
    25: 61385000,
    50: 122605000,
    100: 245060000,
  },
};

// Semar Jawa: harga resmi pecahan yang tersedia di Tokopedia resmi Toko Mas Jawa; lainnya null -> Tanya WA
export const SEMAR_JAWA_RATES: {
  buybackPerGram: number | null;
  bars: Record<number, number | null>;
} = {
  buybackPerGram: null,
  bars: {
    0.1: 337000,
    0.5: 1500000,
    1: null,
    2: null,
    5: 13415000,
    10: null,
    25: null,
  },
};

export const ISMOYO_RATES: {
  buybackPerGram: number | null;
  bars: Record<number, number | null>;
} = {
  buybackPerGram: null,
  bars: {
    0.5: null,
    1: null,
    2: null,
    5: null,
    10: null,
    25: null,
  },
};

export const SPOT_SUMMARY = {
  semar1g: SEMAR_NUSANTARA_RATES.bars[1],
  semar1gChange: +14000,
  semarBuybackPerGram: SEMAR_NUSANTARA_RATES.buybackPerGram,

  semarJawa1g: SEMAR_JAWA_RATES.bars[1],
  semarJawa05g: SEMAR_JAWA_RATES.bars[0.5] ?? 1500000,
  semarJawaStartPrice: SEMAR_JAWA_RATES.bars[0.1] ?? 337000,
  semarJawaBuybackPerGram: SEMAR_JAWA_RATES.buybackPerGram,

  ismoyo1g: ISMOYO_RATES.bars[1],
  ismoyoStartPrice: 317000,
  ismoyoBuybackPerGram: ISMOYO_RATES.buybackPerGram,

  antam1g: ANTAM_RATES.bars[1],
  antam1gChange: +18000,
  antamBuybackPerGram: ANTAM_RATES.buybackPerGram,
};

export const HISTORICAL_PRICES = {
  '7D': {
    labels: ['19 Nov', '20 Nov', '21 Nov', '22 Nov', '23 Nov', '24 Nov', '25 Nov'],
    semar: [2201000, 2212000, 2220000, 2216000, 2231000, 2243000, 2257000],
    antam: [2445000, 2458000, 2469000, 2462000, 2478000, 2489000, 2507000],
  },
  '30D': {
    labels: ['27 Okt', '1 Nov', '6 Nov', '11 Nov', '16 Nov', '21 Nov', '25 Nov'],
    semar: [2138000, 2152000, 2174000, 2165000, 2196000, 2220000, 2257000],
    antam: [2368000, 2385000, 2410000, 2398000, 2432000, 2469000, 2507000],
  },
  '90D': {
    labels: ['28 Agu', '12 Sep', '27 Sep', '12 Okt', '27 Okt', '11 Nov', '25 Nov'],
    semar: [1998000, 2040000, 2072000, 2115000, 2138000, 2165000, 2257000],
    antam: [2215000, 2260000, 2295000, 2340000, 2368000, 2398000, 2507000],
  },
};

export const PRICE_MATRIX: PriceRow[] = [
  {
    weight: 0.1,
    label: '0,1 gram',
    semarNusantaraPrice: SEMAR_NUSANTARA_RATES.bars[0.1],
    semarNusantaraFee: 15000,
    semarJawaPrice: SEMAR_JAWA_RATES.bars[0.1],
    semarJawaFee: 15000,
  },
  {
    weight: 0.5,
    label: '0,5 gram',
    semarNusantaraPrice: SEMAR_NUSANTARA_RATES.bars[0.5],
    semarNusantaraFee: 18000,
    semarJawaPrice: SEMAR_JAWA_RATES.bars[0.5],
    semarJawaFee: 18000,
    ismoyoPrice: ISMOYO_RATES.bars[0.5],
    ismoyoFee: 18000,
    antamPrice: ANTAM_RATES.bars[0.5],
    antamFee: 20000,
  },
  {
    weight: 1,
    label: '1 gram',
    semarNusantaraPrice: SEMAR_NUSANTARA_RATES.bars[1],
    semarNusantaraFee: 20000,
    semarJawaPrice: SEMAR_JAWA_RATES.bars[1],
    semarJawaFee: 20000,
    ismoyoPrice: ISMOYO_RATES.bars[1],
    ismoyoFee: 20000,
    antamPrice: ANTAM_RATES.bars[1],
    antamFee: 25000,
  },
  {
    weight: 2,
    label: '2 gram',
    semarNusantaraPrice: SEMAR_NUSANTARA_RATES.bars[2],
    semarNusantaraFee: 25000,
    semarJawaPrice: SEMAR_JAWA_RATES.bars[2],
    semarJawaFee: 25000,
    ismoyoPrice: ISMOYO_RATES.bars[2],
    ismoyoFee: 25000,
    antamPrice: ANTAM_RATES.bars[2],
    antamFee: 30000,
  },
  {
    weight: 3,
    label: '3 gram',
    semarNusantaraPrice: SEMAR_NUSANTARA_RATES.bars[3],
    semarNusantaraFee: 28000,
    antamPrice: ANTAM_RATES.bars[3],
    antamFee: 35000,
  },
  {
    weight: 5,
    label: '5 gram',
    semarNusantaraPrice: SEMAR_NUSANTARA_RATES.bars[5],
    semarNusantaraFee: 35000,
    semarJawaPrice: SEMAR_JAWA_RATES.bars[5],
    semarJawaFee: 35000,
    ismoyoPrice: ISMOYO_RATES.bars[5],
    ismoyoFee: 35000,
    antamPrice: ANTAM_RATES.bars[5],
    antamFee: 45000,
  },
  {
    weight: 10,
    label: '10 gram',
    semarNusantaraPrice: SEMAR_NUSANTARA_RATES.bars[10],
    semarNusantaraFee: 50000,
    semarJawaPrice: SEMAR_JAWA_RATES.bars[10],
    semarJawaFee: 50000,
    ismoyoPrice: ISMOYO_RATES.bars[10],
    ismoyoFee: 50000,
    antamPrice: ANTAM_RATES.bars[10],
    antamFee: 65000,
  },
  {
    weight: 25,
    label: '25 gram',
    semarNusantaraPrice: SEMAR_NUSANTARA_RATES.bars[25],
    semarNusantaraFee: 75000,
    semarJawaPrice: SEMAR_JAWA_RATES.bars[25],
    semarJawaFee: 75000,
    ismoyoPrice: ISMOYO_RATES.bars[25],
    ismoyoFee: 75000,
    antamPrice: ANTAM_RATES.bars[25],
    antamFee: 95000,
  },
  {
    weight: 50,
    label: '50 gram',
    antamPrice: ANTAM_RATES.bars[50],
    antamFee: 135000,
  },
  {
    weight: 100,
    label: '100 gram',
    antamPrice: ANTAM_RATES.bars[100],
    antamFee: 195000,
  },
];

export const PRODUCTS: GoldProduct[] = [
  // =========================================================================
  // 1. SEMAR NUSANTARA — 6 SMG PRESS 24K + 13 PERHIASAN RESMI (19 PRODUK)
  // 100% Foto Produk Asli & Harga Resmi: semar.co.id & Tokopedia Mall nusantaragold
  // =========================================================================
  {
    id: 'semar-smg-1g',
    sku: 'SMG-PR-010',
    name: 'Logam Mulia SMG Gold Press 24K — 1 Gram',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Semar Nusantara',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 Fine Gold',
    weightGrams: 1,
    weightDisplay: '1 gram',
    basePrice: SEMAR_NUSANTARA_RATES.bars[1],
    buybackEstimate: 2149000,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 5,
    stockStatus: 'Ready',
    stockLabel: 'Ready • Stok 5',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 1,
    image: '/images/official/sn-smg-press-1g.webp',
    imageFallback: '/images/official/sn-smg-press-1g.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/logam-mulia-smg-gold-press-1gram-emas-batangan-semar-nusantara-1729753860205479584',
    sourceName: 'Semar Nusantara Resmi',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Kemasan Press Resmi SMG 24K (Weight = 1 gr)',
    certificate: 'Certificate of Authenticity SMG 24K + Nota Asli',
    description:
      'Logam mulia SMG Gold Press 24K 1 gram resmi Semar Nusantara. Harga resmi gerai semar.co.id Rp 2.257.000 dengan buyback resmi Rp 2.149.000.',
    specs: [
      'Foto & produk asli kemasan resmi SMG Gold 24K 1 gram',
      'Harga 0% markup — persis sesuai nota kasir gerai resmi',
      'Buyback tinggi & mudah dicairkan kembali via NJ',
    ],
    popular: true,
  },
  {
    id: 'semar-smg-01g',
    sku: 'SMG-PR-001',
    name: 'Logam Mulia SMG Gold Press 24K — 0,1 Gram',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Semar Nusantara',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 Fine Gold',
    weightGrams: 0.1,
    weightDisplay: '0,1 gram',
    basePrice: SEMAR_NUSANTARA_RATES.bars[0.1],
    buybackEstimate: Math.round(0.1 * SEMAR_NUSANTARA_RATES.buybackPerGram),
    jastipFee: 15000,
    taxApplicable: false,
    stock: 10,
    stockStatus: 'Ready',
    stockLabel: 'Ready • Stok 10',
    badge: 'Mulai Nabung',
    popularityRank: 28,
    image: '/images/official/sn-smg-press-01g.webp',
    imageFallback: '/images/official/sn-smg-press-01g.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/logam-mulia-smg-gold-press-0-1gram-emas-batangan-semar-nusantara-1730762907121714848',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Kemasan Press Resmi SMG 24K (0,1 Gram)',
    certificate: 'Surat Resmi (Nota Toko) Semar Nusantara Asli',
    description:
      'Pecahan mikro 0,1 gram SMG Gold Press 24K resmi Semar Nusantara. Harga resmi Rp 275.870 — cocok untuk tabungan rutin harian maupun kado bermakna.',
    specs: [
      'Foto asli kemasan SMG Gold Press 0,1 gram resmi',
      'Fee jastip paling ringan Rp 15.000/item',
      'Nota resmi Semar Nusantara asli di dalam paket',
    ],
  },
  {
    id: 'semar-smg-05g',
    sku: 'SMG-PR-005',
    name: 'Logam Mulia SMG Gold Press 24K — 0,5 Gram',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Semar Nusantara',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 Fine Gold',
    weightGrams: 0.5,
    weightDisplay: '0,5 gram',
    basePrice: SEMAR_NUSANTARA_RATES.bars[0.5],
    buybackEstimate: Math.round(0.5 * SEMAR_NUSANTARA_RATES.buybackPerGram),
    jastipFee: 18000,
    taxApplicable: false,
    stock: 6,
    stockStatus: 'Ready',
    stockLabel: 'Ready • Stok 6',
    popularityRank: 31,
    image: '/images/official/sn-smg-press-05g.webp',
    imageFallback: '/images/official/sn-smg-press-05g.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/logam-mulia-smg-gold-press-0-5gram-emas-batangan-semar-nusantara-1730762906967180960',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Kemasan Press Resmi SMG 24K (0,5 Gram)',
    certificate: 'Surat Toko Asli Semar Nusantara',
    description:
      'Logam mulia SMG Gold Press 24K 0,5 gram resmi Semar Nusantara dengan harga Rp 1.267.630, ideal untuk tabungan rutin maupun hadiah istimewa.',
    specs: [
      'Foto asli kemasan SMG Gold Press 0,5 gram resmi',
      'Bisa COD, Ambil di Rumah Sragen, atau Kirim Asuransi',
      'Surat resmi asli untuk buyback mudah kapan saja',
    ],
  },
  {
    id: 'semar-smg-2g',
    sku: 'SMG-PR-020',
    name: 'Logam Mulia SMG Gold Press 24K — 2 Gram',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Semar Nusantara',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 Fine Gold',
    weightGrams: 2,
    weightDisplay: '2 gram',
    basePrice: SEMAR_NUSANTARA_RATES.bars[2],
    buybackEstimate: 4292000,
    jastipFee: 25000,
    taxApplicable: false,
    stock: 4,
    stockStatus: 'Ready',
    stockLabel: 'Ready • Stok 4',
    popularityRank: 35,
    image: '/images/official/sn-smg-press-2g.webp',
    imageFallback: '/images/official/sn-smg-press-2g.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/logam-mulia-smg-gold-press-2gram-emas-batangan-semar-nusantara-1730411167044306592',
    sourceName: 'Semar Nusantara Resmi',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Kemasan Press Resmi SMG 24K (2 Gram)',
    certificate: 'Surat Toko Asli Semar Nusantara',
    description:
      'Logam mulia SMG Gold Press 24K 2 gram resmi Semar Nusantara. Harga resmi gerai semar.co.id Rp 4.424.000 dengan buyback resmi Rp 4.292.000.',
    specs: [
      'Foto asli kemasan SMG Gold Press 2 gram resmi',
      'Harga per gram lebih efisien untuk investasi keluarga',
      'Buyback tinggi & mudah dicairkan via NJ',
    ],
  },
  {
    id: 'semar-smg-5g',
    sku: 'SMG-PR-050',
    name: 'Logam Mulia SMG Gold Press 24K — 5 Gram',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Semar Nusantara',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 Fine Gold',
    weightGrams: 5,
    weightDisplay: '5 gram',
    basePrice: SEMAR_NUSANTARA_RATES.bars[5],
    buybackEstimate: 10680000,
    jastipFee: 35000,
    taxApplicable: false,
    stock: 3,
    stockStatus: 'Ready',
    stockLabel: 'Ready • Stok 3',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 13,
    image: '/images/official/sn-smg-press-5g.webp',
    imageFallback: '/images/official/sn-smg-press-5g.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/logam-mulia-smg-gold-press-5gram-emas-batangan-semar-nusantara-1730257318259558048',
    sourceName: 'Semar Nusantara Resmi',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Kemasan Press Resmi SMG 24K (Weight = 5 gr)',
    certificate: 'Surat Toko Asli Semar Nusantara',
    description:
      'Logam mulia SMG Gold Press 24K 5 gram resmi Semar Nusantara. Harga resmi gerai semar.co.id Rp 10.955.000 dengan buyback resmi Rp 10.680.000.',
    specs: [
      'Foto asli kemasan resmi SMG Gold 24K — 5 gram',
      'Bisa tukar tambah ke perhiasan di gerai resmi',
      'Refund 100% otomatis apabila stok gerai kosong',
    ],
    popular: true,
  },
  {
    id: 'semar-smg-10g',
    sku: 'SMG-PR-100',
    name: 'Logam Mulia SMG Gold Press 24K — 10 Gram',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Semar Nusantara',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 Fine Gold',
    weightGrams: 10,
    weightDisplay: '10 gram',
    basePrice: SEMAR_NUSANTARA_RATES.bars[10],
    buybackEstimate: 21280000,
    jastipFee: 50000,
    taxApplicable: false,
    stock: 0,
    stockStatus: 'Pre-order',
    stockLabel: 'Pre-order',
    badge: 'Investor Choice',
    popularityRank: 40,
    image: '/images/official/sn-smg-press-10g.webp',
    imageFallback: '/images/official/sn-smg-press-10g.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/logam-mulia-smg-gold-press-10gram-emas-batangan-semar-nusantara-1730411192773478048',
    sourceName: 'Semar Nusantara Resmi',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Kemasan Press Resmi SMG 24K (10 Gram)',
    certificate: 'Surat Toko Asli Semar Nusantara',
    description:
      'Logam mulia SMG Gold Press 24K 10 gram resmi Semar Nusantara. Harga resmi gerai semar.co.id Rp 21.710.000 dengan buyback resmi Rp 21.280.000.',
    specs: [
      'Foto asli kemasan SMG Gold Press 10 gram resmi',
      'Spread jual-beli sangat tipis & transparan',
      'Proteksi penuh asuransi 100% untuk pengiriman luar kota',
    ],
  },
  {
    id: 'sn-velora-twist-17k',
    sku: 'SN-VLR-RG17',
    name: 'Cincin Emas Velora Twist Aeratec 17K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Cincin',
    karat: '17K',
    purity: '17K • Aeratec Gold of the Future',
    weightGrams: 0.8,
    weightDisplay: '0,7 – 0,9 gram',
    basePrice: 1858525,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 4,
    image: '/images/official/sn-cincin-velora-aeratec-17k.webp',
    imageFallback: '/images/official/sn-cincin-velora-aeratec-17k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/cincin-emas-velora-twist-aeratec-ring-gold-17k-semar-nusantara-1738725633877968544-1738725688909530784',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Semar Nusantara',
    certificate: 'Surat Resmi Perhiasan 17K Semar Nusantara',
    description:
      'Cincin emas tua 17K seri Aeratec Velora Twist yang tampak tebal dan mewah namun tetap super ringan (0,7–0,9 gram). Harga resmi Rp 1.858.525 (normal Rp 2.186.500).',
    specs: [
      'Kadar emas tua 17K Aeratec — ringan namun bervolume mewah',
      'Foto & harga sesuai etalase resmi Semar Nusantara',
      'Surat resmi asli Semar Nusantara untuk buyback/tukar tambah',
    ],
    popular: true,
  },
  {
    id: 'sn-nwg-resilience-17k',
    sku: 'SN-NWG-RES17',
    name: 'Nikita Willy Gold — Cincin Aeratec Luzaora Resilience 17K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Cincin',
    karat: '17K',
    purity: '17K • Nikita Willy Gold Aeratec',
    weightGrams: 1.0,
    weightDisplay: '0,7 – 1,2 gram',
    basePrice: 2264570,
    buybackEstimate: null,
    jastipFee: 25000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 16,
    image: '/images/official/sn-nwg-resilience-17k.webp',
    imageFallback: '/images/official/sn-nwg-resilience-17k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/nikita-willy-gold-aeratec-cincin-emas-resilience-ring-collection-17k-semar-nusantara-1732507629546931872',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Nikita Willy Gold',
    certificate: 'Surat Resmi Perhiasan 17K Semar Nusantara',
    description:
      'Cincin kolaborasi Nikita Willy Gold Aeratec seri Luzaora Resilience berkadar emas tua 17K dengan detail tekstur modern rose gold. Harga resmi Rp 2.264.570 (normal Rp 2.664.200).',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Mall Semar Nusantara',
      'Kadar emas tua 17K teknologi Aeratec ringan & nyaman',
      'Nota resmi Semar Nusantara disertakan penuh',
    ],
    popular: true,
  },
  {
    id: 'sn-nwg-amalfi-10k',
    sku: 'SN-NWG-AMF10',
    name: 'Nikita Willy Gold — Cincin Amalfi Coast Two Moon 10K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Cincin',
    karat: '10K',
    purity: '10K • Nikita Willy Gold SQ5',
    weightGrams: 0.9,
    weightDisplay: '0,8 – 1,1 gram',
    basePrice: 1498295,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 34,
    image: '/images/official/sn-nwg-amalfi-10k.webp',
    imageFallback: '/images/official/sn-nwg-amalfi-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/nikita-willy-gold-amalfi-coast-two-moon-ring-sq5-1729726419736431264',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Nikita Willy Gold',
    certificate: 'Surat Resmi Perhiasan 10K Semar Nusantara',
    description:
      'Cincin kolaborasi Nikita Willy Gold seri Amalfi Coast Two Moon berkadar 10K SQ5. Estimasi berat 0,8–1,1 gram, harga resmi Rp 1.498.295 (normal Rp 1.762.700).',
    specs: [
      'Foto & harga resmi langsung dari Tokopedia Mall Semar Nusantara',
      'Kuat dipakai harian & tetap bisa di-buyback resmi',
      'Konfirmasi ukuran jari (size 10–18) via WA NJ',
    ],
  },
  {
    id: 'sn-nwg-felicity-10k',
    sku: 'SN-NWG-FLC10',
    name: 'Nikita Willy Gold — Kalung Aeratec Luzaora Felicity 10K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Kalung',
    karat: '10K',
    purity: '10K • Nikita Willy Gold Aeratec',
    weightGrams: 1.9,
    weightDisplay: '1,9 gram+',
    basePrice: 3057535,
    buybackEstimate: null,
    jastipFee: 25000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 37,
    image: '/images/official/sn-nwg-felicity-10k.webp',
    imageFallback: '/images/official/sn-nwg-felicity-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/nikita-willy-gold-aeratec-kalung-emas-felicity-necklace-collection-10k-semar-nusantara-1735852364026775200',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Nikita Willy Gold',
    certificate: 'Surat Resmi Perhiasan 10K Semar Nusantara',
    description:
      'Kalung Nikita Willy Gold Aeratec seri Luzaora Felicity kadar 10K dengan estimasi berat 1,9 gram+. Harga resmi Rp 3.057.535 (normal Rp 3.597.100).',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Mall Semar Nusantara',
      'Desain eksklusif Nikita Willy Gold Aeratec',
      'Dilengkapi nota asli Semar Nusantara',
    ],
  },
  {
    id: 'sn-iys-moonari-17k',
    sku: 'SN-IYS-MNR17',
    name: 'In Your Seoul — Cincin Korea Autumn Moonari 17K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Cincin',
    karat: '17K',
    purity: '17K • In Your Seoul Collection',
    weightGrams: 1.7,
    weightDisplay: '1,5 – 1,9 gram',
    basePrice: 4140605,
    buybackEstimate: null,
    jastipFee: 30000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 41,
    image: '/images/official/sn-iys-moonari-17k.webp',
    imageFallback: '/images/official/sn-iys-moonari-17k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/cincin-emas-korea-autumn-moonari-collection-gold-17k-in-your-seoul-14-15-e9abe',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Koleksi In Your Seoul + Surat Asli',
    certificate: 'Surat Resmi Semar Nusantara 17K',
    description:
      'Cincin emas tua 17K bergaya Korean Luxury koleksi In Your Seoul seri Autumn Moonari. Estimasi berat 1,5–1,9 gram, harga resmi Rp 4.140.605 (normal Rp 4.871.300).',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Mall Semar Nusantara',
      'Kadar emas tua 17K desain Korean luxury elegan',
      'Surat resmi asli Semar Nusantara disertakan',
    ],
  },
  {
    id: 'sn-iys-autumn-leaves-17k',
    sku: 'SN-IYS-ALV17',
    name: 'In Your Seoul — Gelang Kaki Korea Autumn Leaves 17K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Gelang',
    karat: '17K',
    purity: '17K • In Your Seoul Collection',
    weightGrams: 3.4,
    weightDisplay: '3,3 – 3,5 gram (24–26 cm)',
    basePrice: 8763000,
    buybackEstimate: null,
    jastipFee: 40000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 45,
    image: '/images/official/sn-iys-autumn-leaves-17k.webp',
    imageFallback: '/images/official/sn-iys-autumn-leaves-17k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/gelang-kaki-emas-korea-autumn-leaves-collection-gold-17k-in-your-seoul',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Koleksi In Your Seoul + Surat Asli',
    certificate: 'Surat Resmi Semar Nusantara 17K',
    description:
      'Gelang kaki emas tua 17K koleksi In Your Seoul seri Autumn Leaves panjang 24–26 cm (estimasi berat 3,3–3,5 gram). Harga resmi Rp 8.763.000.',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Mall Semar Nusantara',
      'Emas tua 17K bernilai jual kembali tinggi',
      'Nota resmi asli Semar Nusantara disertakan penuh',
    ],
  },
  {
    id: 'sn-twin-symphony-10k',
    sku: 'SN-TWN-RG10',
    name: 'Cincin Emas Twin Symphony Ring Gold 10K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Cincin',
    karat: '10K',
    purity: '10K • Kadar ±41.7% (SQ5)',
    weightGrams: 0.3,
    weightDisplay: '0,2 – 0,3 gram',
    basePrice: 638934,
    buybackEstimate: null,
    jastipFee: 15000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 20,
    image: '/images/official/sn-cincin-twin-symphony-10k.webp',
    imageFallback: '/images/official/sn-cincin-twin-symphony-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/cincin-emas-twin-symphony-ring-gold-10k-semar-nusantara-1738726611640092320-1738726611749144224',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Semar Nusantara',
    certificate: 'Surat Resmi Perhiasan 10K Semar Nusantara',
    description:
      'Cincin emas 10K minimalis model Twin Symphony (Alodia Symphony / Twinna Line) yang manis dan terjangkau. Harga resmi Rp 638.934 (normal Rp 769.800).',
    specs: [
      'Emas asli 10K SQ5 tahan pakai harian & bisa buyback',
      'Fee jastip flat paling ringan Rp 15.000/item',
      'Nota resmi Semar Nusantara asli wajib disertakan',
    ],
  },
  {
    id: 'sn-mini-charlotte-10k',
    sku: 'SN-CHR-GL10',
    name: 'Gelang Emas Mini Charlotte White Bangle 10K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Gelang',
    karat: '10K',
    purity: '10K • White Gold SQ5',
    weightGrams: 1.5,
    weightDisplay: '1,5 – 1,6 gram',
    basePrice: 2802800,
    buybackEstimate: null,
    jastipFee: 25000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 7,
    image: '/images/official/sn-gelang-mini-charlotte-10k.webp',
    imageFallback: '/images/official/sn-gelang-mini-charlotte-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/gelang-emas-mini-charlotte-white-bangle-gold-10k-semar-nusantara',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Semar Nusantara',
    certificate: 'Surat Resmi Perhiasan 10K Semar Nusantara',
    description:
      'Gelang bangle oval putih (White Gold 10K) desain modern ramping Mini Charlotte dengan aksen motif baut elegan. Harga resmi Rp 2.802.800.',
    specs: [
      'Model bangle modern white gold 10K berat 1,5–1,6 gram',
      'Harga persis sesuai katalog resmi Semar Nusantara',
      'Disertai nota resmi asli Semar Nusantara',
    ],
    popular: true,
  },
  {
    id: 'sn-spirca-bangle-17k',
    sku: 'SN-SPR-GL17',
    name: 'Gelang Emas Spirca Rose White Gold 17K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Gelang',
    karat: '17K',
    purity: '17K • Rose White Gold Emas Tua',
    weightGrams: 7.2,
    weightDisplay: '7,1 – 7,4 gram',
    basePrice: 18276600,
    buybackEstimate: null,
    jastipFee: 50000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 26,
    image: '/images/official/sn-gelang-spirca-17k.webp',
    imageFallback: '/images/official/sn-gelang-spirca-17k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/gelang-emas-spirca-rose-white-gold-17k-semar-nusantara',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Eksklusif Semar Nusantara',
    certificate: 'Surat Resmi Perhiasan 17K Semar Nusantara',
    description:
      'Gelang emas tua 17K mewah seri Spirca kombinasi Rose & White Gold dengan bobot mantap 7,1–7,4 gram. Harga resmi Rp 18.276.600.',
    specs: [
      'Kadar emas tua 17K bobot 7,1 – 7,4 gram',
      'Video cek fisik & timbangan digital langsung dari gerai',
      'Pengiriman luar kota wajib packing kayu & asuransi 100%',
    ],
  },
  {
    id: 'sn-laurenia-necklace-17k',
    sku: 'SN-LRN-KL17',
    name: 'Kalung Emas Laurenia Rose White Gold 17K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Kalung',
    karat: '17K',
    purity: '17K • Rose White Gold Emas Tua',
    weightGrams: 2.5,
    weightDisplay: '2,4 – 2,6 gram',
    basePrice: 6340000,
    buybackEstimate: null,
    jastipFee: 35000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 10,
    image: '/images/official/sn-kalung-laurenia-17k.webp',
    imageFallback: '/images/official/sn-kalung-laurenia-17k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/kalung-emas-laurenia-rose-white-gold-17k-semar-nusantara',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Semar Nusantara',
    certificate: 'Surat Resmi Perhiasan 17K Semar Nusantara',
    description:
      'Kalung emas tua 17K Laurenia memadukan rantai rose gold lembut dengan liontin tetes air white gold bertabur zircon berkilau. Harga resmi Rp 6.340.000.',
    specs: [
      'Desain two-tone rose & white gold 17K sangat anggun',
      'Foto & harga sesuai katalog resmi Semar Nusantara',
      'Dilengkapi surat asli Semar Nusantara untuk buyback',
    ],
    popular: true,
  },
  {
    id: 'sn-pearfect-necklace-10k',
    sku: 'SN-PRF-KL10',
    name: 'Kalung Emas Pearfect Match Necklace 10K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Kalung',
    karat: '10K',
    purity: '10K • Kadar ±41.7% (SQ5)',
    weightGrams: 2.3,
    weightDisplay: '2,2 – 2,6 gram (Set)',
    basePrice: 3453805,
    buybackEstimate: null,
    jastipFee: 30000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 23,
    image: '/images/official/sn-kalung-pearfect-10k.webp',
    imageFallback: '/images/official/sn-kalung-pearfect-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/kalung-emas-pearfect-match-necklace-gold-10k-semar-nusantara-1738727451086456480',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Semar Nusantara',
    certificate: 'Surat Resmi Perhiasan 10K Semar Nusantara',
    description:
      'Set kalung Stela Gold + liontin Lauryn Pearshape 10K (kalung 1,9–2,2g + liontin 0,3–0,4g). Harga resmi Rp 3.453.805 (normal Rp 4.063.300).',
    specs: [
      'Sudah termasuk rantai kalung & liontin serasi 10K',
      'Tampilan feminin modern cocok untuk hadiah istimewa',
      'Nota resmi asli Semar Nusantara disertakan penuh',
    ],
  },
  {
    id: 'sn-anting-daun-17k',
    sku: 'SN-DN-AT17',
    name: 'Anting Emas Tindik Daun Gold 17K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Anting',
    karat: '17K',
    purity: '17K • Kadar ±70.8% Emas Tua',
    weightGrams: 1.1,
    weightDisplay: '1,0 – 1,2 gram',
    basePrice: 2800400,
    buybackEstimate: null,
    jastipFee: 25000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 29,
    image: '/images/official/sn-anting-daun-17k.webp',
    imageFallback: '/images/official/sn-anting-daun-17k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/anting-emas-tindik-daun-gold-17k-semar-nusantara',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Semar Nusantara',
    certificate: 'Surat Resmi Perhiasan 17K Semar Nusantara',
    description:
      'Anting tindik motif tangkai daun berkilau berkadar emas tua 17K yang manis menempel rapi di daun telinga. Harga resmi Rp 2.800.400.',
    specs: [
      'Desain mungil elegan motif daun emas tua 17K',
      'Nyaman dipakai harian maupun acara formal',
      'Surat resmi asli Semar Nusantara disertakan',
    ],
  },
  {
    id: 'sn-sweet-flower-pendant-10k',
    sku: 'SN-SWF-LT10',
    name: 'Liontin Emas Sweet Flower Gold 10K',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    category: 'Perhiasan 17K & 10K',
    itemCategory: 'Liontin',
    karat: '10K',
    purity: '10K • Kadar ±41.7% (SQ5)',
    weightGrams: 0.5,
    weightDisplay: '0,5 – 0,6 gram',
    basePrice: 927200,
    buybackEstimate: null,
    jastipFee: 18000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 32,
    image: '/images/official/sn-liontin-sweet-flower-10k.webp',
    imageFallback: '/images/official/sn-liontin-sweet-flower-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/nusantaragold/liontin-emas-sweet-flower-gold-10k-semar-nusantara',
    sourceName: 'Tokopedia Mall Semar Nusantara',
    originStore: 'Gerai Resmi Semar Nusantara Solo (Jl. Dr. Radjiman, Coyudan)',
    packaging: 'Box Perhiasan Resmi Semar Nusantara',
    certificate: 'Surat Resmi Perhiasan 10K Semar Nusantara',
    description:
      'Liontin emas 10K model Sweet Flower dua tingkat bermotif bunga hitam & putih yang chic dan anggun. Harga resmi Rp 927.200.',
    specs: [
      'Model clover/bunga elegan bertingkat dua',
      'Mudah dipadukan dengan rantai kalung tipis 10K',
      'Dilengkapi nota resmi asli Semar Nusantara',
    ],
  },

  // =========================================================================
  // 2. SEMAR JAWA (TOKO MAS JAWA) — 3 LM JAWA GOLD 24K + 11 PERHIASAN (14 PRODUK)
  // 100% Foto Produk Asli & Harga Resmi: tokomasjawa.com/shop & Tokopedia toko-mas-jawa
  // =========================================================================
  {
    id: 'sj-claretta-ring-17k',
    sku: 'TMJ-CLR-RG17',
    name: 'Cincin Emas CLARETTA Collection 17K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Cincin',
    karat: '17K',
    purity: '17K • Emas Tua Resmi Toko Mas Jawa',
    weightGrams: 2.0,
    weightDisplay: '2,0 – 3,2 gram',
    basePrice: 5752000,
    priceMax: 8765000,
    buybackEstimate: null,
    jastipFee: 35000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 2,
    image: '/images/official/tmj-cincin-claretta-17k.webp',
    imageFallback: '/images/official/tmj-cincin-claretta-17k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/cincin-emas-claretta-collection-kadar-17k-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Perhiasan Resmi Toko Mas Jawa + Pouch',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Cincin signature CLARETTA Collection 17K asli Toko Mas Jawa dengan batu utama champagne cushion-cut & deretan batu putih berkilau. Berat 2,0–3,2 gram.',
    specs: [
      'Foto & harga resmi langsung dari tokomasjawa.com',
      'Harga mengikuti berat riil & ukuran jari di nota resmi',
      'Bisa COD, Ambil di Rumah Sragen, atau Kirim Asuransi',
    ],
    popular: true,
  },
  {
    id: 'sj-rosee-ring-10k',
    sku: 'TMJ-ROS-RG10',
    name: 'Cincin Emas Rosèe Collection 10K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Cincin',
    karat: '10K',
    purity: '10K • Koleksi Resmi Toko Mas Jawa',
    weightGrams: 1.4,
    weightDisplay: '±1,4 – 1,5 gram',
    basePrice: 2613000,
    buybackEstimate: null,
    jastipFee: 25000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 5,
    image: '/images/official/tmj-cincin-rosee-10k.webp',
    imageFallback: '/images/official/tmj-cincin-rosee-10k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/cincin-emas-rosee-collection-kadar-10-karat-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Cincin feminin ikonik Rosèe Collection 10K warna rose gold dengan batu permata pink persegi panjang & dua batu aksen di sampingnya. Harga resmi Rp 2.613.000.',
    specs: [
      'Foto asli & harga persis sesuai tokomasjawa.com',
      'Harga 0% markup — persis sesuai nota Toko Mas Jawa',
      'Nota resmi asli wajib disertakan untuk kemudahan buyback',
    ],
    popular: true,
  },
  {
    id: 'sj-rosee-bracelet-10k',
    sku: 'TMJ-ROS-GL10',
    name: 'Gelang Emas Rosèe Collection 10K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Gelang',
    karat: '10K',
    purity: '10K • Koleksi Resmi Toko Mas Jawa',
    weightGrams: 2.6,
    weightDisplay: '±2,6 – 2,7 gram',
    basePrice: 4964000,
    priceMax: 5052000,
    buybackEstimate: null,
    jastipFee: 35000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 8,
    image: '/images/official/tmj-gelang-rosee-10k.webp',
    imageFallback: '/images/official/tmj-gelang-rosee-10k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/gelang-emas-rosee-collection-kadar-10-karat-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Perhiasan Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Gelang emas Rosèe Collection 10K yang serasi dipasangkan dengan Cincin Rosèe Collection. Harga resmi Rp 4.964.000 – Rp 5.052.000.',
    specs: [
      'Foto asli & harga resmi langsung dari tokomasjawa.com',
      'Harga resmi 0% markup — bukti nota toko dilampirkan',
      'Bisa COD, Ambil di Rumah, atau Kirim Asuransi 100%',
    ],
    popular: true,
  },
  {
    id: 'sj-liontin-claretta-17k',
    sku: 'TMJ-CLR-LT17',
    name: 'Liontin Emas CLARETTA Collection 17K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Liontin',
    karat: '17K',
    purity: '17K • Emas Tua Resmi Toko Mas Jawa',
    weightGrams: 2.4,
    weightDisplay: '2,4 gram',
    basePrice: 6574000,
    buybackEstimate: null,
    jastipFee: 35000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 11,
    image: '/images/official/tmj-liontin-claretta-17k.webp',
    imageFallback: '/images/official/tmj-liontin-claretta-17k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/liontin-emas-claretta-collection-kadar-17k-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Perhiasan Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Liontin elegan seri CLARETTA Collection berkadar emas tua 17K berat estimasi 2,4 gram. Harga resmi Rp 6.574.000.',
    specs: [
      'Kadar emas tua 17K serasi dengan Cincin & Bangle CLARETTA',
      'Foto & harga resmi langsung dari tokomasjawa.com',
      'Foto timbangan digital & nota asli dikirim sebelum dikemas',
    ],
    popular: true,
  },
  {
    id: 'semar-jawa-05g',
    sku: 'SMJ-JG-005',
    name: 'Logam Mulia Jawa Gold 24K — 0,5 Gram',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 99,99 Fine Gold Toko Mas Jawa',
    weightGrams: 0.5,
    weightDisplay: '0,5 gram',
    basePrice: 1500000,
    buybackEstimate: null,
    jastipFee: 18000,
    taxApplicable: false,
    stock: 4,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Jawa Gold 24K',
    popularityRank: 14,
    image: '/images/official/tmj-lm-jawa-05g.webp',
    imageFallback: '/images/official/tmj-lm-jawa-05g.jpg',
    sourceUrl: 'https://www.tokopedia.com/toko-mas-jawa/lm-jawa-gold-0-5-1gr-kadar-24-karat-toko-mas-jawa-1729657668418504484',
    sourceName: 'Tokopedia Toko Mas Jawa',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Kartu Press Resmi Motif Gunungan Jawa Gold 24K',
    certificate: 'Surat Resmi Asli Toko Mas Jawa',
    description:
      'Logam mulia asli Jawa Gold 24K pecahan 0,5 gram dari Toko Mas Jawa berdesain batik Gunungan. Harga resmi Rp 1.500.000.',
    specs: [
      'Foto & harga resmi langsung dari Tokopedia Toko Mas Jawa',
      'Surat resmi asli Toko Mas Jawa wajib disertakan',
      'Menerima titip beli maupun jual kembali (buyback)',
    ],
    popular: true,
  },
  {
    id: 'semar-jawa-01g',
    sku: 'SMJ-JG-001',
    name: 'Logam Mulia Jawa Mini Gold 24K — 0,1 Gram',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 99,99 Fine Gold Toko Mas Jawa',
    weightGrams: 0.1,
    weightDisplay: '0,1 gram',
    basePrice: 337000,
    buybackEstimate: null,
    jastipFee: 15000,
    taxApplicable: false,
    stock: 6,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Mini Gold 24K',
    popularityRank: 27,
    image: '/images/official/tmj-lm-jawa-01g.webp',
    imageFallback: '/images/official/tmj-lm-jawa-01g.jpg',
    sourceUrl: 'https://www.tokopedia.com/toko-mas-jawa/lm-jawa-mini-gold-0-1gr-kadar-24-karat-toko-mas-jawa-1731850628985489188',
    sourceName: 'Tokopedia Toko Mas Jawa',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Kartu Press Resmi Jawa Mini Gold 24K',
    certificate: 'Surat Resmi Asli Toko Mas Jawa',
    description:
      'Logam mulia Jawa Mini Gold 24K 0,1 gram asli Toko Mas Jawa dengan harga Rp 337.000. Sangat praktis untuk nabung emas maupun hadiah.',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Toko Mas Jawa',
      'Fee jastip ringan Rp 15.000/item',
      'Bisa COD, Ambil di Rumah Sragen, atau Kirim Asuransi',
    ],
  },
  {
    id: 'semar-jawa-5g',
    sku: 'SMJ-JG-050',
    name: 'Logam Mulia Jawa Gold 24K — 5 Gram',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 99,99 Fine Gold Toko Mas Jawa',
    weightGrams: 5,
    weightDisplay: '5 gram',
    basePrice: 13415000,
    buybackEstimate: null,
    jastipFee: 35000,
    taxApplicable: false,
    stock: 2,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Investasi 24K',
    popularityRank: 36,
    image: '/images/official/tmj-lm-jawa-5g.webp',
    imageFallback: '/images/official/tmj-lm-jawa-5g.jpg',
    sourceUrl: 'https://www.tokopedia.com/toko-mas-jawa/lm-jawa-gold-5-10gr-kadar-24k-toko-mas-jawa-1731739820752733988',
    sourceName: 'Tokopedia Toko Mas Jawa',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Kartu Press Resmi Jawa Gold 24K (5 Gram)',
    certificate: 'Surat Resmi Asli Toko Mas Jawa',
    description:
      'Emas batangan 5 gram Jawa Gold 99,99% 24K asli Toko Mas Jawa. Harga resmi Rp 13.415.000 — cocok untuk investasi keluarga & mahar pernikahan.',
    specs: [
      'Foto & harga asli langsung dari Tokopedia Toko Mas Jawa',
      'Video dokumentasi fisik & nota sebelum pengemasan',
      'Pengiriman luar kota wajib packing kayu + asuransi 100%',
    ],
    popular: true,
  },
  {
    id: 'sj-kalung-safa-10k',
    sku: 'TMJ-SAF-KL10',
    name: 'Kalung Emas Safa Collection 10K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Kalung',
    karat: '10K',
    purity: '10K • Koleksi Resmi Toko Mas Jawa',
    weightGrams: 2.2,
    weightDisplay: '±2,2 – 2,3 gram',
    basePrice: 4116000,
    buybackEstimate: null,
    jastipFee: 30000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 17,
    image: '/images/official/tmj-kalung-safa-10k.webp',
    imageFallback: '/images/official/tmj-kalung-safa-10k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/kalung-emas-safa-collection-kadar-10-karat-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Perhiasan Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Kalung emas Safa Collection 10K dari Toko Mas Jawa dengan estimasi berat 2,2–2,3 gram. Harga resmi Rp 4.116.000.',
    specs: [
      'Foto produk & harga asli dari tokomasjawa.com',
      '0% markup mengikuti nota kasir Toko Mas Jawa',
      'Mendukung layanan buyback kembali via NJ',
    ],
  },
  {
    id: 'sj-amberlee-earrings-17k',
    sku: 'TMJ-AMB-AT17',
    name: 'Anting Emas AMBERLEE 17K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Anting',
    karat: '17K',
    purity: '17K • Emas Tua Resmi Toko Mas Jawa',
    weightGrams: 3.0,
    weightDisplay: '2,9 – 3,1 gram',
    basePrice: 8293000,
    priceMax: 8491000,
    buybackEstimate: null,
    jastipFee: 35000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 21,
    image: '/images/official/tmj-anting-amberlee-17k.webp',
    imageFallback: '/images/official/tmj-anting-amberlee-17k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/anting-emas-amberlee-kadar-17k-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Perhiasan Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Anting emas tua 17K koleksi AMBERLEE dari Toko Mas Jawa dengan bandul hati ruby-pink halo mewah. Berat 2,9–3,1 gram, harga resmi Rp 8.293.000 – Rp 8.491.000.',
    specs: [
      'Foto & harga resmi langsung dari tokomasjawa.com',
      'Kadar emas tua 17K bernilai jual kembali tinggi',
      'Nota resmi asli Toko Mas Jawa disertakan penuh',
    ],
  },
  {
    id: 'sj-claretta-earrings-10k',
    sku: 'TMJ-CLR-AT10',
    name: 'Anting Emas CLARETTA Collection 10K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Anting',
    karat: '10K',
    purity: '10K • Koleksi Resmi Toko Mas Jawa',
    weightGrams: 2.2,
    weightDisplay: '2,2 – 3,8 gram',
    basePrice: 4006000,
    priceMax: 6325000,
    buybackEstimate: null,
    jastipFee: 30000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 24,
    image: '/images/official/tmj-anting-claretta-10k.webp',
    imageFallback: '/images/official/tmj-anting-claretta-10k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/anting-emas-claretta-collection-kadar-10k-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Perhiasan Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Anting CLARETTA Collection kadar 10K dari Toko Mas Jawa dengan berat estimasi 2,2–3,8 gram. Harga resmi Rp 4.006.000 – Rp 6.325.000.',
    specs: [
      'Foto & harga resmi dari tokomasjawa.com',
      'Desain sparkling elegan cocok untuk pesta maupun seserahan',
      'Dilengkapi nota asli gerai Toko Mas Jawa',
    ],
  },
  {
    id: 'sj-claretta-bangle-17k',
    sku: 'TMJ-CLR-GL17',
    name: 'Gelang Bangle Emas CLARETTA Collection 17K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Gelang',
    karat: '17K',
    purity: '17K • Emas Tua Resmi Toko Mas Jawa',
    weightGrams: 8.0,
    weightDisplay: '7,9 – 8,1 gram',
    basePrice: 22450000,
    buybackEstimate: null,
    jastipFee: 50000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Luxury 17K',
    popularityRank: 30,
    image: '/images/official/tmj-gelang-claretta-17k.webp',
    imageFallback: '/images/official/tmj-gelang-claretta-17k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/gelang-bangle-emas-claretta-collection-kadar-17k-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Hard Box Beludru Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Gelang bangle oval CLARETTA Collection 17K dengan batu champagne solitaire & deretan pavé putih. Berat 7,9–8,1 gram, harga resmi Rp 22.450.000.',
    specs: [
      'Foto & harga asli persis sesuai tokomasjawa.com',
      'Emas tua 17K bobot mantap 7,9–8,1 gram',
      'Video live etalase & timbangan resmi via WA NJ',
    ],
  },
  {
    id: 'sj-liontin-claretta-10k',
    sku: 'TMJ-CLR-LT10',
    name: 'Liontin Emas CLARETTA Collection 10K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Liontin',
    karat: '10K',
    purity: '10K • Koleksi Resmi Toko Mas Jawa',
    weightGrams: 1.5,
    weightDisplay: '1,2 – 2,1 gram',
    basePrice: 2265000,
    priceMax: 3795000,
    buybackEstimate: null,
    jastipFee: 25000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 33,
    image: '/images/official/tmj-liontin-claretta-10k.webp',
    imageFallback: '/images/official/tmj-liontin-claretta-10k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/liontin-emas-claretta-collection-kadar-10k-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Perhiasan Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Liontin CLARETTA Collection kadar 10K warna emas hangat dengan estimasi berat 1,2–2,1 gram. Harga resmi Rp 2.265.000 – Rp 3.795.000.',
    specs: [
      'Foto & harga resmi dari tokomasjawa.com',
      'Seri CLARETTA lebih ringan & terjangkau di kadar 10K',
      'Disertai surat pembelian resmi asli Toko Mas Jawa',
    ],
  },
  {
    id: 'sj-ara-collection-10k',
    sku: 'TMJ-ARA-10K',
    name: 'Kalung & Gelang Emas Ara Collection 10K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Kalung',
    karat: '10K',
    purity: '10K • Koleksi Resmi Toko Mas Jawa',
    weightGrams: 2.0,
    weightDisplay: '2,0 – 3,0 gram',
    basePrice: 4045000,
    priceMax: 5516000,
    buybackEstimate: null,
    jastipFee: 30000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 38,
    image: '/images/official/tmj-ara-collection-10k.webp',
    imageFallback: '/images/official/tmj-ara-collection-10k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/ara-collections-by-toko-mas-jawa/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Perhiasan Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Koleksi Ara by Toko Mas Jawa kadar 10K tersedia varian Kalung (Rp 4.045.000) dan Gelang (Rp 5.516.000) dengan estimasi berat 2–3 gram.',
    specs: [
      'Foto & harga resmi dari tokomasjawa.com',
      'Tersedia pilihan Kalung maupun Gelang Ara Collection',
      '0% markup + nota pembelian resmi Toko Mas Jawa',
    ],
  },
  {
    id: 'sj-kalung-flexi-17k',
    sku: 'TMJ-FLX-KL17',
    name: 'Kalung Emas Polos Flexi 17K',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    category: 'Semar Jawa',
    itemCategory: 'Kalung',
    karat: '17K',
    purity: '17K • Emas Tua Resmi Toko Mas Jawa',
    weightGrams: 3.1,
    weightDisplay: '3,1 – 7,0 gram',
    basePrice: 8491000,
    priceMax: 19173000,
    buybackEstimate: null,
    jastipFee: 40000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 42,
    image: '/images/official/tmj-kalung-flexi-17k.webp',
    imageFallback: '/images/official/tmj-kalung-flexi-17k.jpg',
    sourceUrl: 'https://tokomasjawa.com/product/kalung-polos-flexi-2/',
    sourceName: 'tokomasjawa.com',
    originStore: 'Gerai Resmi Toko Mas Jawa Solo (Dawung / Solo Grand Mall / Solo Paragon)',
    packaging: 'Box Perhiasan Resmi Toko Mas Jawa',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas Jawa',
    description:
      'Kalung polos Flexi kadar emas tua 17K yang klasik, kokoh, dan bernilai investasi tinggi. Pilihan berat 3,1–7,0 gram (Rp 8.491.000 – Rp 19.173.000).',
    specs: [
      'Foto & harga resmi langsung dari tokomasjawa.com',
      'Kadar emas tua 17K mudah dijual kembali kapan saja',
      'Konfirmasi berat riil & panjang rantai via WA NJ',
    ],
  },

  // =========================================================================
  // 3. ISMOYO (J5) — 12 PERHIASAN ASLI TOKOPEDIA RESMI J5 ISMOYO (12 PRODUK)
  // 100% Foto Produk Asli & Harga Resmi: https://www.tokopedia.com/j5ismoyo/product
  // =========================================================================
  {
    id: 'j5-pinzy-ring-10k',
    sku: 'J5-PNZ-RG10',
    name: 'Cincin Emas Model Pinzy 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Cincin',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 1.3,
    weightDisplay: '1,2 – 1,4 gram',
    basePrice: 1668000,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 3,
    image: '/images/official/j5-cincin-pinzy-10k.webp',
    imageFallback: '/images/official/j5-cincin-pinzy-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/cincin-emas-mas-asli-model-pinzy-j5-ismoyo-1738717084779644680-1738717033072592648',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box & Pouch Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Cincin emas asli 10K model Pinzy dari Toko Mas J5 Ismoyo dengan desain hati mungil bertabur 3 permata berkilau. Berat 1,2–1,4 gram, harga resmi Rp 1.668.000.',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Resmi J5 Ismoyo',
      '0% markup harga toko + nota asli lengkap untuk buyback',
      'Bisa COD, Ambil di Rumah Sragen, atau Kirim Asuransi',
    ],
    popular: true,
  },
  {
    id: 'j5-rolly-cord-bracelet-10k',
    sku: 'J5-RLY-GL10',
    name: 'Gelang Emas Tali Rolly 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Gelang',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 0.2,
    weightDisplay: '0,2 gram',
    basePrice: 317000,
    buybackEstimate: null,
    jastipFee: 15000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 6,
    image: '/images/official/j5-gelang-rolly-10k.webp',
    imageFallback: '/images/official/j5-gelang-rolly-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/gelang-emas-tali-rolly-j5-ismoyo-1732740424202684168',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Pouch & Nota Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Gelang tali serut fleksibel model Rolly dengan rantai emas asli 10K berat 0,200 gram dari J5 Ismoyo (pilihan warna tali Navy, Coklat, Hitam, Merah). Harga resmi Rp 317.000.',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Resmi J5 Ismoyo',
      'Tali serut fleksibel cocok semua ukuran tangan',
      'Fee jastip paling ringan Rp 15.000/item',
    ],
    popular: true,
  },
  {
    id: 'j5-lenora-bracelet-10k',
    sku: 'J5-LNR-GL10',
    name: 'Gelang Emas Model Rantai Lenora 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Gelang',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 1.0,
    weightDisplay: '1,0 gram',
    basePrice: 1450000,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 9,
    image: '/images/official/j5-gelang-lenora-10k.webp',
    imageFallback: '/images/official/j5-gelang-lenora-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/gelang-emas-10-karat-model-rantai-lenora-j5-ismoyo-1738725421570033416',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box & Pouch Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Gelang rantai emas 10K model Lenora dengan batang gelombang manis dan rantai ekstensi pengatur panjang. Berat estimasi 1 gram, harga resmi Rp 1.450.000.',
    specs: [
      'Foto produk & harga asli dari Tokopedia Resmi J5 Ismoyo',
      'Dilengkapi ekstensi pengatur ukuran pergelangan tangan',
      'Nota asli resmi J5 Ismoyo disertakan penuh',
    ],
    popular: true,
  },
  {
    id: 'j5-nalea-ring-10k',
    sku: 'J5-NLA-RG10',
    name: 'Cincin Emas Model Nalea 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Cincin',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 0.4,
    weightDisplay: '0,4 gram',
    basePrice: 556000,
    buybackEstimate: null,
    jastipFee: 15000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 12,
    image: '/images/official/j5-cincin-nalea-10k.webp',
    imageFallback: '/images/official/j5-cincin-nalea-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/cincin-emas-mas-asli-model-nalea-j5-ismoyo-1733011804712044296',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box & Pouch Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Cincin emas asli 10K model Nalea dengan satu mata permata di bingkai oval elegan. Berat 0,4 gram, harga resmi Rp 556.000.',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Resmi J5 Ismoyo',
      'Fee jastip paling ringan Rp 15.000/item',
      'Konfirmasi ukuran jari (size 7–16) langsung via WA NJ',
    ],
    popular: true,
  },
  {
    id: 'j5-orlena-necklace-10k',
    sku: 'J5-ORL-KL10',
    name: 'Kalung Emas Model Orlena 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Kalung',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 0.8,
    weightDisplay: '0,8 gram',
    basePrice: 1152000,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    badge: 'Best Seller',
    isBestSeller: true,
    popularityRank: 15,
    image: '/images/official/j5-kalung-orlena-10k.webp',
    imageFallback: '/images/official/j5-kalung-orlena-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/kalung-emas-10-karat-mas-asli-model-orlena-j5-ismoyo-1738714566237914888',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box Perhiasan Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Kalung emas asli 10K model Orlena dari Toko Mas J5 Ismoyo dengan liontin bunga clover berkilau halus. Berat 0,8 gram, harga resmi Rp 1.152.000.',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Resmi J5 Ismoyo',
      'Nota asli resmi Toko Mas J5 Ismoyo disertakan',
      'Foto timbangan digital dikirim sebelum paket disegel',
    ],
    popular: true,
  },
  {
    id: 'j5-tiffa-earrings-10k',
    sku: 'J5-TFA-AT10',
    name: 'Anting Emas Model Tiffa 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Anting',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 1.0,
    weightDisplay: '1,0 gram',
    basePrice: 1440000,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 18,
    image: '/images/official/j5-anting-tiffa-10k.webp',
    imageFallback: '/images/official/j5-anting-tiffa-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/anting-emas-mas-asli-model-tiffa-j5-ismoyo-1731803972045145864',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box Perhiasan Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Anting emas asli 10K model Tiffa dari Toko Mas J5 Ismoyo dengan estimasi berat 1 gram. Harga resmi Rp 1.440.000.',
    specs: [
      'Foto & harga resmi langsung dari Tokopedia J5 Ismoyo',
      'Desain cantik mudah dipadukan dengan segala busana',
      'Disertai surat pembelian resmi asli J5 Ismoyo',
    ],
  },
  {
    id: 'j5-luzia-bracelet-10k',
    sku: 'J5-LZA-GL10',
    name: 'Gelang Emas Model Rantai Luzia 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Gelang',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 1.1,
    weightDisplay: '1,1 gram',
    basePrice: 1595000,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 19,
    image: '/images/official/j5-gelang-luzia-10k.webp',
    imageFallback: '/images/official/j5-gelang-luzia-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/gelang-emas-10-karat-model-rantai-luzia-j5-ismoyo-1738725381143627528',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box & Pouch Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Gelang rantai emas 10K model Luzia dari J5 Ismoyo dengan estimasi berat 1,1 gram. Harga resmi Rp 1.595.000.',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Resmi J5 Ismoyo',
      'Nota asli resmi J5 Ismoyo disertakan untuk buyback',
      'Bisa COD, Ambil di Rumah Sragen, atau Kirim Asuransi',
    ],
  },
  {
    id: 'j5-veira-ring-10k',
    sku: 'J5-VRA-RG10',
    name: 'Cincin Emas Veira (Wedding) 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Cincin',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 0.9,
    weightDisplay: '0,8 – 1,0 gram',
    basePrice: 1112000,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 22,
    image: '/images/official/j5-cincin-veira-10k.webp',
    imageFallback: '/images/official/j5-cincin-veira-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/cincin-emas-10k-veira-bisa-buat-wedding-j5-ismoyo-1738716252314765064-1738716253193275144',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box & Pouch Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Cincin emas 10K model Veira yang elegan untuk cincin tunangan, wedding, maupun harian. Estimasi berat 0,8–1,0 gram, harga resmi Rp 1.112.000.',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Resmi J5 Ismoyo',
      'Pilihan ukuran jari lengkap (konfirmasi via WA NJ)',
      'Lengkap dengan surat pembelian resmi J5 Ismoyo',
    ],
  },
  {
    id: 'j5-floella-earrings-10k',
    sku: 'J5-FLL-AT10',
    name: 'Anting Emas Panjang Model Floella 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Anting',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 0.9,
    weightDisplay: '0,9 gram',
    basePrice: 1296000,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 25,
    image: '/images/official/j5-anting-floella-10k.webp',
    imageFallback: '/images/official/j5-anting-floella-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/anting-emas-mas-asli-10k-model-panjang-floella-j5-ismoyo-1738714284572641032',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box Perhiasan Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Anting gantung panjang model Floella 10K dari J5 Ismoyo yang anggun dan ringan (estimasi 0,9 gram). Harga resmi Rp 1.296.000.',
    specs: [
      'Foto & harga resmi langsung dari Tokopedia J5 Ismoyo',
      'Model gantung feminin cocok untuk kondangan & acara spesial',
      'Disertai surat pembelian resmi asli J5 Ismoyo',
    ],
  },
  {
    id: 'j5-sangja-pendant-10k',
    sku: 'J5-SGJ-LT10',
    name: 'Liontin Emas Love Sangja Prima 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Liontin',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 0.5,
    weightDisplay: '0,5 gram',
    basePrice: 695000,
    buybackEstimate: null,
    jastipFee: 18000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 39,
    image: '/images/official/j5-liontin-sangja-10k.webp',
    imageFallback: '/images/official/j5-liontin-sangja-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/liontin-emas-10-karat-love-sangja-prima-j5-ismoyo',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box & Pouch Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Liontin motif hati Love Sangja Prima 10K dari Toko Mas J5 Ismoyo dengan berat 0,500 gram. Harga resmi Rp 695.000.',
    specs: [
      'Foto & harga resmi langsung dari Tokopedia J5 Ismoyo',
      'Desain hati manis & terjangkau untuk kado maupun harian',
      'Lengkap dengan surat resmi asli Toko Mas J5 Ismoyo',
    ],
  },
  {
    id: 'j5-filsha-pendant-10k',
    sku: 'J5-FLS-LT10',
    name: 'Liontin Emas Model Filsha 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Liontin',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 0.8,
    weightDisplay: '0,8 gram',
    basePrice: 1112000,
    buybackEstimate: null,
    jastipFee: 20000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 43,
    image: '/images/official/j5-liontin-filsha-10k.webp',
    imageFallback: '/images/official/j5-liontin-filsha-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/liontin-emas-mas-asli-model-filsha-j5-ismoyo',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box & Pouch Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Liontin emas asli 10K model Filsha dari Toko Mas J5 Ismoyo dengan estimasi berat 0,8 gram. Harga resmi Rp 1.112.000.',
    specs: [
      'Foto & harga asli persis sesuai Tokopedia Resmi J5 Ismoyo',
      '0% markup + nota pembelian resmi Toko Mas J5 Ismoyo',
      'Bisa COD, Ambil di Rumah Sragen, atau Kirim Asuransi',
    ],
  },
  {
    id: 'j5-billa-pendant-10k',
    sku: 'J5-BLA-LT10',
    name: 'Liontin Emas Love Batu Warna Billa 10K',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    category: 'Ismoyo (J5)',
    itemCategory: 'Liontin',
    karat: '10K',
    purity: '10K • Emas Asli Toko Mas J5 Ismoyo',
    weightGrams: 0.6,
    weightDisplay: '0,5 – 0,7 gram',
    basePrice: 834000,
    buybackEstimate: null,
    jastipFee: 18000,
    taxApplicable: false,
    stock: 1,
    stockStatus: 'Ready',
    stockLabel: 'Ready — konfirmasi WA',
    popularityRank: 44,
    image: '/images/official/j5-liontin-billa-10k.webp',
    imageFallback: '/images/official/j5-liontin-billa-10k.jpg',
    sourceUrl: 'https://www.tokopedia.com/j5ismoyo/liontin-emas-my-love-billa-j5-ismoyo-1737803466778773256',
    sourceName: 'Tokopedia J5 Ismoyo',
    originStore: 'Gerai Resmi Toko Mas J5 Ismoyo Solo (Pasar Legi & Solo Baru)',
    packaging: 'Box & Pouch Resmi Toko Mas J5 Ismoyo',
    certificate: 'Surat Pembelian Resmi Asli Toko Mas J5 Ismoyo',
    description:
      'Liontin emas 10K motif hati bertatah batu warna model Billa dari J5 Ismoyo dengan estimasi berat 0,5–0,7 gram. Harga resmi Rp 834.000.',
    specs: [
      'Foto & harga resmi langsung dari Tokopedia J5 Ismoyo',
      'Pilihan aksen batu warna cantik & manis',
      'Lengkap dengan surat resmi asli Toko Mas J5 Ismoyo',
    ],
  },

  // =========================================================================
  // 4. ANTAM LOGAM MULIA (OPSI TAMBAHAN — 5 PRODUK RESMI logammulia.com)
  // 100% Foto Produk Asli & Harga Resmi: https://logammulia.com/harga-emas
  // =========================================================================
  {
    id: 'antam-05g',
    sku: 'ANT-CE-005',
    name: 'ANTAM Emas Batangan CertiEye — 0,5 Gram',
    brand: 'ANTAM',
    brandLabel: 'ANTAM LM',
    category: 'ANTAM (Opsi Tambahan)',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 LBMA Fine Gold',
    weightGrams: 0.5,
    weightDisplay: '0,5 gram',
    basePrice: ANTAM_RATES.bars[0.5],
    buybackEstimate: Math.round(0.5 * ANTAM_RATES.buybackPerGram),
    jastipFee: 20000,
    taxApplicable: true,
    stock: 4,
    stockStatus: 'Ready',
    stockLabel: 'Ready • Stok 4',
    badge: 'Opsi Tambahan',
    popularityRank: 46,
    image: '/images/official/antam-certieye-05g.webp',
    imageFallback: '/images/official/antam-certieye-05g.jpg',
    sourceUrl: 'https://logammulia.com/product/emas-perak',
    sourceName: 'logammulia.com',
    originStore: 'Pengadaan Resmi ANTAM LM — Wilayah Solo (CertiEye)',
    packaging: 'CertiCard Press Resmi ANTAM (0,5 Gram)',
    certificate: 'Terintegrasi QR CertiEye + Faktur Asli BELM',
    description:
      'Emas batangan ANTAM CertiEye 0,5 gram resmi PT Antam Tbk. Harga dasar resmi logammulia.com Rp 1.303.500 (buyback Rp 1.075.000).',
    specs: [
      'Foto asli & harga resmi langsung dari logammulia.com',
      'Scan QR CertiEye terverifikasi AUTHENTICATED',
      'Faktur resmi BELM + PPh 22 sesuai ketentuan',
    ],
  },
  {
    id: 'antam-1g',
    sku: 'ANT-CE-010',
    name: 'ANTAM Emas Batangan CertiEye — 1 Gram',
    brand: 'ANTAM',
    brandLabel: 'ANTAM LM',
    category: 'ANTAM (Opsi Tambahan)',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 LBMA Fine Gold',
    weightGrams: 1,
    weightDisplay: '1 gram',
    basePrice: ANTAM_RATES.bars[1],
    buybackEstimate: ANTAM_RATES.buybackPerGram,
    jastipFee: 25000,
    taxApplicable: true,
    stock: 4,
    stockStatus: 'Ready',
    stockLabel: 'Ready • Stok 4',
    badge: 'Opsi Tambahan',
    popularityRank: 47,
    image: '/images/official/antam-certieye-1g.webp',
    imageFallback: '/images/official/antam-certieye-1g.jpg',
    sourceUrl: 'https://logammulia.com/product/emas-perak',
    sourceName: 'logammulia.com',
    originStore: 'Pengadaan Resmi ANTAM LM — Wilayah Solo (CertiEye)',
    packaging: 'CertiCard Press Resmi ANTAM (1 Gram)',
    certificate: 'Terintegrasi QR CertiEye + Faktur Asli BELM',
    description:
      'Emas batangan ANTAM CertiEye 1 gram resmi bersertifikasi internasional LBMA. Harga dasar resmi logammulia.com Rp 2.507.000 (buyback Rp 2.150.000).',
    specs: [
      'Foto asli & harga resmi langsung dari logammulia.com',
      'Scan QR CertiEye terverifikasi AUTHENTICATED',
      'Melayani titip beli dan jual kembali (buyback)',
    ],
  },
  {
    id: 'antam-5g',
    sku: 'ANT-CE-050',
    name: 'ANTAM Emas Batangan CertiEye — 5 Gram',
    brand: 'ANTAM',
    brandLabel: 'ANTAM LM',
    category: 'ANTAM (Opsi Tambahan)',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 LBMA Fine Gold',
    weightGrams: 5,
    weightDisplay: '5 gram',
    basePrice: ANTAM_RATES.bars[5],
    buybackEstimate: 5 * ANTAM_RATES.buybackPerGram,
    jastipFee: 45000,
    taxApplicable: true,
    stock: 2,
    stockStatus: 'Ready',
    stockLabel: 'Ready • Stok 2',
    badge: 'Opsi Tambahan',
    popularityRank: 48,
    image: '/images/official/antam-certieye-5g.webp',
    imageFallback: '/images/official/antam-certieye-5g.jpg',
    sourceUrl: 'https://logammulia.com/product/emas-perak',
    sourceName: 'logammulia.com',
    originStore: 'Pengadaan Resmi ANTAM LM — Wilayah Solo (CertiEye)',
    packaging: 'CertiCard Press Resmi ANTAM (5 Gram)',
    certificate: 'CertiEye + Faktur Resmi PPh 22 BELM',
    description:
      'Pecahan 5 gram ANTAM CertiEye resmi PT Antam Tbk. Harga dasar resmi logammulia.com Rp 12.350.000 (buyback Rp 10.750.000).',
    specs: [
      'Foto asli & harga resmi langsung dari logammulia.com',
      'Video HD hasil scan CertiEye sebelum dikirim',
      'Wajib packing kayu & asuransi penuh untuk ekspedisi',
    ],
  },
  {
    id: 'antam-10g',
    sku: 'ANT-CE-100',
    name: 'ANTAM Emas Batangan CertiEye — 10 Gram',
    brand: 'ANTAM',
    brandLabel: 'ANTAM LM',
    category: 'ANTAM (Opsi Tambahan)',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 LBMA Fine Gold',
    weightGrams: 10,
    weightDisplay: '10 gram',
    basePrice: ANTAM_RATES.bars[10],
    buybackEstimate: 10 * ANTAM_RATES.buybackPerGram,
    jastipFee: 65000,
    taxApplicable: true,
    stock: 0,
    stockStatus: 'Pre-order',
    stockLabel: 'Pre-order',
    badge: 'Opsi Tambahan',
    popularityRank: 49,
    image: '/images/official/antam-certieye-10g.webp',
    imageFallback: '/images/official/antam-certieye-10g.jpg',
    sourceUrl: 'https://logammulia.com/product/emas-perak',
    sourceName: 'logammulia.com',
    originStore: 'Pengadaan Resmi ANTAM LM — Wilayah Solo (CertiEye)',
    packaging: 'CertiCard Press Resmi ANTAM (10 Gram)',
    certificate: 'CertiEye + Faktur Asli BELM',
    description:
      'Pecahan 10 gram ANTAM CertiEye resmi PT Antam Tbk. Harga dasar resmi logammulia.com Rp 24.620.000 (buyback Rp 21.500.000).',
    specs: [
      'Foto asli & harga resmi langsung dari logammulia.com',
      'Faktur pajak PPh 22 resmi (0,25% NPWP / 0,30% Non)',
      'Tersedia COD, Ambil di Rumah, atau JNE Gold',
    ],
  },
  {
    id: 'antam-batik-10g',
    sku: 'ANT-BT-100',
    name: 'ANTAM Batik Seri II Purbo Negoro — 10 Gram',
    brand: 'ANTAM',
    brandLabel: 'ANTAM LM',
    category: 'ANTAM (Opsi Tambahan)',
    itemCategory: 'Logam Mulia',
    karat: '24K',
    purity: '24K • 999.9 LBMA Fine Gold',
    weightGrams: 10,
    weightDisplay: '10 gram',
    basePrice: 25570000,
    buybackEstimate: 10 * ANTAM_RATES.buybackPerGram,
    jastipFee: 75000,
    taxApplicable: true,
    stock: 0,
    stockStatus: 'Habis',
    stockLabel: 'Habis',
    badge: 'Edisi Kolektor',
    popularityRank: 50,
    image: '/images/official/antam-batik-purbo-10g.webp',
    imageFallback: '/images/official/antam-batik-purbo-10g.jpg',
    sourceUrl: 'https://logammulia.com/product/catalog/A02.A03?title=Emas%20Batangan%20Batik',
    sourceName: 'logammulia.com',
    originStore: 'Pengadaan Resmi ANTAM LM — Wilayah Solo (Stok Terbatas)',
    packaging: 'Kotak Eksklusif Batik Indonesia Series + Sertifikat',
    certificate: 'Sertifikat Khusus Batik Series + Faktur BELM',
    description:
      'Emas Batangan Batik Seri II motif Purbo Negoro 10 gram resmi PT Antam Tbk (harga dasar Rp 25.570.000). Status stok di logammulia.com sedang habis — hubungi WA NJ untuk antrean restock.',
    specs: [
      'Foto asli & harga resmi langsung dari logammulia.com',
      'Ukiran presisi tinggi motif Batik Purbo Negoro',
      'Dilengkapi asuransi pengiriman penuh saat tersedia',
    ],
  },
];

// =========================================================================
// LOADER LIVE prices.json + WORLD GOLD SPOT REFERENCE
// =========================================================================
export function mergeProductsWithPrices(
  baseProducts: GoldProduct[],
  payload: PricesPayload | null
): GoldProduct[] {
  if (!payload || !Array.isArray(payload.items)) return baseProducts;
  const map = new Map(payload.items.map((item) => [item.id, item]));
  return baseProducts.map((p) => {
    const live = map.get(p.id);
    if (!live) return p;
    return {
      ...p,
      basePrice: live.hargaBeli,
      priceMax: live.hargaBeliMax !== undefined ? live.hargaBeliMax : p.priceMax,
      buybackEstimate: live.buyback,
      jastipFee: live.feeJastip ?? p.jastipFee,
      stock: live.stok,
      stockStatus: live.stok === 0 && live.status === 'Ready' ? 'Habis' : live.status,
      stockLabel: live.stockLabel ?? p.stockLabel,
    };
  });
}

export async function fetchLivePricesJson(): Promise<PricesPayload | null> {
  try {
    const res = await fetch(`${PRICES_JSON_URL}?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as PricesPayload;
    return data;
  } catch {
    return null;
  }
}

export async function fetchWorldGoldSpot(fallback: WorldSpotRef): Promise<WorldSpotRef> {
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 3500);
    const res = await fetch('https://api.gold-api.com/price/XAU', {
      signal: controller.signal,
    });
    window.clearTimeout(timer);
    if (!res.ok) return fallback;
    const json = (await res.json()) as { price?: number };
    if (typeof json.price === 'number' && json.price > 500) {
      // Konversi referensi pasar dunia XAU/USD per troy oz (31.1035g)
      const usdPerOz = Number(json.price.toFixed(2));
      const approxIdrPerGram = Math.round((usdPerOz / 31.1035) * 16000);
      return {
        usdPerOz,
        idrPerGram: approxIdrPerGram,
        label: 'Referensi Pasar Dunia (XAU/USD Live)',
        isLiveApi: true,
      };
    }
    return fallback;
  } catch {
    return fallback;
  }
}

// =========================================================================
// 3 PILIHAN PENGAMBILAN / PENGIRIMAN RESMI NJ
// =========================================================================
export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'cod',
    name: 'COD — Ketemuan Langsung & Bayar di Tempat',
    shortLabel: 'COD (Tanpa Ongkir)',
    methodKey: 'COD',
    courier: 'Ketemuan Langsung Area Sragen / Solo & Sekitarnya',
    eta: 'Sesuai Kesepakatan Jadwal via WA',
    baseCost: 0,
    woodenCrateFee: 0,
    insuranceRate: 0,
    coverage: 'Cek fisik emas & nota asli langsung di tempat — konfirmasi jadwal via WA NJ',
    isPickupOrCod: true,
    recommended: true,
  },
  {
    id: 'ambil-rumah',
    name: 'Ambil di Rumah — Lokasi Mbak Jannah (Sragen)',
    shortLabel: 'Ambil di Rumah (Tanpa Ongkir)',
    methodKey: 'Ambil di Rumah',
    courier: 'Datang Langsung ke Mororejo RT16 RW 07 Sambiduwur, Kec. Tanon, Sragen',
    eta: `Sesuai Janji Temu via WA (${WA_DISPLAY})`,
    baseCost: 0,
    woodenCrateFee: 0,
    insuranceRate: 0,
    coverage: 'Tanpa ongkir! Cek langsung keaslian & surat resmi di rumah Mbak Jannah',
    isPickupOrCod: true,
  },
  {
    id: 'jne-gold',
    name: 'Kirim via Ekspedisi — JNE Gold Berasuransi Penuh',
    shortLabel: 'Kirim via Ekspedisi (JNE Gold)',
    methodKey: 'Kirim',
    courier: 'JNE Express YES / Gold + Packing Kayu',
    eta: '1–2 Hari Kerja (Seluruh Indonesia)',
    baseCost: 38000,
    woodenCrateFee: 25000,
    insuranceRate: 0.0035,
    coverage: 'Proteksi penuh 100% sesuai nilai deklarasi nota resmi + wajib packing kayu',
  },
  {
    id: 'paxel-insured',
    name: 'Kirim via Ekspedisi — Paxel Insured Same-Day / Next-Day',
    shortLabel: 'Kirim via Ekspedisi (Paxel Insured)',
    methodKey: 'Kirim',
    courier: 'Paxel Proteksi Barang Berharga',
    eta: 'Hari yang Sama / 1 Hari Kerja (Jawa–Bali–Kota Besar)',
    baseCost: 32000,
    woodenCrateFee: 15000,
    insuranceRate: 0.003,
    coverage: 'Handling khusus dengan asuransi barang berharga & segel hologram',
  },
];

export const BOUTIQUE_LOCATIONS: BoutiqueLocation[] = [
  {
    id: 'semar-solo-radjiman',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    city: 'Kota Solo (Coyudan)',
    branchName: 'Semar Nusantara Solo — Jl. Dr. Radjiman',
    address: 'Jl. Dr. Radjiman No. 285, Kawasan Emas Coyudan / Barat Pasar Kadipolo, Kota Surakarta',
    runnerSchedule: 'Senin – Minggu • 08.00 – 19.00 WIB',
    status: 'Runner Standby',
  },
  {
    id: 'semar-jawa-dawung',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    city: 'Kota Solo (Serengan)',
    branchName: 'Toko Mas Jawa (Semar Jawa) — Cabang Dawung',
    address: 'Jl. Yos Sudarso No. 326, Dawung, Kec. Serengan, Kota Surakarta, Jawa Tengah 57155',
    runnerSchedule: 'Setiap Hari • 08.00 – 17.00 WIB',
    status: 'Runner Standby',
  },
  {
    id: 'semar-jawa-sgm',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    city: 'Kota Solo (Laweyan)',
    branchName: 'Toko Mas Jawa (Semar Jawa) — Solo Grand Mall',
    address: 'Neo Solo Grand Mall Lt. GF Unit 3A–3B, Jl. Slamet Riyadi No. 273, Penumping, Surakarta',
    runnerSchedule: 'Setiap Hari • 10.00 – 21.00 WIB',
    status: 'Runner Standby',
  },
  {
    id: 'semar-jawa-paragon',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    city: 'Kota Solo (Banjarsari)',
    branchName: 'Toko Mas Jawa (Semar Jawa) — Solo Paragon Mall',
    address: 'Solo Paragon Lifestyle Mall Lt. UG Blok 05, Jl. Yosodipuro No. 133, Mangkubumen, Surakarta',
    runnerSchedule: 'Setiap Hari • 10.00 – 22.00 WIB',
    status: 'Jadwal Rutin',
  },
  {
    id: 'ismoyo-solo',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    city: 'Kota Solo & Solo Raya',
    branchName: 'Toko Mas J5 Ismoyo — Pasar Legi Solo & Solo Baru',
    address: 'Jl. Letjen S. Parman No. 65, Setabelan, Banjarsari, Surakarta & Cabang Solo Baru / Sukoharjo',
    runnerSchedule: 'Senin – Minggu • 08.00 – 17.00 WIB',
    status: 'Runner Standby',
  },
  {
    id: 'antam-solo',
    brand: 'ANTAM',
    brandLabel: 'ANTAM LM',
    city: 'Wilayah Solo (Opsi)',
    branchName: 'Pengadaan Resmi ANTAM LM — Wilayah Solo',
    address: 'Pembelian resmi terverifikasi CertiEye (logammulia.com & mitra resmi Solo Raya) — COD Solo / Sragen',
    runnerSchedule: 'Senin – Jumat • 08.30 – 15.00 WIB',
    status: 'Jadwal Rutin',
  },
];

export const RUNNER_SCHEDULE: RunnerScheduleItem[] = [
  {
    day: 'Senin',
    time: '09:00 – 15:30 WIB',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    activity: 'Belanja Batch Pagi SMG Press 24K & Perhiasan 10K/17K (NWG)',
    branch: 'Semar Nusantara Solo — Jl. Dr. Radjiman (Coyudan)',
    slotsTotal: 25,
    slotsLeft: 5,
    type: 'Belanja Gerai',
  },
  {
    day: 'Selasa',
    time: '09:30 – 16:00 WIB',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    activity: 'Jastip Logam Mulia Jawa Gold 24K & Live Perhiasan CLARETTA / Rosèe',
    branch: 'Toko Mas Jawa Solo — Cabang Dawung & Solo Grand Mall',
    slotsTotal: 25,
    slotsLeft: 7,
    type: 'Live Shopping',
  },
  {
    day: 'Rabu',
    time: '09:30 – 16:00 WIB',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    activity: 'Jastip Beli & Buyback Perhiasan Emas 10K Resmi J5 Ismoyo',
    branch: 'Toko Mas J5 Ismoyo — Pasar Legi Solo & Solo Baru',
    slotsTotal: 25,
    slotsLeft: 6,
    type: 'Belanja Gerai',
  },
  {
    day: 'Kamis',
    time: '10:00 – 16:30 WIB',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    activity: 'Live Shopping Custom Model (Nikita Willy Gold & In Your Seoul)',
    branch: 'Semar Nusantara Solo Coyudan & Toko Mas Jawa Solo Paragon',
    slotsTotal: 30,
    slotsLeft: 8,
    type: 'Live Shopping',
  },
  {
    day: 'Jumat',
    time: '08:30 – 14:30 WIB',
    brand: 'ANTAM',
    brandLabel: 'ANTAM LM',
    activity: 'Batch Tambahan ANTAM CertiEye 0,5g–10g & Gift / Batik Series',
    branch: 'Pengadaan Resmi ANTAM LM — Wilayah Solo (CertiEye)',
    slotsTotal: 20,
    slotsLeft: 4,
    type: 'Belanja Gerai',
  },
  {
    day: 'Sabtu',
    time: '09:30 – 16:00 WIB',
    brand: 'SEMAR_JAWA',
    brandLabel: '3 Brand Utama',
    activity: 'Weekend Mega Jastip Semar Nusantara, Semar Jawa & Ismoyo + COD',
    branch: 'Gerai Wilayah Solo (Coyudan, Dawung, Pasar Legi) & COD Sragen',
    slotsTotal: 35,
    slotsLeft: 10,
    type: 'Live Shopping',
  },
];

export const DEMO_TRACKING_ORDERS: Record<string, TrackingOrder> = {
  'NJ-2611-8902': {
    orderId: 'NJ-2611-8902',
    customerName: 'Ibu Rahmawati Kusuma',
    city: 'Sragen, Jawa Tengah',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    transactionType: 'Beli',
    itemsSummary: '1× SMG Press 24K 5g + 1× SMG Press 24K 1g (Total 6g)',
    totalValue: 13267000,
    branchSource: 'Semar Nusantara Solo — Jl. Dr. Radjiman (Coyudan)',
    runnerName: 'Tim NJ Concierge (Mbak Jannah)',
    receiptNo: 'SMR-SLO-20261125-1184',
    courierName: 'Ambil di Rumah — Lokasi Mbak Jannah (Tanpa Ongkir)',
    resiNumber: 'Janji Temu 25 Nov 2026 • 16:00 WIB',
    insurancePolicy: 'SERAH TERIMA LANGSUNG',
    currentStep: 3,
    steps: [
      {
        title: 'Konfirmasi Pesanan & Lock Harga Harian',
        timestamp: '25 Nov 2026 • 09:05 WIB',
        detail:
          'Pesanan SMG Press 5g & 1g masuk batch belanja pagi tanpa markup harga toko.',
        completed: true,
      },
      {
        title: 'Pembelian di Gerai Resmi Semar Nusantara Solo',
        timestamp: '25 Nov 2026 • 10:42 WIB',
        detail:
          'Transaksi selesai di kasir resmi Semar Nusantara Solo (Jl. Dr. Radjiman). Surat toko asli sudah terbit.',
        completed: true,
      },
      {
        title: 'Verifikasi Fisik, Timbang Digital & Kelengkapan Surat',
        timestamp: '25 Nov 2026 • 12:15 WIB',
        detail:
          'Seluruh fisik emas dan nota asli telah difoto & dikirimkan ke WhatsApp pembeli.',
        completed: true,
      },
      {
        title: 'Siap Diambil di Rumah Mbak Jannah (Sragen)',
        timestamp: '25 Nov 2026 • 14:00 WIB',
        detail:
          'Pesanan sudah siap di Mororejo RT16 RW 07 Sambiduwur, Kec. Tanon, Sragen. Jadwal pengambilan terkonfirmasi pukul 16:00 WIB.',
        completed: true,
      },
      {
        title: 'Serah Terima & Selesai',
        timestamp: 'Menunggu Kedatangan Pembeli',
        detail: 'Pembeli memeriksa fisik emas & surat resmi langsung bersama Mbak Jannah.',
        completed: false,
      },
    ],
  },
  'NJ-2611-8841': {
    orderId: 'NJ-2611-8841',
    customerName: 'Nadia Pramesti',
    city: 'Bandung, Jawa Barat',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    transactionType: 'Beli',
    itemsSummary: '1× Jawa Gold 24K 5g (Semar Jawa) + 1× Cincin Pinzy 10K (Ismoyo J5)',
    totalValue: 15138000,
    branchSource: 'Toko Mas Jawa Dawung Solo & Toko Mas J5 Ismoyo Pasar Legi Solo',
    runnerName: 'Tim NJ Concierge (Runner #02)',
    receiptNo: 'ISM-J5-20261124-0392 & TMJ-SLO-0192',
    courierName: 'JNE Gold Shipment (Packing Kayu + Asuransi 100%)',
    resiNumber: 'JNEG26118841009ID',
    insurancePolicy: 'POL-JNE-NJ-884192',
    currentStep: 3,
    steps: [
      {
        title: 'Lock Harga Harian & Konfirmasi via WA NJ',
        timestamp: '24 Nov 2026 • 08:45 WIB',
        detail: 'Pesanan gabungan Jawa Gold 5g & Cincin Pinzy 10K J5 dikonfirmasi via WA NJ.',
        completed: true,
      },
      {
        title: 'Pembelian Langsung di Gerai Resmi Wilayah Solo',
        timestamp: '24 Nov 2026 • 10:30 WIB',
        detail: 'Nota pembelian resmi asli dari Toko Mas Jawa Dawung Solo & J5 Ismoyo Solo terbit & difoto.',
        completed: true,
      },
      {
        title: 'Quality Check & Video Dokumentasi Pra-Segel',
        timestamp: '24 Nov 2026 • 11:25 WIB',
        detail: 'Video fisik emas, timbangan digital, serta nota asli dikirim HD ke WA pembeli.',
        completed: true,
      },
      {
        title: 'Packing Kayu, Segel Hologram & Kirim JNE Gold',
        timestamp: '24 Nov 2026 • 14:15 WIB',
        detail:
          'Paket berasuransi penuh 100% nilai nota sedang dalam perjalanan menuju Bandung.',
        completed: true,
      },
      {
        title: 'Diterima Pembeli & Konfirmasi Unboxing',
        timestamp: 'Estimasi 25 Nov 2026 • 13:00 WIB',
        detail: 'Mohon rekam video unboxing tanpa jeda untuk aktivasi garansi asuransi.',
        completed: false,
      },
    ],
  },
  'NJ-2611-8755': {
    orderId: 'NJ-2611-8755',
    customerName: 'dr. Clarissa Wijaya',
    city: 'Surabaya, Jawa Timur',
    brand: 'ANTAM',
    brandLabel: 'ANTAM LM',
    transactionType: 'Beli',
    itemsSummary: '1× ANTAM CertiEye 10g (Opsi Tambahan)',
    totalValue: 24858100,
    branchSource: 'Pengadaan Resmi ANTAM LM — Wilayah Solo',
    runnerName: 'Tim NJ Concierge (Senior Runner)',
    receiptNo: 'ANT-SLO-20261123-0741',
    certiCode: 'LM-9999-26-A849201 (AUTHENTICATED)',
    courierName: 'JNE Gold Shipment (Packing Kayu + Asuransi 100%)',
    resiNumber: 'JNEG26118755118ID',
    insurancePolicy: 'POL-JNE-NJ-875512',
    currentStep: 4,
    steps: [
      {
        title: 'Lock Harga Harian & Verifikasi NPWP',
        timestamp: '23 Nov 2026 • 08:35 WIB',
        detail: 'Tarif PPh 22 0,25% (NPWP) diverifikasi untuk pecahan ANTAM 10g.',
        completed: true,
      },
      {
        title: 'Pengadaan Resmi ANTAM LM Wilayah Solo',
        timestamp: '23 Nov 2026 • 10:12 WIB',
        detail: 'Faktur pembelian resmi ANTAM #0741 terbit atas nama pembeli.',
        completed: true,
      },
      {
        title: 'Uji Scan CertiEye Berstatus AUTHENTICATED',
        timestamp: '23 Nov 2026 • 10:55 WIB',
        detail: 'Video scan CertiEye resmi telah dikirimkan ke WhatsApp pembeli.',
        completed: true,
      },
      {
        title: 'Pengiriman JNE Gold Packing Kayu & Asuransi',
        timestamp: '23 Nov 2026 • 14:10 WIB',
        detail: 'Paket tiba di hub Surabaya dengan segel utuh.',
        completed: true,
      },
      {
        title: 'Diterima Pembeli & Terverifikasi Utuh',
        timestamp: '24 Nov 2026 • 11:20 WIB',
        detail: 'Pembeli mengonfirmasi emas ANTAM 10g & faktur asli diterima sempurna.',
        completed: true,
      },
    ],
  },
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testi-1',
    name: 'Ibu Dewi Anggraini',
    city: 'Sragen, Jawa Tengah',
    verifiedDate: '21 Nov 2026',
    brand: 'SEMAR_NUSANTARA',
    brandLabel: 'Semar Nusantara',
    itemPurchased: 'SMG Press 24K 5g & Gelang NWG 17K',
    rating: 5,
    quote:
      'Alhamdulillah langganan di NJ karena bisa ambil langsung di rumah Mbak Jannah tanpa ongkir. Orangnya ramah, amanah banget, harga emas persis sesuai nota toko dan surat aslinya lengkap semua.',
    proofTag: 'Ambil di Rumah Sragen • Surat Asli',
  },
  {
    id: 'testi-2',
    name: 'Rina Puspitasari',
    city: 'Solo, Jawa Tengah',
    verifiedDate: '18 Nov 2026',
    brand: 'SEMAR_JAWA',
    brandLabel: 'Semar Jawa',
    itemPurchased: 'Jual & Beli Emas Semar Jawa 5g',
    rating: 5,
    quote:
      'Kemarin coba jual emas Semar Jawa lewat NJ sekaligus tukar beli pecahan baru. Prosesnya cepat banget, foto surat via WA langsung dikasih penawaran buyback transparan, pas COD dana langsung cair!',
    proofTag: 'Bisa COD • Buyback Cepat Cair',
  },
  {
    id: 'testi-3',
    name: 'Putri Larasati',
    city: 'Makassar',
    verifiedDate: '14 Nov 2026',
    brand: 'ISMOYO',
    brandLabel: 'Ismoyo (J5)',
    itemPurchased: 'Ismoyo Fine Gold (J5) 5g & Cincin 10K',
    rating: 5,
    quote:
      'Senang banget akhirnya bisa titip emas Ismoyo J5 dan Semar dari luar pulau tanpa was-was. Sebelum dikirim divideoin nota kasir & timbangannya, sampai Makassar utuh pakai packing kayu dan asuransi.',
    proofTag: 'JNE Gold Insured • 0% Markup',
  },
  {
    id: 'testi-4',
    name: 'dr. Clarissa Wijaya',
    city: 'Surabaya',
    verifiedDate: '10 Nov 2026',
    brand: 'ANTAM',
    brandLabel: 'ANTAM LM',
    itemPurchased: 'ANTAM CertiEye 10g (Opsi Tambahan)',
    rating: 5,
    quote:
      'Selain Semar dan Ismoyo, ternyata bisa sekalian titip ANTAM CertiEye juga. Video scan CertiEye dikirim jelas, faktur BELM resmi, dan fee jastipnya super terjangkau. Sangat terpercaya!',
    proofTag: 'CertiEye Verified • Pelayanan Premium',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Jual & Beli',
    question: 'Bagaimana cara jual emas (buyback) di NJ?',
    answer:
      `Sangat mudah dan cepat! Cukup 3 langkah: (1) Kirim foto fisik emas beserta surat/nota resmi dan informasi beratnya ke WhatsApp NJ (${WA_DISPLAY}), (2) Kami berikan penawaran harga buyback transparan sesuai harga harian resmi, (3) Setelah verifikasi fisik (bisa COD, datang langsung ke rumah Mbak Jannah di Sragen, atau kirim paket), dana langsung cair via transfer bank atau tunai.`,
  },
  {
    category: 'Jual & Beli',
    question: 'Brand emas apa saja yang dilayani oleh NJ?',
    answer:
      'Fokus utama kami adalah 3 brand emas pilihan terbaik: Semar Nusantara (SMG Press 24K & Perhiasan 10K/17K termasuk Nikita Willy Gold), Semar Jawa (Jawa Toko Mas 999.9 Fine Gold & Perhiasan), serta Ismoyo (Fine Gold logo J5 & Perhiasan). Kami juga melayani ANTAM Logam Mulia (CertiEye, Gift & Batik Series) sebagai opsi tambahan.',
  },
  {
    category: 'COD & Pengiriman',
    question: 'Apakah benar bisa COD atau ambil langsung di rumah?',
    answer:
      `Betul sekali! Anda dapat memilih COD (ketemuan langsung & bayar di tempat) atau Ambil di Rumah langsung di alamat ${LOCATION_PIN_NAME}: ${LOCATION_ADDRESS}. Kedua pilihan ini TANPA ONGKIR (gratis), cukup konfirmasi jadwal dan lokasi terlebih dahulu via WhatsApp ${WA_DISPLAY}.`,
  },
  {
    category: 'COD & Pengiriman',
    question: 'Bagaimana keamanan jika saya berada di luar kota / luar pulau?',
    answer:
      'Untuk pengiriman luar kota, kami hanya menggunakan ekspedisi berasuransi penuh seperti JNE Gold Shipment atau Paxel Insured dengan deklarasi nilai 100% sesuai nota, kotak discreet tanpa tulisan "emas", segel tamper-evident, dan wajib packing kayu. Pastikan merekam video unboxing tanpa jeda saat paket diterima untuk mengaktifkan proteksi asuransi penuh.',
  },
  {
    category: 'Keaslian & Surat',
    question: 'Apakah setiap pembelian dilengkapi surat resmi asli toko?',
    answer:
      'Wajib 100%! Setiap keping logam mulia maupun perhiasan dari Semar Nusantara, Semar Jawa, dan Ismoyo selalu disertai Surat Resmi (Nota Toko Asli) dari gerai pembelian sehingga mudah di-buyback atau tukar tambah di kemudian hari. Untuk ANTAM LM disertai faktur resmi BELM dan video hasil scan aplikasi CertiEye berstatus AUTHENTICATED.',
  },
  {
    category: 'Biaya & Pajak',
    question: 'Berapa biaya jastip di NJ dan apakah harga emas di-markup?',
    answer:
      'Kami menerapkan kebijakan 0% markup harga emas — harga dasar emas murni mengikuti nota resmi toko pada hari eksekusi. Anda hanya membayar Fee Jastip Flat yang sangat terjangkau mulai Rp15.000/item. Apabila kuota gerai/butik habis atau berat riil perhiasan lebih ringan dari estimasi, selisih dana kami refund 100% otomatis tanpa potongan.',
  },
  {
    category: 'Biaya & Pajak',
    question: 'Bagaimana aturan PPh 22 untuk pembelian ANTAM vs 3 brand utama?',
    answer:
      'Untuk pembelian Semar Nusantara, Semar Jawa, dan Ismoyo (J5), harga di nota toko sudah bersih tanpa tambahan PPh 22 terpisah. Khusus untuk opsi tambahan emas batangan ANTAM LM dari BELM, berlaku PPh Pasal 22 sesuai regulasi pemerintah sebesar 0,25% (dengan NPWP/NIK terpadan) atau 0,30% (Non-NPWP).',
  },
];

export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

// =========================================================================
// SISTEM MEMBER NJ — TIER, POIN & DATA MEMBER (KONFIGURABLE VIA members.json)
// =========================================================================
export type MemberTierKey = 'Member' | 'Silver' | 'Gold';

export interface MemberTierConfig {
  key: MemberTierKey;
  label: string;
  cardVariant: 'bronze' | 'silver' | 'gold';
  minGram: number;
  minTransaksi: number;
  feeDiscountPct: number;
  buybackBonusPerGram: number;
  freeFeePerMonth: number;
  shortRule: string;
  benefits: string[];
}

export interface MemberPointRules {
  pointsPerGram: number;
  redeemPoints: number;
  redeemDiscountRp: number;
  summary: string[];
}

export type Member = {
  id: string; // NJ-2026-XXXX
  nama: string;
  wa: string; // simpan format 628xxx, jangan tampil full ke publik
  alamat?: string;
  tanggalLahir?: string;
  sumberInfo?: string;
  tanggalBergabung: string; // YYYY-MM-DD
  tier: MemberTierKey;
  totalGram: number;
  totalTransaksi: number;
  poin: number;
  status: 'Aktif' | 'Menunggu Konfirmasi';
  isContoh?: boolean; // CONTOH — hapus sebelum deploy di public/members.json
};

export interface MemberRegistration {
  ref: string; // NJ-MEMBER-DAFTAR-YYYYMMDD-XXXX
  nama: string;
  wa: string;
  alamat?: string;
  tanggalLahir?: string;
  sumberInfo?: string;
  tanggalDaftar: string;
  status: 'Menunggu Konfirmasi';
}

export interface MembersPayload {
  pointRules: MemberPointRules;
  tiers: MemberTierConfig[];
  members: Member[];
}

export const DEFAULT_MEMBER_POINT_RULES: MemberPointRules = {
  pointsPerGram: 10,
  redeemPoints: 100,
  redeemDiscountRp: 15000,
  summary: [
    '1 gram transaksi (beli atau jual) = 10 poin',
    '100 poin = potongan fee Rp 15.000 (1× fee gratis)',
    'Poin tidak bisa diuangkan, hanya untuk potongan fee jastip',
  ],
};

export const DEFAULT_MEMBER_TIERS: MemberTierConfig[] = [
  {
    key: 'Member',
    label: 'Member (Bronze)',
    cardVariant: 'bronze',
    minGram: 0,
    minTransaksi: 0,
    feeDiscountPct: 0,
    buybackBonusPerGram: 0,
    freeFeePerMonth: 0,
    shortRule: 'Baru daftar • 0 gram',
    benefits: [
      'Harga member transparan (0% markup nota toko)',
      'Info stok emas & koleksi terbaru duluan via WA NJ',
      'Kartu Member Digital pribadi dengan QR verifikasi COD',
      'Kumpulkan 10 poin per 1 gram transaksi beli atau jual',
    ],
  },
  {
    key: 'Silver',
    label: 'Silver Member',
    cardVariant: 'silver',
    minGram: 5,
    minTransaksi: 3,
    feeDiscountPct: 20,
    buybackBonusPerGram: 5000,
    freeFeePerMonth: 0,
    shortRule: 'Total ≥ 5 gram ATAU ≥ 3 transaksi',
    benefits: [
      'Fee jastip diskon 20% di setiap transaksi',
      'Prioritas stok saat batch belanja gerai & kuota terbatas',
      'Buyback +Rp 5.000/gram dari harga buyback normal',
      'Poin tetap bertambah 10 poin per gram transaksi',
    ],
  },
  {
    key: 'Gold',
    label: 'Gold Member',
    cardVariant: 'gold',
    minGram: 15,
    minTransaksi: 10,
    feeDiscountPct: 50,
    buybackBonusPerGram: 10000,
    freeFeePerMonth: 1,
    shortRule: 'Total ≥ 15 gram ATAU ≥ 10 transaksi',
    benefits: [
      'Fee jastip diskon 50% di setiap transaksi',
      'Prioritas stok utama untuk 3 brand utama & ANTAM',
      'Buyback +Rp 10.000/gram dari harga buyback normal',
      'Free fee jastip untuk 1 item per bulan',
    ],
  },
];

// CONTOH — hapus sebelum deploy (sumber utama ada di public/members.json)
export const DEFAULT_SAMPLE_MEMBERS: Member[] = [
  {
    // CONTOH — hapus sebelum deploy
    isContoh: true,
    id: 'NJ-2026-4832',
    nama: 'Siti Nurhaliza (Contoh Silver)',
    wa: '6281100001111',
    alamat: 'Sragen, Jawa Tengah',
    tanggalBergabung: '2026-10-12',
    tier: 'Silver',
    totalGram: 7.5,
    totalTransaksi: 4,
    poin: 75,
    status: 'Aktif',
  },
  {
    // CONTOH — hapus sebelum deploy
    isContoh: true,
    id: 'NJ-2026-9104',
    nama: 'Anisa Rahma (Contoh Gold)',
    wa: '6281100002222',
    alamat: 'Surakarta, Jawa Tengah',
    tanggalBergabung: '2026-08-20',
    tier: 'Gold',
    totalGram: 18,
    totalTransaksi: 11,
    poin: 180,
    status: 'Aktif',
  },
];

export function normalizeIndonesianWa(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

export function maskWaForCard(wa: string): string {
  const norm = normalizeIndonesianWa(wa);
  const local = norm.startsWith('62') ? `0${norm.slice(2)}` : norm;
  if (local.length < 8) return '08**-****-****';
  const prefix = local.slice(0, 4);
  const suffix = local.slice(-4);
  return `${prefix}-****-${suffix}`;
}

export function formatWaFullPrivate(wa: string): string {
  const norm = normalizeIndonesianWa(wa);
  if (!norm) return wa;
  if (norm.startsWith('62') && norm.length >= 11) {
    const rest = norm.slice(2);
    return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
  }
  return `+${norm}`;
}

export function formatJoinDateId(isoDate: string): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (Number.isNaN(day) || monthIdx < 0 || monthIdx > 11) return isoDate;
  return `${day} ${months[monthIdx]} ${year}`;
}

export function computeEffectiveTier(
  totalGram: number,
  totalTransaksi: number,
  tiers: MemberTierConfig[],
  explicitTier?: MemberTierKey
): MemberTierKey {
  const gold = tiers.find((t) => t.key === 'Gold');
  const silver = tiers.find((t) => t.key === 'Silver');

  let calculated: MemberTierKey = 'Member';
  if (
    gold &&
    (totalGram >= gold.minGram || totalTransaksi >= gold.minTransaksi)
  ) {
    calculated = 'Gold';
  } else if (
    silver &&
    (totalGram >= silver.minGram || totalTransaksi >= silver.minTransaksi)
  ) {
    calculated = 'Silver';
  }

  // Jika kakak sudah menaikkan tier secara manual lebih tinggi, pertahankan yang tertinggi
  const rank: Record<MemberTierKey, number> = { Member: 0, Silver: 1, Gold: 2 };
  if (explicitTier && rank[explicitTier] > rank[calculated]) {
    return explicitTier;
  }
  return calculated;
}

export async function fetchLiveMembersJson(): Promise<MembersPayload | null> {
  try {
    const res = await fetch(`${MEMBERS_JSON_URL}?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as MembersPayload;
  } catch {
    return null;
  }
}

