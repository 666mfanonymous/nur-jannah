import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Shield,
  CheckCircle2,
  ShoppingBag,
  MessageCircle,
  Info,
  Banknote,
  Sparkles,
} from 'lucide-react';
import {
  PRICE_MATRIX,
  SHIPPING_OPTIONS,
  SEMAR_NUSANTARA_RATES,
  SEMAR_JAWA_RATES,
  ISMOYO_RATES,
  ANTAM_RATES,
  GoldProduct,
  BrandType,
  getWhatsAppUrl,
  formatIDR,
} from '../data/goldData';

export interface CalculatorPrefill {
  mode: 'BELI' | 'JUAL';
  brand: BrandType;
  weight: number;
  isJewelry?: boolean;
  karat?: '17K' | '10K';
  timestamp: number;
}

interface JastipCalculatorProps {
  onAddSimulatedItem: (product: GoldProduct, quantity: number) => void;
  prefill?: CalculatorPrefill | null;
}

type BuyOption = 'SEMAR_NUSANTARA' | 'SEMAR_JAWA' | 'ISMOYO' | 'PERHIASAN' | 'ANTAM';
type SellGoldType = 'LM_24K' | 'PERHIASAN_17K' | 'PERHIASAN_10K';

export const JastipCalculator: React.FC<JastipCalculatorProps> = ({
  onAddSimulatedItem,
  prefill,
}) => {
  const [tradeMode, setTradeMode] = useState<'BELI' | 'JUAL'>('BELI');

  // --- MODE BELI STATES ---
  const [buyOption, setBuyOption] = useState<BuyOption>('SEMAR_NUSANTARA');
  const [selectedWeight, setSelectedWeight] = useState<number>(5);
  const [jewelryKarat, setJewelryKarat] = useState<'17K' | '10K'>('17K');
  const [jewelryWeightInput, setJewelryWeightInput] = useState<string>('2.5');
  const [quantity, setQuantity] = useState<number>(1);
  const [hasNpwp, setHasNpwp] = useState<boolean>(true);
  const [shippingId, setShippingId] = useState<string>('cod');
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  // --- MODE JUAL (BUYBACK) STATES ---
  const [sellBrand, setSellBrand] = useState<BrandType>('SEMAR_NUSANTARA');
  const [sellType, setSellType] = useState<SellGoldType>('LM_24K');
  const [sellWeightInput, setSellWeightInput] = useState<string>('5');
  const [hasReceipt, setHasReceipt] = useState<boolean>(true);
  const [sellHandover, setSellHandover] = useState<'COD' | 'RUMAH' | 'PAKET'>('COD');

  useEffect(() => {
    if (!prefill) return;
    setTradeMode(prefill.mode);
    if (prefill.mode === 'JUAL') {
      setSellBrand(prefill.brand);
      setSellWeightInput(String(prefill.weight));
      if (prefill.isJewelry) {
        setSellType(prefill.karat === '10K' ? 'PERHIASAN_10K' : 'PERHIASAN_17K');
      } else {
        setSellType('LM_24K');
      }
    } else {
      if (prefill.isJewelry) {
        setBuyOption('PERHIASAN');
        setJewelryWeightInput(String(prefill.weight));
        setJewelryKarat(prefill.karat ?? '17K');
      } else {
        setBuyOption(prefill.brand);
        setSelectedWeight(prefill.weight);
      }
    }
  }, [prefill]);

  const parsedJewelryWeight = useMemo(() => {
    const num = parseFloat(jewelryWeightInput.replace(',', '.'));
    return Number.isFinite(num) && num > 0 ? Math.min(num, 100) : 1;
  }, [jewelryWeightInput]);

  const parsedSellWeight = useMemo(() => {
    const num = parseFloat(sellWeightInput.replace(',', '.'));
    return Number.isFinite(num) && num > 0 ? Math.min(num, 500) : 0;
  }, [sellWeightInput]);

  const availableWeights = useMemo(() => {
    if (buyOption === 'SEMAR_NUSANTARA') {
      return PRICE_MATRIX.filter((r) => r.semarNusantaraFee !== undefined);
    }
    if (buyOption === 'SEMAR_JAWA') {
      return PRICE_MATRIX.filter((r) => r.semarJawaFee !== undefined);
    }
    if (buyOption === 'ISMOYO') {
      return PRICE_MATRIX.filter((r) => r.ismoyoFee !== undefined);
    }
    return PRICE_MATRIX.filter((r) => r.antamFee !== undefined);
  }, [buyOption]);

  const activeWeightRow = useMemo(() => {
    const found = availableWeights.find((r) => r.weight === selectedWeight);
    return found ?? availableWeights.find((r) => r.weight === 1) ?? availableWeights[0];
  }, [availableWeights, selectedWeight]);

  const shipping = useMemo(
    () => SHIPPING_OPTIONS.find((s) => s.id === shippingId) ?? SHIPPING_OPTIONS[0],
    [shippingId]
  );

  // --- BUY CALCULATION (Strict: null when official price not yet set -> Tanya WA!) ---
  const buyCalc = useMemo(() => {
    let unitBasePrice: number | null = null;
    let unitFee = 20000;
    let unitBuyback: number | null = null;
    let totalGrams = 0;

    if (buyOption === 'SEMAR_NUSANTARA') {
      unitBasePrice = activeWeightRow.semarNusantaraPrice ?? null;
      unitFee = activeWeightRow.semarNusantaraFee ?? 20000;
      unitBuyback = activeWeightRow.weight * SEMAR_NUSANTARA_RATES.buybackPerGram;
      totalGrams = activeWeightRow.weight * quantity;
    } else if (buyOption === 'SEMAR_JAWA') {
      unitBasePrice = activeWeightRow.semarJawaPrice ?? null;
      unitFee = activeWeightRow.semarJawaFee ?? 20000;
      unitBuyback = SEMAR_JAWA_RATES.buybackPerGram
        ? activeWeightRow.weight * SEMAR_JAWA_RATES.buybackPerGram
        : null;
      totalGrams = activeWeightRow.weight * quantity;
    } else if (buyOption === 'ISMOYO') {
      unitBasePrice = activeWeightRow.ismoyoPrice ?? null;
      unitFee = activeWeightRow.ismoyoFee ?? 20000;
      unitBuyback = ISMOYO_RATES.buybackPerGram
        ? activeWeightRow.weight * ISMOYO_RATES.buybackPerGram
        : null;
      totalGrams = activeWeightRow.weight * quantity;
    } else if (buyOption === 'ANTAM') {
      unitBasePrice = activeWeightRow.antamPrice ?? null;
      unitFee = activeWeightRow.antamFee ?? 25000;
      unitBuyback = activeWeightRow.weight * ANTAM_RATES.buybackPerGram;
      totalGrams = activeWeightRow.weight * quantity;
    } else {
      // Perhiasan mengikuti harga harian & berat riil tag toko -> Tanya WA
      unitBasePrice = null;
      unitFee = parsedJewelryWeight <= 2 ? 20000 : parsedJewelryWeight <= 5 ? 35000 : 45000;
      unitBuyback = null;
      totalGrams = Number((parsedJewelryWeight * quantity).toFixed(2));
    }

    const subtotalGold = unitBasePrice !== null ? unitBasePrice * quantity : null;
    const taxRate = buyOption === 'ANTAM' ? (hasNpwp ? 0.0025 : 0.003) : 0;
    const pphTax = subtotalGold !== null ? Math.round(subtotalGold * taxRate) : 0;
    const totalJastipFee = unitFee * quantity;
    const shippingBase = shipping.baseCost + shipping.woodenCrateFee;
    const insuranceCost =
      subtotalGold !== null ? Math.round(subtotalGold * shipping.insuranceRate) : 0;
    const grandTotal =
      subtotalGold !== null
        ? subtotalGold + pphTax + totalJastipFee + shippingBase + insuranceCost
        : null;
    const effectivePerGram =
      grandTotal !== null && totalGrams > 0 ? Math.round(grandTotal / totalGrams) : null;

    return {
      unitBasePrice,
      unitFee,
      unitBuyback,
      totalGrams: Number(totalGrams.toFixed(2)),
      subtotalGold,
      taxRate,
      pphTax,
      totalJastipFee,
      shippingBase,
      insuranceCost,
      grandTotal,
      effectivePerGram,
      totalBuyback: unitBuyback !== null ? Math.round(unitBuyback * quantity) : null,
    };
  }, [buyOption, activeWeightRow, parsedJewelryWeight, quantity, hasNpwp, shipping]);

  // --- SELL (BUYBACK) CALCULATION (Strict: null -> Tanya WA, zero fake numbers!) ---
  const sellCalc = useMemo(() => {
    let ratePerGram: number | null = null;

    if (sellType === 'LM_24K') {
      if (sellBrand === 'SEMAR_NUSANTARA') ratePerGram = SEMAR_NUSANTARA_RATES.buybackPerGram;
      else if (sellBrand === 'ANTAM') ratePerGram = ANTAM_RATES.buybackPerGram;
      else if (sellBrand === 'SEMAR_JAWA') ratePerGram = SEMAR_JAWA_RATES.buybackPerGram;
      else ratePerGram = ISMOYO_RATES.buybackPerGram;
    } else {
      // Buyback perhiasan 17K & 10K bergantung surat & cek kondisi harian toko -> Tanya WA
      ratePerGram = null;
    }

    const grossValue =
      ratePerGram !== null ? Math.round(ratePerGram * parsedSellWeight) : null;
    const noReceiptDeduction =
      grossValue !== null ? (hasReceipt ? 0 : Math.round(grossValue * 0.04)) : null;
    const netReceive =
      grossValue !== null && noReceiptDeduction !== null
        ? Math.max(0, grossValue - noReceiptDeduction)
        : null;

    return {
      ratePerGram,
      grossValue,
      noReceiptDeduction,
      netReceive,
    };
  }, [sellBrand, sellType, parsedSellWeight, hasReceipt]);

  const handleAddSimulation = () => {
    if (buyCalc.unitBasePrice === null) return;
    const brandMap: Record<BuyOption, { brand: BrandType; label: string; img: string }> = {
      SEMAR_NUSANTARA: {
        brand: 'SEMAR_NUSANTARA',
        label: 'Semar Nusantara',
        img: './images/official/sn-smg-press-1g.jpg',
      },
      SEMAR_JAWA: {
        brand: 'SEMAR_JAWA',
        label: 'Semar Jawa',
        img: './images/catalog/semar-jawa-bar.jpg',
      },
      ISMOYO: {
        brand: 'ISMOYO',
        label: 'Ismoyo (J5)',
        img: './images/official/j5-cincin-pinzy-10k.jpg',
      },
      PERHIASAN: {
        brand: 'SEMAR_NUSANTARA',
        label: 'Perhiasan Resmi',
        img: './images/official/sn-cincin-velora-aeratec-17k.jpg',
      },
      ANTAM: {
        brand: 'ANTAM',
        label: 'ANTAM LM',
        img: './images/official/antam-certieye-1g.jpg',
      },
    };

    const meta = brandMap[buyOption];
    const simulatedProduct: GoldProduct = {
      id: `sim-${buyOption}-${activeWeightRow.weight}`,
      sku: `SIM-${buyOption.slice(0, 4)}`,
      name: `${meta.label} 24K — ${activeWeightRow.label}`,
      brand: meta.brand,
      brandLabel: meta.label,
      category:
        buyOption === 'SEMAR_NUSANTARA'
          ? 'Semar Nusantara'
          : buyOption === 'SEMAR_JAWA'
          ? 'Semar Jawa'
          : buyOption === 'ISMOYO'
          ? 'Ismoyo (J5)'
          : 'ANTAM (Opsi Tambahan)',
      purity: '24K • 999.9 Fine Gold',
      weightGrams: activeWeightRow.weight,
      basePrice: buyCalc.unitBasePrice,
      buybackEstimate: buyCalc.unitBuyback,
      jastipFee: buyCalc.unitFee,
      taxApplicable: buyOption === 'ANTAM',
      stock: 5,
      stockStatus: 'Ready',
      image: meta.img,
      originStore: `Gerai Resmi ${meta.label}`,
      packaging: `Kemasan Resmi ${meta.label}`,
      certificate: `Surat Resmi Asli ${meta.label}`,
      description: 'Ditambahkan dari kalkulator simulasi beli NJ.',
      specs: ['Harga 0% markup', 'Nota asli dilampirkan'],
    };

    onAddSimulatedItem(simulatedProduct, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const brandNameReadable = (b: BrandType) => {
    if (b === 'SEMAR_NUSANTARA') return 'Semar Nusantara';
    if (b === 'SEMAR_JAWA') return 'Semar Jawa (Jawa Toko Mas)';
    if (b === 'ISMOYO') return 'Ismoyo (J5)';
    return 'ANTAM LM';
  };

  const buyWhatsAppHref = () => {
    const itemDesc =
      buyOption === 'PERHIASAN'
        ? `Perhiasan ${jewelryKarat} ${parsedJewelryWeight}g x${quantity}`
        : `${brandNameReadable(buyOption)} 24K ${activeWeightRow.label} x${quantity}`;
    const totalLine =
      buyCalc.grandTotal !== null
        ? `• Estimasi Total Nett: ${formatIDR(buyCalc.grandTotal)}`
        : `• Mohon info harga resmi toko hari ini (+ Fee Jastip ${formatIDR(
            buyCalc.totalJastipFee
          )})`;
    return getWhatsAppUrl(
      `Halo NJ, saya ingin tanya harga / TITIP BELI EMAS:\n• Item: ${itemDesc}\n• Total Berat: ${buyCalc.totalGrams}g\n• Pengambilan/Kirim: ${shipping.name}\n${totalLine}\nMohon info ketersediaan stok hari ini.`
    );
  };

  const sellWhatsAppHref = () => {
    const typeLabel =
      sellType === 'LM_24K'
        ? 'Logam Mulia 24K'
        : sellType === 'PERHIASAN_17K'
        ? 'Perhiasan 17K'
        : 'Perhiasan 10K';
    const handoverLabel =
      sellHandover === 'COD'
        ? 'COD (Ketemuan Langsung)'
        : sellHandover === 'RUMAH'
        ? 'Antar ke Rumah Mbak Jannah (Sragen)'
        : 'Kirim Paket ke NJ';
    const estLine =
      sellCalc.netReceive !== null
        ? `• Estimasi Dana Cair (Kalkulator): ${formatIDR(sellCalc.netReceive)}`
        : `• Mohon penawaran harga buyback resmi hari ini`;
    return getWhatsAppUrl(
      `Halo NJ, saya ingin JUAL EMAS (Buyback):\n• Brand: ${brandNameReadable(
        sellBrand
      )}\n• Jenis: ${typeLabel}\n• Berat: ${parsedSellWeight} gram\n• Surat/Nota: ${
        hasReceipt ? 'Lengkap Ada Surat Resmi' : 'Tanpa Surat'
      }\n• Rencana Serah Terima: ${handoverLabel}\n${estLine}\nSaya siap kirim foto emas & suratnya.`
    );
  };

  return (
    <section
      id="kalkulator"
      className="scroll-mt-24 py-16 sm:py-20 lg:py-24 bg-marble-luxury border-b border-[#EAD3CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Mode Beli / Mode Jual Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
              Kalkulator Transparan Beli &amp; Jual
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3D2C2C] mt-2 leading-[1.12]">
              Simulasi{' '}
              <span className="italic text-gold-foil">Beli &amp; Jual (Buyback) Emas</span>
            </h2>
            <p className="text-sm sm:text-base text-[#7A5C5C] mt-3 leading-relaxed">
              Pilih <strong>Mode Beli</strong> untuk menghitung total titip beli beserta fee
              jastip &amp; opsi COD/ekspedisi, atau <strong>Mode Jual</strong> untuk melihat
              estimasi dana cair buyback emas Anda.
            </p>
          </div>

          <div className="inline-grid grid-cols-2 p-1.5 rounded-full bg-[#F3DAD3] border border-[#E2BFB5] shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setTradeMode('BELI')}
              className={`px-5 sm:px-7 min-h-[46px] rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 ${
                tradeMode === 'BELI' ? 'btn-gold' : 'text-[#6E4E4E] hover:text-[#3D2C2C]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Mode Beli
            </button>
            <button
              onClick={() => setTradeMode('JUAL')}
              className={`px-5 sm:px-7 min-h-[46px] rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 ${
                tradeMode === 'JUAL'
                  ? 'bg-[#B76E79] text-[#FFF9F7] shadow-md'
                  : 'text-[#6E4E4E] hover:text-[#3D2C2C]'
              }`}
            >
              <Banknote className="w-4 h-4" />
              Mode Jual (Buyback)
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MODE BELI                                                    */}
        {/* ============================================================ */}
        {tradeMode === 'BELI' ? (
          <div className="grid lg:grid-cols-12 gap-7 items-start">
            <div className="lg:col-span-7 card-luxury rounded-3xl p-5 sm:p-8 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2.5">
                  1. Pilih Brand / Jenis Emas
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'SEMAR_NUSANTARA', title: 'Semar Nusantara', sub: 'SMG Press 24K' },
                    { id: 'SEMAR_JAWA', title: 'Semar Jawa', sub: 'Jawa Gold 24K' },
                    { id: 'ISMOYO', title: 'Ismoyo (J5)', sub: 'Koleksi 10K • WA' },
                    { id: 'PERHIASAN', title: 'Perhiasan Emas', sub: '17K & 10K • WA' },
                    { id: 'ANTAM', title: 'ANTAM LM', sub: 'Opsi Tambahan' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setBuyOption(opt.id as BuyOption)}
                      className={`p-3 min-h-[58px] rounded-2xl border text-left transition-all cursor-pointer ${
                        buyOption === opt.id
                          ? 'bg-gradient-to-br from-[#F9EDEA] to-[#F3DAD3] border-[#C9A227] shadow-sm'
                          : 'bg-[#FFF9F7] border-[#ECD5CE] hover:border-[#B76E79]'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold text-[#3D2C2C]">
                        {opt.title}
                      </div>
                      <div className="text-[11px] text-[#8C4A55] font-medium mt-0.5">
                        {opt.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {buyOption !== 'PERHIASAN' ? (
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2.5">
                    2. Pilih Pecahan Gramasi
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableWeights.map((row) => {
                      const active = activeWeightRow.weight === row.weight;
                      return (
                        <button
                          key={row.weight}
                          onClick={() => setSelectedWeight(row.weight)}
                          className={`min-h-[44px] px-2.5 rounded-2xl border text-center font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            active
                              ? 'btn-gold border-[#C9A227]'
                              : 'bg-[#FFF9F7] border-[#ECD5CE] text-[#3D2C2C] hover:border-[#B76E79]'
                          }`}
                        >
                          {row.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2.5">
                      2. Pilih Kadar Perhiasan
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['17K', '10K'] as const).map((k) => (
                        <button
                          key={k}
                          onClick={() => setJewelryKarat(k)}
                          className={`p-3.5 min-h-[60px] rounded-2xl border text-left transition-all cursor-pointer ${
                            jewelryKarat === k
                              ? 'bg-[#B76E79] text-[#FFF9F7] border-[#B76E79]'
                              : 'bg-[#FFF9F7] text-[#3D2C2C] border-[#ECD5CE]'
                          }`}
                        >
                          <div className="font-bold text-sm">
                            Kadar {k} {k === '17K' ? '(Emas Tua)' : '(SQ5)'}
                          </div>
                          <div
                            className={`text-xs mt-0.5 ${
                              jewelryKarat === k ? 'text-[#FCE9E3]' : 'text-[#7A5C5C]'
                            }`}
                          >
                            Harga mengikuti nota toko (Tanya WA)
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2">
                      Perkiraan Berat Perhiasan (gram)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0.5}
                        max={50}
                        step={0.1}
                        value={jewelryWeightInput}
                        onChange={(e) => setJewelryWeightInput(e.target.value)}
                        className="w-32 min-h-[44px] px-3.5 rounded-2xl bg-[#F9EDEA]/60 border border-[#DFC0B6] font-mono text-base font-bold text-[#3D2C2C] focus:outline-none focus:border-[#C9A227]"
                      />
                      <span className="text-sm font-semibold text-[#7A5C5C]">gram</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity & NPWP */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2">
                    3. Jumlah Keping / Item
                  </label>
                  <div className="flex items-center rounded-full border border-[#E5C6BE] bg-[#F9EDEA]/60 overflow-hidden w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 text-lg font-bold text-[#3D2C2C] hover:bg-[#F3DAD3] cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-5 font-mono font-bold text-sm text-[#3D2C2C] min-w-[52px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="w-11 h-11 text-lg font-bold text-[#3D2C2C] hover:bg-[#F3DAD3] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {buyOption === 'ANTAM' && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2">
                      Tarif PPh 22 ANTAM
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setHasNpwp(true)}
                        className={`min-h-[44px] px-3 rounded-2xl border text-xs font-bold cursor-pointer ${
                          hasNpwp
                            ? 'bg-[#B76E79] text-[#FFF9F7] border-[#B76E79]'
                            : 'bg-[#FFF9F7] border-[#ECD5CE] text-[#6E5050]'
                        }`}
                      >
                        NPWP (0,25%)
                      </button>
                      <button
                        onClick={() => setHasNpwp(false)}
                        className={`min-h-[44px] px-3 rounded-2xl border text-xs font-bold cursor-pointer ${
                          !hasNpwp
                            ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#6E5010]'
                            : 'bg-[#FFF9F7] border-[#ECD5CE] text-[#6E5050]'
                        }`}
                      >
                        Non-NPWP (0,30%)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pickup / Shipping */}
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2.5">
                  4. Pilihan Pengambilan / Ekspedisi
                </label>
                <div className="space-y-2.5">
                  {SHIPPING_OPTIONS.map((opt) => {
                    const active = opt.id === shippingId;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setShippingId(opt.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          active
                            ? 'bg-[#F9EDEA] border-[#C9A227] shadow-sm'
                            : 'bg-[#FFF9F7] border-[#ECD5CE] hover:border-[#B76E79]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-[#3D2C2C]">
                              {opt.name}
                            </span>
                            {opt.recommended && (
                              <span className="px-2 py-0.5 rounded-full bg-[#B76E79] text-white text-[10px] font-bold">
                                Tanpa Ongkir
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#7A5C5C]">{opt.coverage}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-mono text-xs font-bold text-[#3D2C2C]">
                            {opt.baseCost === 0
                              ? 'GRATIS'
                              : formatIDR(opt.baseCost + opt.woodenCrateFee)}
                          </div>
                          <div className="text-[10px] text-[#9C7418] font-mono">
                            {opt.insuranceRate === 0
                              ? 'Cek Langsung'
                              : `Asuransi ${(opt.insuranceRate * 100).toFixed(2)}%`}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Buy Summary Statement */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="rounded-3xl bg-blush-silk text-[#3D2C2C] border border-[#DFB9AF] p-6 sm:p-7 shadow-[0_20px_50px_rgba(183,110,121,0.16)]">
                <div className="flex items-center gap-3 border-b border-[#E3C1B7] pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF9F7] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-[#3D2C2C]">
                      Rincian Biaya Titip Beli
                    </h3>
                    <p className="text-xs text-[#7A5C5C]">
                      Total Berat:{' '}
                      <strong className="text-[#8C4A55] font-mono">
                        {buyCalc.totalGrams} gram
                      </strong>{' '}
                      ({quantity} item)
                    </p>
                  </div>
                </div>

                <div className="py-5 space-y-3 text-sm border-b border-[#E3C1B7]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#6E5050]">Harga Dasar Emas (0% Markup)</span>
                    {buyCalc.subtotalGold !== null ? (
                      <span className="font-mono font-bold tabular-nums">
                        {formatIDR(buyCalc.subtotalGold)}
                      </span>
                    ) : (
                      <span className="font-editorial text-base font-bold text-[#8C4A55]">
                        Tanya WA
                      </span>
                    )}
                  </div>

                  {buyOption === 'ANTAM' && buyCalc.subtotalGold !== null && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#6E5050]">
                        PPh Pasal 22 ({(buyCalc.taxRate * 100).toFixed(2)}%)
                      </span>
                      <span className="font-mono tabular-nums">
                        {formatIDR(buyCalc.pphTax)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#6E5050]">
                      Fee Jastip Flat ({quantity}× {formatIDR(buyCalc.unitFee)})
                    </span>
                    <span className="font-mono font-bold text-[#9C7418] tabular-nums">
                      {formatIDR(buyCalc.totalJastipFee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#6E5050]">Ongkir &amp; Packing Kayu</span>
                    <span className="font-mono tabular-nums">
                      {buyCalc.shippingBase > 0
                        ? formatIDR(buyCalc.shippingBase)
                        : 'Rp 0 (Gratis)'}
                    </span>
                  </div>

                  {shipping.insuranceRate > 0 && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#6E5050] inline-flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#B76E79]" />
                        Premi Asuransi 100%
                      </span>
                      <span className="font-mono font-semibold text-[#8C4A55] tabular-nums">
                        {buyCalc.subtotalGold !== null
                          ? formatIDR(buyCalc.insuranceCost)
                          : `${(shipping.insuranceRate * 100).toFixed(2)}% nilai nota`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div className="py-5 space-y-3">
                  {buyCalc.grandTotal !== null ? (
                    <>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs uppercase tracking-[0.14em] text-[#7A5C5C] font-bold">
                          Total Estimasi Nett
                        </span>
                        <span className="font-mono text-2xl sm:text-3xl font-bold text-[#3D2C2C] tabular-nums">
                          {formatIDR(buyCalc.grandTotal)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-2xl bg-[#FFF9F7]/85 border border-[#E8CEC7]">
                          <div className="text-[10px] uppercase tracking-wider text-[#7A5C5C]">
                            Efektif / Gram
                          </div>
                          <div className="font-mono text-xs sm:text-sm font-bold text-[#3D2C2C] mt-0.5 tabular-nums">
                            {buyCalc.effectivePerGram
                              ? formatIDR(buyCalc.effectivePerGram)
                              : '—'}
                          </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#FFF9F7]/85 border border-[#E8CEC7]">
                          <div className="text-[10px] uppercase tracking-wider text-[#7A5C5C]">
                            Nilai Buyback Kini
                          </div>
                          <div className="font-mono text-xs sm:text-sm font-bold text-[#8C4A55] mt-0.5 tabular-nums">
                            {buyCalc.totalBuyback
                              ? formatIDR(buyCalc.totalBuyback)
                              : 'Tanya WA'}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#FFF9F7]/90 border border-[#E5C4BB] space-y-1">
                      <div className="text-xs uppercase tracking-[0.14em] text-[#B76E79] font-bold">
                        Harga Emas Mengikuti Nota Resmi Toko
                      </div>
                      <div className="font-editorial text-2xl font-bold text-[#3D2C2C]">
                        Tanya WA + Fee {formatIDR(buyCalc.totalJastipFee)}
                      </div>
                      <p className="text-xs text-[#6E5050]">
                        Klik tombol di bawah untuk langsung menanyakan rilis harga resmi hari ini
                        melalui WhatsApp NJ.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2.5">
                  {buyCalc.grandTotal !== null ? (
                    <>
                      <button
                        onClick={handleAddSimulation}
                        className="w-full min-h-[48px] px-5 rounded-full btn-gold font-bold text-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {addedFeedback ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Masuk Keranjang Titipan!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" /> Masukkan ke Keranjang Titipan
                          </>
                        )}
                      </button>

                      <a
                        href={buyWhatsAppHref()}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full min-h-[46px] px-5 rounded-full bg-[#FFF9F7] border-2 border-[#B76E79] text-[#8C4A55] font-bold text-xs sm:text-sm hover:bg-[#F9EDEA] transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Kunci Harga via WA NJ
                      </a>
                    </>
                  ) : (
                    <a
                      href={buyWhatsAppHref()}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full min-h-[48px] px-5 rounded-full btn-gold font-bold text-sm transition-all inline-flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Tanya Harga Resmi &amp; Titip via WA NJ
                    </a>
                  )}
                </div>

                <div className="mt-4 flex items-start gap-2 text-[11px] text-[#6E5050] leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-[#B76E79] shrink-0 mt-0.5" />
                  <span>
                    {shipping.isPickupOrCod
                      ? 'Untuk COD / Ambil di Rumah tanpa ongkir, konfirmasi jadwal & lokasi dulu via WA NJ (+62 856-4121-3142).'
                      : 'Nominal final persis mengikuti nota asli toko hari transaksi. Refund 100% otomatis jika ada selisih lebih.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* MODE JUAL (BUYBACK EMAS)                                     */
          /* ============================================================ */
          <div className="grid lg:grid-cols-12 gap-7 items-start">
            <div className="lg:col-span-7 card-luxury rounded-3xl p-5 sm:p-8 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2.5">
                  1. Pilih Brand Emas yang Ingin Dijual
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { id: 'SEMAR_NUSANTARA', label: 'Semar Nusantara' },
                      { id: 'SEMAR_JAWA', label: 'Semar Jawa' },
                      { id: 'ISMOYO', label: 'Ismoyo (J5)' },
                      { id: 'ANTAM', label: 'ANTAM LM' },
                    ] as { id: BrandType; label: string }[]
                  ).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSellBrand(b.id);
                        if (b.id === 'ANTAM') setSellType('LM_24K');
                      }}
                      className={`p-3 min-h-[50px] rounded-2xl border text-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        sellBrand === b.id
                          ? 'bg-[#B76E79] text-[#FFF9F7] border-[#B76E79] shadow-sm'
                          : 'bg-[#FFF9F7] text-[#3D2C2C] border-[#ECD5CE] hover:border-[#B76E79]'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2.5">
                  2. Jenis Emas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'LM_24K', label: 'Logam Mulia 24K', sub: 'Batangan / Press' },
                    {
                      id: 'PERHIASAN_17K',
                      label: 'Perhiasan 17K',
                      sub: 'Cek Surat • Tanya WA',
                      disabled: sellBrand === 'ANTAM',
                    },
                    {
                      id: 'PERHIASAN_10K',
                      label: 'Perhiasan 10K',
                      sub: 'Cek Surat • Tanya WA',
                      disabled: sellBrand === 'ANTAM',
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      disabled={t.disabled}
                      onClick={() => setSellType(t.id as SellGoldType)}
                      className={`p-3.5 min-h-[56px] rounded-2xl border text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        sellType === t.id
                          ? 'bg-[#F9EDEA] border-[#C9A227] text-[#3D2C2C]'
                          : 'bg-[#FFF9F7] border-[#ECD5CE] text-[#6E5050]'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold text-[#3D2C2C]">
                        {t.label}
                      </div>
                      <div className="text-[11px] text-[#8C4A55]">{t.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2">
                  3. Berat Emas yang Dijual (Gram)
                </label>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0.1}
                    max={500}
                    step={0.1}
                    value={sellWeightInput}
                    onChange={(e) => setSellWeightInput(e.target.value)}
                    placeholder="Contoh: 5"
                    className="w-36 min-h-[46px] px-4 rounded-2xl bg-[#F9EDEA]/70 border-2 border-[#DFC0B6] font-mono text-lg font-bold text-[#3D2C2C] focus:outline-none focus:border-[#C9A227]"
                  />
                  <span className="text-sm font-bold text-[#7A5C5C]">gram</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[0.5, 1, 2, 5, 10, 25].map((w) => (
                    <button
                      key={w}
                      onClick={() => setSellWeightInput(String(w))}
                      className={`px-3.5 min-h-[44px] rounded-full font-mono text-xs font-bold border transition-all cursor-pointer ${
                        parsedSellWeight === w
                          ? 'btn-gold border-[#C9A227]'
                          : 'bg-[#FFF9F7] border-[#ECD5CE] text-[#6E5050] hover:border-[#B76E79]'
                      }`}
                    >
                      {w}g
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2">
                    4. Kelengkapan Surat / Nota
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setHasReceipt(true)}
                      className={`min-h-[44px] px-3 rounded-2xl border text-xs font-bold cursor-pointer ${
                        hasReceipt
                          ? 'bg-[#B76E79] text-[#FFF9F7] border-[#B76E79]'
                          : 'bg-[#FFF9F7] border-[#ECD5CE] text-[#6E5050]'
                      }`}
                    >
                      Ada Surat Resmi
                    </button>
                    <button
                      onClick={() => setHasReceipt(false)}
                      className={`min-h-[44px] px-3 rounded-2xl border text-xs font-bold cursor-pointer ${
                        !hasReceipt
                          ? 'bg-[#F9EDEA] border-[#C9A227] text-[#3D2C2C]'
                          : 'bg-[#FFF9F7] border-[#ECD5CE] text-[#6E5050]'
                      }`}
                    >
                      Tanpa Surat
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A5C5C] block mb-2">
                    5. Cara Serah Terima
                  </label>
                  <select
                    value={sellHandover}
                    onChange={(e) => setSellHandover(e.target.value as typeof sellHandover)}
                    className="w-full min-h-[44px] px-3.5 rounded-2xl bg-[#F9EDEA]/60 border border-[#ECD5CE] text-xs sm:text-sm font-semibold text-[#3D2C2C] focus:outline-none focus:border-[#C9A227]"
                  >
                    <option value="COD">COD (Ketemuan Langsung)</option>
                    <option value="RUMAH">Datang ke Rumah Mbak Jannah (Sragen)</option>
                    <option value="PAKET">Kirim Paket Berasuransi ke NJ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Sell Payout Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="rounded-3xl bg-blush-silk text-[#3D2C2C] border border-[#DFB9AF] p-6 sm:p-7 shadow-[0_20px_50px_rgba(183,110,121,0.16)]">
                <div className="flex items-center gap-3 border-b border-[#E3C1B7] pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF9F7] border border-[#B76E79]/40 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5 text-[#B76E79]" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-[#3D2C2C]">
                      Penawaran Buyback NJ
                    </h3>
                    <p className="text-xs text-[#7A5C5C]">
                      {brandNameReadable(sellBrand)} •{' '}
                      <strong className="font-mono text-[#8C4A55]">{parsedSellWeight}g</strong>
                    </p>
                  </div>
                </div>

                <div className="py-5 space-y-3 text-sm border-b border-[#E3C1B7]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#6E5050]">Harga Buyback / Gram</span>
                    {sellCalc.ratePerGram !== null ? (
                      <span className="font-mono font-bold tabular-nums">
                        {formatIDR(sellCalc.ratePerGram)}
                      </span>
                    ) : (
                      <span className="font-editorial text-base font-bold text-[#8C4A55]">
                        Tanya WA
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#6E5050]">Berat Total</span>
                    <span className="font-mono font-bold tabular-nums">
                      {parsedSellWeight} gram
                    </span>
                  </div>
                  {sellCalc.grossValue !== null && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#6E5050]">Nilai Kotor Buyback</span>
                      <span className="font-mono tabular-nums">
                        {formatIDR(sellCalc.grossValue)}
                      </span>
                    </div>
                  )}
                  {!hasReceipt && sellCalc.noReceiptDeduction !== null && (
                    <div className="flex items-center justify-between gap-2 text-[#8C4A55]">
                      <span>Penyesuaian Tanpa Surat (~4%)</span>
                      <span className="font-mono tabular-nums">
                        −{formatIDR(sellCalc.noReceiptDeduction)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="py-5 space-y-2">
                  <div className="text-xs uppercase tracking-[0.14em] text-[#7A5C5C] font-bold">
                    {sellCalc.netReceive !== null
                      ? 'Estimasi Dana Cair yang Anda Terima'
                      : 'Cek Penawaran Buyback Hari Ini'}
                  </div>
                  {sellCalc.netReceive !== null ? (
                    <div className="font-mono text-3xl sm:text-4xl font-bold text-[#3D2C2C] tabular-nums">
                      {formatIDR(sellCalc.netReceive)}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-editorial text-3xl font-bold text-[#8C4A55]">
                        Tanya WA NJ
                      </div>
                      <p className="text-xs text-[#6E5050] leading-relaxed">
                        Harga buyback untuk {brandNameReadable(sellBrand)} / perhiasan mengikuti
                        rilis harian resmi toko &amp; surat asli. Kirim foto via WA untuk
                        penawaran instan!
                      </p>
                    </div>
                  )}
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C4A55] bg-[#FFF9F7] px-3 py-1 rounded-full border border-[#E8CEC7]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    Dana cair instan setelah verifikasi fisik
                  </div>
                </div>

                <a
                  href={sellWhatsAppHref()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full min-h-[48px] px-5 rounded-full btn-gold font-bold text-sm transition-all inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {sellCalc.netReceive !== null
                    ? 'Ajukan Jual Emas via WA NJ'
                    : 'Tanya Harga Buyback via WA NJ'}
                </a>

                <p className="mt-4 text-[11px] text-[#6E5050] leading-relaxed">
                  Kirim foto fisik emas &amp; surat resmi ke{' '}
                  <strong className="font-mono">+62 856-4121-3142</strong> untuk mendapatkan
                  penawaran buyback resmi hari ini.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
