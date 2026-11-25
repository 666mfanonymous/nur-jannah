import React from 'react';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { BRAND_INFO, getWhatsAppUrl } from '../data/goldData';
import { CrownNJLogo } from './NavbarAndTicker';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-blush-silk text-[#3D2C2C] border-t border-[#E3BFB5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#E3C1B7]">
          {/* Brand Manifesto Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F7] border border-[#D4AF37]/60 flex items-center justify-center shadow-sm shrink-0">
                <CrownNJLogo size="sm" />
              </div>
              <div>
                <div className="font-editorial text-2xl font-bold tracking-[0.04em] text-[#3D2C2C]">
                  NJ <span className="text-gold-foil">GOLD JASTIP</span>
                </div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C4A55]">
                  {BRAND_INFO.footerTagline}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6E5050] leading-relaxed max-w-md">
              Melayani <strong>Jastip Jual &amp; Beli Emas</strong> terpercaya untuk 3 brand
              utama: <strong>Semar Nusantara</strong>, <strong>Semar Jawa</strong>, dan{' '}
              <strong>Ismoyo (J5)</strong>, serta opsi tambahan <strong>ANTAM Logam Mulia</strong>.{' '}
              <em>{BRAND_INFO.tagline}.</em>
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFF9F7]/90 border border-[#E6C7C0] text-xs text-[#7A444E] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span>0% Markup Harga Emas • Nota Asli Resmi • Bisa COD &amp; Ambil di Rumah</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C4A55]">
              Navigasi Layanan
            </h4>
            <ul className="space-y-2.5 text-sm text-[#5E4545] font-medium">
              <li>
                <a href="#harga" className="hover:text-[#B76E79] transition-colors">
                  Papan Harga &amp; Grafik Harian
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#B76E79] transition-colors">
                  Katalog 3 Brand Utama &amp; ANTAM
                </a>
              </li>
              <li>
                <a href="#kalkulator" className="hover:text-[#B76E79] transition-colors">
                  Kalkulator Beli &amp; Jual (Buyback)
                </a>
              </li>
              <li>
                <a href="#cara-jual" className="hover:text-[#B76E79] transition-colors">
                  Cara Jual Emas (3 Langkah)
                </a>
              </li>
              <li>
                <a href="#member" className="hover:text-[#B76E79] transition-colors">
                  Member NJ &amp; Kartu Digital
                </a>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-[#B76E79] transition-colors">
                  Lokasi COD &amp; Ambil di Rumah
                </a>
              </li>
              <li>
                <a href="#lacak" className="hover:text-[#B76E79] transition-colors">
                  Lacak Status Titipan
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#B76E79] transition-colors">
                  FAQ &amp; Ketentuan Asuransi
                </a>
              </li>
            </ul>
          </div>

          {/* Official Location & WhatsApp Contact */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C4A55]">
              Lokasi Pengambilan &amp; Kontak WA NJ
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-[#5E4545]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#3D2C2C]">
                    Pin Google Maps: {BRAND_INFO.locationPinName}
                  </div>
                  <p className="text-xs text-[#6E5050] leading-relaxed mt-0.5 break-words">
                    {BRAND_INFO.locationAddress}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm">
                  Fast Response WA: Senin – Minggu, 08:00 – 21:00 WIB
                  <br />
                  <span className="text-[#7A5C5C] text-xs">
                    COD &amp; Ambil di Rumah: Konfirmasi jadwal via WA terlebih dahulu
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B76E79] shrink-0" />
                <a
                  href={getWhatsAppUrl('Halo NJ, saya ingin tanya layanan jastip jual & beli emas.')}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#B76E79] font-mono font-bold text-[#3D2C2C]"
                >
                  {BRAND_INFO.whatsappDisplay}
                </a>
              </li>
            </ul>

            <a
              href={BRAND_INFO.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 min-h-[42px] rounded-full bg-[#FFF9F7] border border-[#B76E79] text-[#8C4A55] text-xs font-bold hover:bg-[#F9EDEA] transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              Buka Google Maps ({BRAND_INFO.locationPinName})
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Tagline & Legal Transparency */}
        <div className="pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#7A5C5C]">
          <p className="max-w-3xl leading-relaxed">
            <strong className="text-[#5B4141]">Catatan Transparansi:</strong> NJ adalah layanan
            jasa titip jual &amp; beli emas independen yang berbelanja langsung di gerai resmi
            wilayah Solo: Semar Nusantara, Semar Jawa (Toko Mas Jawa), Toko Mas J5 Ismoyo, serta
            pengadaan resmi ANTAM LM. Seluruh merek dagang merupakan hak milik pemegang merek
            masing-masing.
          </p>
          <div className="shrink-0 inline-flex items-center gap-1.5 font-bold text-[#8C4A55] tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>{BRAND_INFO.footerTagline} • © 2026 NJ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
