import React, { useState } from 'react';
import {
  Star,
  BadgeCheck,
  ChevronDown,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  TESTIMONIALS,
  FAQ_ITEMS,
  FaqItem,
  BRAND_INFO,
  getWhatsAppUrl,
} from '../data/goldData';

export const TestimonialsAndFaq: React.FC = () => {
  const [faqCategory, setFaqCategory] = useState<'ALL' | FaqItem['category']>('ALL');
  const [openFaqIdx, setOpenFaqIdx] = useState<number>(0);

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) => faqCategory === 'ALL' || item.category === faqCategory
  );

  return (
    <>
      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-marble-luxury border-b border-[#EAD3CC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
                Testimoni Klien Terpercaya
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3D2C2C] mt-2 leading-[1.12]">
                Dipercaya Pelanggan{' '}
                <span className="italic text-gold-foil">Sragen, Solo hingga Luar Pulau</span>
              </h2>
            </div>

            <div className="flex items-center gap-4 sm:gap-5 bg-[#FFF9F7] px-5 py-3.5 rounded-3xl border border-[#E8CEC7] shadow-sm self-start lg:self-auto">
              <div>
                <div className="flex items-center gap-0.5 text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                  ))}
                </div>
                <div className="text-xs text-[#7A5C5C] mt-0.5">
                  <strong className="text-[#3D2C2C]">4.98 / 5.0</strong> dari 1.240+ transaksi
                </div>
              </div>
              <div className="h-9 w-[1px] bg-[#EAD3CC]" />
              <div>
                <div className="font-mono text-base font-bold text-[#B76E79]">100%</div>
                <div className="text-[11px] text-[#7A5C5C]">Amanah &amp; Asli</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <article
                key={t.id}
                className="bg-[#FFF9F7] rounded-3xl border border-[#E8CEC7] p-6 sm:p-7 flex flex-col justify-between hover:border-[#C9A227] transition-all shadow-[0_10px_28px_rgba(183,110,121,0.08)]"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-0.5 text-[#D4AF37]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9EDEA] text-[#8C4A55] border border-[#E8CEC7] text-[11px] font-bold">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                      {t.proofTag}
                    </span>
                  </div>

                  <p className="font-editorial text-lg sm:text-xl text-[#3D2C2C] leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F3E3DE] flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-[#3D2C2C]">{t.name}</div>
                    <div className="text-xs text-[#7A5C5C]">
                      {t.city} • {t.verifiedDate}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#F9EDEA] text-[#7A5020] border border-[#D4AF37]/40">
                    {t.itemPurchased}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-[#F9EDEA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
              Informasi &amp; Ketentuan Lengkap
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3D2C2C] mt-2">
              Pertanyaan yang Sering{' '}
              <span className="italic text-gold-foil">Ditanyakan (FAQ)</span>
            </h2>
            <p className="text-sm sm:text-base text-[#7A5C5C] mt-3">
              Panduan lengkap seputar jastip beli &amp; jual emas, COD &amp; ambil di rumah,
              surat resmi toko, hingga asuransi pengiriman luar kota.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {(
              ['ALL', 'Jual & Beli', 'COD & Pengiriman', 'Keaslian & Surat', 'Biaya & Pajak'] as const
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFaqCategory(cat);
                  setOpenFaqIdx(0);
                }}
                className={`px-4 min-h-[42px] rounded-full text-xs font-bold transition-all cursor-pointer ${
                  faqCategory === cat
                    ? 'btn-gold'
                    : 'bg-[#FFF9F7] text-[#6E5050] border border-[#E5C4BB] hover:border-[#B76E79]'
                }`}
              >
                {cat === 'ALL' ? 'Semua Topik' : cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={item.question}
                  className={`rounded-3xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#FFF9F7] border-[#C9A227] shadow-[0_10px_28px_rgba(183,110,121,0.1)]'
                      : 'bg-[#FFF9F7]/85 border-[#E8CEC7] hover:border-[#B76E79]'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 min-h-[56px] text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B76E79]">
                        {item.category}
                      </span>
                      <h3 className="font-sans text-sm sm:text-base font-bold text-[#3D2C2C] mt-0.5">
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#B76E79] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 text-sm text-[#6E5050] leading-relaxed border-t border-[#F3E3DE] pt-4">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct WA NJ CTA */}
          <div className="mt-10 rounded-3xl bg-blush-silk text-[#3D2C2C] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-[#DFB9AF] shadow-[0_14px_38px_rgba(183,110,121,0.14)]">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF9F7] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#B76E79]" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl font-bold">
                  Ingin Konsultasi Beli, Jual Emas, atau Jadwal COD?
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5050] mt-1">
                  Tim NJ siap membantu dengan ramah, cepat tanggap, dan privasi terjaga setiap
                  hari melalui WhatsApp resmi <strong>{BRAND_INFO.whatsappDisplay}</strong>.
                </p>
              </div>
            </div>
            <a
              href={getWhatsAppUrl(
                'Halo NJ, saya ingin konsultasi jastip jual/beli emas (Semar Nusantara / Semar Jawa / Ismoyo).'
              )}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-full btn-gold text-sm font-bold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WA NJ Sekarang
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
