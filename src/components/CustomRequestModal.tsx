import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { GoldProduct, BrandType, getWhatsAppUrl, formatIDR } from '../data/goldData';

interface CustomRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomToCart: (product: GoldProduct, customNote: string) => void;
}

export const CustomRequestModal: React.FC<CustomRequestModalProps> = ({
  isOpen,
  onClose,
  onAddCustomToCart,
}) => {
  const [brandChoice, setBrandChoice] = useState<'SEMAR_NUSANTARA' | 'SEMAR_JAWA' | 'ISMOYO'>(
    'SEMAR_NUSANTARA'
  );
  const [jewelryType, setJewelryType] = useState('Cincin');
  const [collection, setCollection] = useState('Nikita Willy Gold (NWG)');
  const [karat, setKarat] = useState<'17K' | '10K'>('17K');
  const [colorTone, setColorTone] = useState('Yellow Gold');
  const [weightInput, setWeightInput] = useState('2.0');
  const [sizeSpec, setSizeSpec] = useState('Size 12');
  const [refLink, setRefLink] = useState('');

  if (!isOpen) return null;

  const weight = (() => {
    const parsed = parseFloat(weightInput.replace(',', '.'));
    return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 50) : 1;
  })();

  const fee = weight <= 2 ? 20000 : weight <= 5 ? 35000 : 45000;

  const brandNames: Record<'SEMAR_NUSANTARA' | 'SEMAR_JAWA' | 'ISMOYO', string> = {
    SEMAR_NUSANTARA: 'Semar Nusantara',
    SEMAR_JAWA: 'Semar Jawa',
    ISMOYO: 'Ismoyo (J5)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const label = brandNames[brandChoice];
    const customProduct: GoldProduct = {
      id: `custom-${brandChoice}-${Date.now()}`,
      sku: `CUS-${karat}`,
      name: `Custom ${label}: ${jewelryType} ${collection} ${karat}`,
      brand: brandChoice as BrandType,
      brandLabel: label,
      category: 'Perhiasan 17K & 10K',
      purity: karat === '17K' ? '17K • Kadar Emas Tua' : '10K • SQ5 Daily',
      weightGrams: weight,
      basePrice: null, // Harga perhiasan mengikuti nota resmi toko hari transaksi
      buybackEstimate: null,
      jastipFee: fee,
      taxApplicable: false,
      stock: 1,
      stockStatus: 'Pre-order',
      image: './images/official/sn-cincin-velora-aeratec-17k.jpg',
      originStore: `Gerai Resmi ${label}`,
      packaging: `Box Perhiasan Resmi ${label}`,
      certificate: `Surat Resmi (Nota Asli) ${label}`,
      description: 'Permintaan personal shopper khusus sesuai model pilihan Anda.',
      specs: ['Foto timbangan digital real-time', 'Refund 100% jika berat riil lebih ringan'],
    };

    const note = `Gerai: ${label} | Warna: ${colorTone} | Ukuran: ${sizeSpec}${
      refLink.trim() ? ` | Ref: ${refLink.trim()}` : ''
    }`;
    onAddCustomToCart(customProduct, note);
    onClose();
  };

  const directWaHref = getWhatsAppUrl(
    `Halo NJ, saya ingin Titip Custom Perhiasan:\n• Brand: ${brandNames[brandChoice]}\n• Jenis: ${jewelryType} (${collection})\n• Kadar: ${karat} | Warna: ${colorTone}\n• Target Berat: ${weight}g | Ukuran: ${sizeSpec}${
      refLink.trim() ? `\n• Referensi: ${refLink.trim()}` : ''
    }\nMohon info stok & harga resmi toko hari ini.`
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-[#3D2C2C]/55 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FFF9F7] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-[#E5C4BB] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 bg-blush-silk text-[#3D2C2C] flex items-center justify-between border-b border-[#E5C4BB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF9F7] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#B76E79]" />
            </div>
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold">
                Titip Custom Perhiasan NJ
              </h3>
              <p className="text-xs text-[#7A5C5C]">
                Request model dari Semar Nusantara, Semar Jawa &amp; Ismoyo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal custom"
            className="w-10 h-10 rounded-full bg-[#FFF9F7]/85 text-[#3D2C2C] flex items-center justify-center hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#3D2C2C] block mb-1.5">
              Pilih Toko / Brand Utama
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'SEMAR_NUSANTARA', label: 'Semar Nusantara' },
                  { id: 'SEMAR_JAWA', label: 'Semar Jawa' },
                  { id: 'ISMOYO', label: 'Ismoyo (J5)' },
                ] as const
              ).map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBrandChoice(b.id)}
                  className={`min-h-[44px] px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    brandChoice === b.id
                      ? 'btn-gold border-[#C9A227]'
                      : 'bg-[#FFF9F7] border-[#E5C4BB] text-[#6E5050]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                Jenis Perhiasan
              </label>
              <select
                value={jewelryType}
                onChange={(e) => setJewelryType(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
              >
                <option>Cincin</option>
                <option>Gelang Rantai / Serut</option>
                <option>Gelang Bangle Kaku</option>
                <option>Kalung + Liontin</option>
                <option>Anting / Giwang</option>
                <option>Set Seserahan Lengkap</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                Lini Koleksi / Gaya
              </label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
              >
                <option>Nikita Willy Gold (NWG)</option>
                <option>In Your Seoul</option>
                <option>Petite Gold</option>
                <option>Klasik Elegan / Seserahan</option>
                <option>Model Bebas (Sesuai Foto WA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['17K', '10K'] as const).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setKarat(k)}
                className={`p-3 min-h-[54px] rounded-xl border text-left transition-all cursor-pointer ${
                  karat === k
                    ? 'bg-[#B76E79] text-[#FFF9F7] border-[#B76E79]'
                    : 'bg-[#FFF9F7] text-[#3D2C2C] border-[#DFC0B6]'
                }`}
              >
                <div className="text-sm font-bold">
                  Kadar {k} {k === '17K' ? '(Emas Tua)' : '(SQ5)'}
                </div>
                <div
                  className={`text-[11px] ${
                    karat === k ? 'text-[#FCE9E3]' : 'text-[#7A5C5C]'
                  }`}
                >
                  Harga sesuai nota toko (Tanya WA)
                </div>
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                Warna Emas
              </label>
              <select
                value={colorTone}
                onChange={(e) => setColorTone(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
              >
                <option>Yellow Gold</option>
                <option>Rose Gold</option>
                <option>White Gold</option>
                <option>Two-Tone</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                Target Berat (g)
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={0.5}
                max={50}
                step={0.1}
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#F9EDEA]/60 border border-[#DFC0B6] font-mono text-sm font-bold focus:outline-none focus:border-[#C9A227]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                Ukuran
              </label>
              <input
                required
                type="text"
                value={sizeSpec}
                onChange={(e) => setSizeSpec(e.target.value)}
                placeholder="Size 12 / 16cm"
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
              Nama Model / Link Postingan IG / Deskripsi Tambahan
            </label>
            <textarea
              rows={2}
              value={refLink}
              onChange={(e) => setRefLink(e.target.value)}
              placeholder="Tempel link IG atau deskripsikan model yang diinginkan..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="p-4 rounded-2xl bg-blush-silk border border-[#E5C4BB] space-y-3">
            <div>
              <div className="text-[11px] text-[#7A5C5C]">
                Harga Emas: <strong className="text-[#8C4A55]">Tanya WA (Sesuai Nota Kasir)</strong>
              </div>
              <div className="font-mono text-base font-bold text-[#3D2C2C] mt-0.5">
                Fee Jastip Flat: {formatIDR(fee)}
              </div>
              <div className="text-[11px] text-[#8C4A55] inline-flex items-center gap-1 mt-0.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                0% markup • Refund 100% jika berat riil lebih ringan
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <button
                type="submit"
                className="min-h-[46px] px-4 rounded-full bg-[#FFF9F7] border border-[#B76E79] text-[#8C4A55] text-xs font-bold hover:bg-[#F9EDEA] cursor-pointer"
              >
                + Masukkan Keranjang
              </button>
              <a
                href={directWaHref}
                target="_blank"
                rel="noreferrer"
                className="min-h-[46px] px-4 rounded-full btn-gold text-xs font-bold inline-flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                Kirim Request via WA
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
