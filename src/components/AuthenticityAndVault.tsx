import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  FileCheck2,
  PackageCheck,
  Video,
  Lock,
  CheckCircle2,
  ScanLine,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const AuthenticityAndVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'UTAMA' | 'ANTAM'>('UTAMA');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'verified'>('idle');

  const triggerScanDemo = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('verified');
    }, 1050);
  };

  return (
    <section
      id="keaslian"
      className="py-16 sm:py-20 lg:py-24 bg-blush-silk text-[#3D2C2C] relative overflow-hidden border-b border-[#E5C4BB]"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
              Jaminan Keaslian &amp; Keamanan NJ
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3D2C2C] mt-2 leading-[1.12]">
              100% Produk Asli,{' '}
              <span className="italic text-gold-foil">Surat Resmi &amp; Asuransi Penuh</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6E5050] mt-3 leading-relaxed">
              Setiap transaksi jual maupun beli di NJ melewati pemeriksaan keaslian menyeluruh,
              dokumentasi video HD sebelum pengemasan, hingga pengiriman kayu berasuransi 100%.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex p-1.5 rounded-full bg-[#FFF9F7] border border-[#E5C4BB] self-start shadow-sm">
            <button
              onClick={() => setActiveTab('UTAMA')}
              className={`px-4 sm:px-5 min-h-[44px] rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'UTAMA'
                  ? 'btn-gold'
                  : 'text-[#7A5C5C] hover:text-[#3D2C2C]'
              }`}
            >
              Surat 3 Brand Utama
            </button>
            <button
              onClick={() => setActiveTab('ANTAM')}
              className={`px-4 sm:px-5 min-h-[44px] rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ANTAM'
                  ? 'bg-[#B76E79] text-[#FFF9F7]'
                  : 'text-[#7A5C5C] hover:text-[#3D2C2C]'
              }`}
            >
              CertiEye ANTAM
            </button>
          </div>
        </div>

        {/* Interactive Verification Grid */}
        <div className="grid lg:grid-cols-12 gap-7 items-stretch">
          {/* Left Panel */}
          <div className="lg:col-span-7 rounded-3xl bg-[#FFF9F7] border border-[#E6C7C0] p-5 sm:p-8 shadow-[0_14px_38px_rgba(183,110,121,0.1)] flex flex-col justify-between">
            {activeTab === 'UTAMA' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#F1DFDA] pb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#F9EDEA] border border-[#D4AF37]/45 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5 text-[#B76E79]" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#3D2C2C]">
                      Standar Surat Resmi Semar Nusantara, Semar Jawa &amp; Ismoyo
                    </h3>
                    <p className="text-xs text-[#7A5C5C]">
                      Berlaku untuk Logam Mulia 24K (999.9) serta Perhiasan Kadar 17K &amp; 10K
                    </p>
                  </div>
                </div>

                {/* Karat Comparison Grid */}
                <div className="grid sm:grid-cols-3 gap-3.5">
                  {[
                    {
                      badge: '24K • 999.9 Fine Gold',
                      title: 'Logam Mulia Press',
                      points: [
                        'Semar Nusantara, Semar Jawa (Joglo) & Ismoyo (J5)',
                        'Nilai stabil untuk investasi jangka panjang',
                        'Buyback tinggi & cepat cair di NJ',
                      ],
                    },
                    {
                      badge: '17K • ±70.8% Emas Tua',
                      title: 'Perhiasan Eksklusif 17K',
                      points: [
                        'Kandungan emas murni tinggi & berkilau mewah',
                        'Nikita Willy Gold, In Your Seoul, dll.',
                        'Sangat cocok untuk seserahan & koleksi',
                      ],
                    },
                    {
                      badge: '10K • ±41.7% (SQ5)',
                      title: 'Daily Luxury 10K',
                      points: [
                        'Kuat, tahan gores untuk pemakaian harian',
                        'Harga ramah & model trendi feminin',
                        'Tetap disertai surat resmi untuk buyback',
                      ],
                    },
                  ].map((k) => (
                    <div
                      key={k.title}
                      className="p-4 rounded-2xl bg-[#F9EDEA]/75 border border-[#ECD5CE] space-y-2"
                    >
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF9F7] border border-[#D4AF37]/50 text-[#8C6414] font-mono text-[10px] font-bold">
                        {k.badge}
                      </span>
                      <h4 className="font-sans text-sm font-bold text-[#3D2C2C]">{k.title}</h4>
                      <ul className="space-y-1.5 text-xs text-[#6E5050]">
                        {k.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-1.5">
                            <span className="text-[#C9A227] font-bold">✦</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#F9EDEA] to-[#F3DAD3] border border-[#E5C4BB] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C4A55]">
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    Komitmen Nota Asli &amp; Kemudahan Buyback
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#5B4141] leading-relaxed">
                    Setiap pembelian melalui NJ <strong>wajib</strong> disertai{' '}
                    <strong>Surat Resmi (Nota Toko Asli)</strong> dari Semar Nusantara, Semar
                    Jawa, maupun Toko Emas Ismoyo yang mencantumkan detail kadar, berat riil
                    timbangan digital, dan tanggal transaksi. Surat asli memudahkan Anda saat
                    ingin menjual kembali (<em>buyback</em>) atau tukar tambah kapan saja!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#F1DFDA] pb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#F9EDEA] border border-[#D4AF37]/45 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5 text-[#9C7418]" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#3D2C2C]">
                      Panduan Cek Keaslian CertiEye ANTAM
                    </h3>
                    <p className="text-xs text-[#7A5C5C]">
                      Untuk opsi tambahan kemasan CertiCard press &amp; Gift/Batik Series ANTAM
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      step: '01',
                      title: 'Unduh Aplikasi Resmi CertiEye',
                      desc: 'Tersedia gratis di Google Play Store & App Store. Tim NJ melakukan scan perdana di depan kamera HD sebelum pengiriman.',
                    },
                    {
                      step: '02',
                      title: 'Pindai CertiCode di Belakang Kartu',
                      desc: 'Sejajarkan 4 sudut kamera ponsel tepat pada QR khusus di bagian belakang kemasan CertiCard.',
                    },
                    {
                      step: '03',
                      title: 'Pastikan Status AUTHENTICATED',
                      desc: 'Muncul logo resmi ANTAM LM, status hijau AUTHENTICATED, nomor referensi, nomor seri, dan berat gramasi.',
                    },
                    {
                      step: '04',
                      title: 'Cocokkan Faktur Asli BELM',
                      desc: 'Faktur pembelian asli BELM dan rincian PPh 22 disertakan lengkap bersama emas Anda.',
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="p-4 rounded-2xl bg-[#F9EDEA]/75 border border-[#ECD5CE] space-y-1.5"
                    >
                      <span className="font-mono text-xs font-bold text-[#B76E79]">
                        LANGKAH {item.step}
                      </span>
                      <h4 className="font-sans text-sm font-bold text-[#3D2C2C]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#6E5050] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Interactive CertiEye Simulator */}
                <div className="rounded-2xl bg-[#F9EDEA] border border-[#D4AF37]/50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C4A55]">
                      <ScanLine className="w-4 h-4 text-[#C9A227]" />
                      Simulasi Hasil Scan CertiEye
                    </div>
                    {scanState === 'idle' && (
                      <p className="text-xs text-[#6E5050]">
                        Klik tombol untuk melihat contoh verifikasi keaslian yang dikirim via
                        video HD sebelum paket disegel.
                      </p>
                    )}
                    {scanState === 'scanning' && (
                      <p className="text-xs text-[#9C7418] font-mono font-bold animate-pulse">
                        Memindai CertiCode... Mencocokkan database LBMA ANTAM...
                      </p>
                    )}
                    {scanState === 'verified' && (
                      <div className="mt-2 space-y-1.5 text-xs">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9F7] border border-[#C9A227] text-[#2D6A4F] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          AUTHENTICATED — FINE GOLD 999.9
                        </div>
                        <div className="font-mono text-[11px] text-[#5B4141] grid sm:grid-cols-2 gap-x-5 gap-y-0.5 pt-1">
                          <span>Ref No: LM-2026-884109</span>
                          <span>Serial: NJ26-994201</span>
                          <span>Weight: 10.00 Gram</span>
                          <span>Origin: BELM Resmi</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={triggerScanDemo}
                    disabled={scanState === 'scanning'}
                    className="shrink-0 px-4 min-h-[44px] rounded-full btn-gold text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {scanState === 'verified' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" /> Scan Ulang
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-3.5 h-3.5" /> Jalankan Simulasi
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Insured Packaging Showcase */}
          <div className="lg:col-span-5 rounded-3xl bg-[#FFF9F7] border border-[#E6C7C0] overflow-hidden flex flex-col shadow-[0_14px_38px_rgba(183,110,121,0.1)]">
            <div className="relative h-56 sm:h-60 bg-[#F3DAD3]">
              <img
                src="/images/vault-packaging.jpg"
                alt="Standar Pengemasan Aman dan Berasuransi NJ"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D2C2C]/60 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#FFF9F7]/95 border border-[#D4AF37]/50 text-[#3D2C2C] text-[11px] font-bold shadow-sm">
                Standar Pengiriman Aman NJ
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#3D2C2C]">
                  4 Lapis Proteksi Pengiriman Emas
                </h3>
                <p className="text-xs text-[#7A5C5C] mt-1">
                  Untuk pelanggan luar kota yang memilih pengiriman ekspedisi berasuransi.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Video,
                    title: 'Video Dokumentasi Pra-Segel',
                    desc: 'Bukti nota asli, foto timbang digital / scan CertiEye, hingga penyegelan dikirim ke WA Anda.',
                  },
                  {
                    icon: Lock,
                    title: 'Kemasan Discreet & Privasi Terjaga',
                    desc: 'Label luar paket tidak mencantumkan kata "Emas" demi keamanan dan privasi selama perjalanan.',
                  },
                  {
                    icon: PackageCheck,
                    title: 'Packing Kayu & Asuransi 100% Nilai',
                    desc: 'Wajib JNE Gold Shipment / Paxel Insured dengan deklarasi nilai penuh sesuai nota resmi.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Pendampingan Penuh Klaim Unboxing',
                    desc: 'Rekam video unboxing tanpa jeda saat paket tiba untuk perlindungan garansi asuransi penuh.',
                  },
                ].map((layer) => (
                  <div key={layer.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F9EDEA] border border-[#E5C4BB] flex items-center justify-center shrink-0 mt-0.5">
                      <layer.icon className="w-4 h-4 text-[#B76E79]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-[#3D2C2C]">
                        {layer.title}
                      </h4>
                      <p className="text-[11px] text-[#7A5C5C] leading-relaxed mt-0.5">
                        {layer.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
