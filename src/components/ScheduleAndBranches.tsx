import React, { useState } from 'react';
import {
  CalendarClock,
  MapPin,
  Radio,
  ArrowRight,
  Clock,
  Store,
  Navigation,
  Home,
  Handshake,
  Truck,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import {
  RUNNER_SCHEDULE,
  BOUTIQUE_LOCATIONS,
  BRAND_INFO,
  BrandType,
  getWhatsAppUrl,
} from '../data/goldData';

interface ScheduleAndBranchesProps {
  onSelectBrandCatalog: (brand: BrandType) => void;
  onOpenCustomRequest: () => void;
}

export const ScheduleAndBranches: React.FC<ScheduleAndBranchesProps> = ({
  onSelectBrandCatalog,
  onOpenCustomRequest,
}) => {
  const [branchFilter, setBranchFilter] = useState<'ALL' | BrandType>('ALL');

  const filteredBranches = BOUTIQUE_LOCATIONS.filter(
    (b) => branchFilter === 'ALL' || b.brand === branchFilter
  );

  return (
    <section
      id="jadwal"
      className="py-16 sm:py-20 lg:py-24 bg-[#F9EDEA] border-b border-[#E8CEC7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* ============================================================ */}
        {/* PART 1: LOKASI & PENGAMBILAN (COD, AMBIL DI RUMAH, EKSPEDISI)*/}
        {/* ============================================================ */}
        <div id="lokasi" className="scroll-mt-28 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
                Lokasi Resmi &amp; Pilihan Pengambilan
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3D2C2C] mt-2 leading-[1.12]">
                Bisa COD,{' '}
                <span className="italic text-gold-foil">
                  Ambil di Rumah &amp; Ekspedisi Aman
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#7A5C5C] mt-3 leading-relaxed">
                Transaksi terasa lebih tenang karena alamat kami jelas, terverifikasi di Google
                Maps, dan melayani 3 pilihan pengambilan sesuai kenyamanan Anda.
              </p>
            </div>
            <a
              href={BRAND_INFO.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 min-h-[46px] rounded-full btn-gold text-xs sm:text-sm font-bold self-start lg:self-auto"
            >
              <Navigation className="w-4 h-4" />
              Lihat di Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 3 Pilihan Pengambilan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Handshake,
                badge: 'Tanpa Ongkir • Rp 0',
                title: '1. COD (Bayar di Tempat)',
                desc: 'Ketemuan langsung, cek fisik emas & nota resmi, lalu bayar di tempat. Wajib konfirmasi jadwal & lokasi terlebih dahulu via WA NJ.',
                ctaText: 'Atur Jadwal COD via WA',
                waMsg:
                  'Halo NJ, saya ingin konfirmasi jadwal & lokasi untuk transaksi COD emas.',
              },
              {
                icon: Home,
                badge: 'Tanpa Ongkir • Rp 0',
                title: '2. Ambil di Rumah (Mbak Jannah)',
                desc: 'Pembeli datang langsung ke alamat terverifikasi di Mororejo RT16 RW 07 Sambiduwur, Kec. Tanon, Kabupaten Sragen. Konfirmasi jam kedatangan dulu via WA NJ.',
                ctaText: 'Konfirmasi Ambil di Rumah',
                waMsg:
                  'Halo NJ, saya ingin konfirmasi jadwal untuk ambil emas langsung di rumah Mbak Jannah (Sragen).',
              },
              {
                icon: Truck,
                badge: 'Asuransi Penuh 100%',
                title: '3. Kirim via Ekspedisi Berasuransi',
                desc: 'Untuk pelanggan luar kota/luar pulau, dikirim dengan JNE Gold / Paxel Insured + packing kayu & deklarasi nilai 100% sesuai nota.',
                ctaText: 'Tanya Ongkir & Asuransi',
                waMsg:
                  'Halo NJ, saya ingin tanya estimasi pengiriman emas berasuransi ke kota saya.',
              },
            ].map((opt) => (
              <div
                key={opt.title}
                className="rounded-3xl bg-[#FFF9F7] border border-[#E8CEC7] p-6 shadow-[0_12px_30px_rgba(183,110,121,0.09)] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl bg-[#F9EDEA] border border-[#D4AF37]/45 flex items-center justify-center">
                      <opt.icon className="w-5 h-5 text-[#B76E79]" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#F9EDEA] border border-[#E5C4BB] text-[11px] font-bold text-[#8C4A55]">
                      {opt.badge}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#3D2C2C]">
                    {opt.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#7A5C5C] leading-relaxed">
                    {opt.desc}
                  </p>
                </div>

                <a
                  href={getWhatsAppUrl(opt.waMsg)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full min-h-[44px] px-4 rounded-full border border-[#B76E79] bg-[#FFF9F7] text-[#8C4A55] text-xs font-bold hover:bg-[#F9EDEA] transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {opt.ctaText}
                </a>
              </div>
            ))}
          </div>

          {/* Verified Google Maps Card + Responsive Embed */}
          <div className="rounded-3xl bg-[#FFF9F7] border border-[#E5C4BB] shadow-[0_16px_42px_rgba(183,110,121,0.12)] overflow-hidden grid lg:grid-cols-12">
            {/* Address Details */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-gradient-to-b from-[#FFF9F7] to-[#FAF0EC]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9EDEA] border border-[#D4AF37]/50 text-[11px] font-bold text-[#8C4A55]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                  Titik Lokasi Terverifikasi Google Maps
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#B76E79]">
                    Pin Google Maps
                  </div>
                  <h3 className="font-editorial text-3xl font-bold text-[#3D2C2C] mt-0.5">
                    {BRAND_INFO.locationPinName}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9F7] border border-[#EBD2CA] space-y-2">
                  <div className="flex items-start gap-2.5 text-sm text-[#3D2C2C]">
                    <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-1" />
                    <p className="font-medium leading-relaxed break-words">
                      {BRAND_INFO.locationAddress}
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#7A5C5C] pl-6">
                    Koordinat: {BRAND_INFO.locationLat}, {BRAND_INFO.locationLng}
                  </div>
                </div>

                <div className="text-xs text-[#6E5050] bg-[#F3DAD3]/55 border border-[#E5C4BB] rounded-2xl p-3.5 leading-relaxed">
                  <strong>Catatan Penting:</strong> Mohon konfirmasi jadwal terlebih dahulu
                  melalui WhatsApp resmi NJ (<strong>{BRAND_INFO.whatsappDisplay}</strong>)
                  sebelum COD atau datang mengambil pesanan di rumah agar pesanan &amp; surat
                  resmi sudah siap saat Anda tiba.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={BRAND_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-h-[46px] px-4 rounded-full btn-gold text-xs font-bold inline-flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-4 h-4" />
                  Buka Maps
                </a>
                <a
                  href={getWhatsAppUrl(
                    'Halo Mbak Jannah (NJ), saya ingin konfirmasi jadwal COD / ambil pesanan di rumah (Mororejo RT16 RW 07 Sambiduwur, Kec. Tanon, Sragen).'
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-h-[46px] px-4 rounded-full bg-[#B76E79] text-[#FFF9F7] text-xs font-bold hover:brightness-105 transition-all inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  Konfirmasi WA NJ
                </a>
              </div>
            </div>

            {/* Responsive Google Maps Embed */}
            <div className="lg:col-span-7 min-h-[280px] sm:min-h-[360px] w-full bg-[#F3DAD3] relative">
              <iframe
                title="Peta Lokasi Pengambilan NJ — Mbak Jannah, Mororejo RT16 RW 07 Sambiduwur, Sragen"
                src={BRAND_INFO.googleMapsEmbedUrl}
                className="w-full h-full min-h-[280px] sm:min-h-[360px] border-0 block"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PART 2: JADWAL BELANJA GERAI & LIVE SHOPPING MINGGUAN        */}
        {/* ============================================================ */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
                Jadwal Runner &amp; Live Shopping
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#3D2C2C] mt-1.5">
                Jadwal Belanja Mingguan{' '}
                <span className="italic text-gold-foil">3 Brand Utama</span>
              </h3>
              <p className="text-sm text-[#7A5C5C] mt-2 leading-relaxed">
                Kuota per batch dibatasi agar setiap pesanan dilayani ramah, teliti, dan tepat
                waktu.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFF9F7] border border-[#E5C4BB] text-xs font-bold text-[#8C4A55] self-start lg:self-auto">
              <Radio className="w-4 h-4 text-[#C9A227] animate-pulse" />
              <span>Cut-Off Batch Pagi: Pukul 08:30 WIB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RUNNER_SCHEDULE.map((slot) => {
              const filledPct = Math.round(
                ((slot.slotsTotal - slot.slotsLeft) / slot.slotsTotal) * 100
              );
              return (
                <div
                  key={slot.day}
                  className="bg-[#FFF9F7] rounded-3xl border border-[#E8CEC7] p-5 sm:p-6 flex flex-col justify-between hover:border-[#C9A227] transition-all shadow-[0_8px_24px_rgba(183,110,121,0.08)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-editorial text-2xl font-bold text-[#3D2C2C]">
                        {slot.day}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F9EDEA] text-[#8C4A55] border border-[#E5C4BB]">
                        {slot.type} • {slot.brandLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#9C7418] font-mono font-semibold mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.time}</span>
                    </div>

                    <h4 className="font-sans text-sm font-bold text-[#3D2C2C] leading-snug">
                      {slot.activity}
                    </h4>
                    <p className="text-xs text-[#7A5C5C] mt-1.5 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B76E79] shrink-0 mt-0.5" />
                      <span>{slot.branch}</span>
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#F2E1DC] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#7A5C5C]">Kuota Batch Tersisa</span>
                      <span className="font-mono font-bold text-[#3D2C2C]">
                        {slot.slotsLeft} / {slot.slotsTotal} Slot
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F3DAD3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#B76E79] to-[#D4AF37]"
                        style={{ width: `${filledPct}%` }}
                      />
                    </div>
                    <button
                      onClick={() =>
                        slot.type === 'Live Shopping'
                          ? onOpenCustomRequest()
                          : onSelectBrandCatalog(slot.brand)
                      }
                      className="w-full mt-1 min-h-[44px] rounded-full bg-[#F9EDEA] border border-[#E5C4BB] text-xs font-bold text-[#3D2C2C] hover:bg-[#B76E79] hover:text-[#FFF9F7] hover:border-[#B76E79] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                      Booking Slot {slot.day}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* PART 3: JARINGAN GERAI SUMBER PEMBELIAN RESMI WILAYAH SOLO   */}
        {/* ============================================================ */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
                Jaringan Sumber Resmi • Wilayah Solo
              </span>
              <h3 className="font-editorial text-2xl sm:text-4xl font-bold text-[#3D2C2C] mt-1">
                Gerai Pembelian Langsung NJ{' '}
                <span className="italic text-gold-foil">(Area Solo)</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#7A5C5C] mt-1.5">
                Seluruh pembelanjaan jastip NJ dilakukan langsung di gerai resmi wilayah Solo
                (Surakarta &amp; Solo Raya) lengkap dengan nota asli toko.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'ALL', label: 'Semua' },
                  { id: 'SEMAR_NUSANTARA', label: 'Semar Nusantara' },
                  { id: 'SEMAR_JAWA', label: 'Semar Jawa' },
                  { id: 'ISMOYO', label: 'Ismoyo' },
                  { id: 'ANTAM', label: 'ANTAM' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBranchFilter(tab.id)}
                  className={`px-3.5 min-h-[40px] rounded-full text-xs font-bold transition-all cursor-pointer ${
                    branchFilter === tab.id
                      ? 'btn-gold'
                      : 'bg-[#FFF9F7] text-[#6E5050] border border-[#E5C4BB] hover:border-[#B76E79]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="bg-[#FFF9F7] rounded-2xl border border-[#E8CEC7] p-5 flex flex-col justify-between space-y-3 hover:border-[#C9A227] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F9EDEA] text-[#8C4A55] border border-[#E8CEC7]">
                      {branch.city}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#9C7418]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                      {branch.status}
                    </span>
                  </div>

                  <h4 className="font-sans text-sm font-bold text-[#3D2C2C] flex items-start gap-1.5">
                    <Store className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                    <span>{branch.branchName}</span>
                  </h4>
                  <p className="text-xs text-[#7A5C5C] mt-1.5 leading-relaxed">
                    {branch.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F3E2DD] text-[11px] font-mono text-[#8C4A55] font-medium">
                  {branch.runnerSchedule}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
