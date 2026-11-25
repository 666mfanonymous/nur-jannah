import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  Crown,
  Sparkles,
  UserPlus,
  CreditCard,
  ShieldCheck,
  Gift,
  Award,
  X,
  CheckCircle2,
  MessageCircle,
  Download,
  Share2,
  Camera,
  Lock,
  Search,
  RefreshCw,
  ArrowRight,
  ReceiptText,
} from 'lucide-react';
import {
  Member,
  MemberTierConfig,
  MemberPointRules,
  MemberRegistration,
  MemberTierKey,
  Order,
  BRAND_INFO,
  getWhatsAppUrl,
  normalizeIndonesianWa,
  maskWaForCard,
  formatWaFullPrivate,
  formatJoinDateId,
  computeEffectiveTier,
  formatIDR,
} from '../data/goldData';
import {
  MEMBER_DAFTAR_STORAGE_KEY,
  MEMBERS_STORAGE_KEY,
  ORDERS_STORAGE_KEY,
  TITIP_JUAL_STORAGE_KEY,
} from '../config';
import { CrownNJLogo } from './NavbarAndTicker';

interface MemberSectionProps {
  tiers: MemberTierConfig[];
  pointRules: MemberPointRules;
  directoryMembers: Member[];
}

interface MemberHistoryItem {
  id: string;
  tanggal: string;
  jenis: 'Titip Beli' | 'Titip Jual';
  ringkasan: string;
  gram: number;
  total: number;
}

// =========================================================================
// HELPER: RENDER HIGH-DPI RETINA PNG KARTU MEMBER LANGSUNG DI CANVAS
// =========================================================================
async function downloadMemberCardPng(
  member: Member,
  tierLabel: string,
  cardVariant: 'bronze' | 'silver' | 'gold',
  qrDataUrl: string
) {
  const width = 1012;
  const height = 638;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Rounded card clip
  const radius = 38;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.clip();

  // Metallic luxury gradient per tier
  const bg = ctx.createLinearGradient(0, 0, width, height);
  if (cardVariant === 'gold') {
    bg.addColorStop(0, '#FFF6D6');
    bg.addColorStop(0.32, '#F0D37B');
    bg.addColorStop(0.66, '#D4AF37');
    bg.addColorStop(1, '#F6E096');
  } else if (cardVariant === 'silver') {
    bg.addColorStop(0, '#FCF8FA');
    bg.addColorStop(0.36, '#EFE5EB');
    bg.addColorStop(0.7, '#D7C4D0');
    bg.addColorStop(1, '#F5E7EC');
  } else {
    bg.addColorStop(0, '#FAF0EA');
    bg.addColorStop(0.35, '#EDD1C2');
    bg.addColorStop(0.72, '#D7AE98');
    bg.addColorStop(1, '#F3DDD2');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle foil diagonal light sheen
  const sheen = ctx.createLinearGradient(0, 0, width * 0.85, height * 0.55);
  sheen.addColorStop(0, 'rgba(255,255,255,0.45)');
  sheen.addColorStop(0.45, 'rgba(255,255,255,0.06)');
  sheen.addColorStop(1, 'rgba(255,255,255,0.28)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);

  // Inner metallic border frame
  ctx.strokeStyle =
    cardVariant === 'gold'
      ? 'rgba(140, 102, 18, 0.65)'
      : cardVariant === 'silver'
      ? 'rgba(130, 96, 114, 0.55)'
      : 'rgba(154, 105, 76, 0.55)';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Top Left: Crown + NJ emblem box
  ctx.fillStyle = 'rgba(255, 249, 247, 0.86)';
  ctx.beginPath();
  ctx.roundRect(52, 46, 104, 104, 24);
  ctx.fill();
  ctx.strokeStyle = '#C9A227';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Crown drawing
  ctx.fillStyle = '#C9A227';
  ctx.beginPath();
  ctx.moveTo(74, 88);
  ctx.lineTo(82, 66);
  ctx.lineTo(95, 78);
  ctx.lineTo(104, 59);
  ctx.lineTo(113, 78);
  ctx.lineTo(126, 66);
  ctx.lineTo(134, 88);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#9C7418';
  ctx.font = '700 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('NJ', 104, 134);

  // Top Header Text
  ctx.textAlign = 'left';
  ctx.fillStyle = '#8C4A55';
  ctx.font = '700 20px sans-serif';
  ctx.fillText('KARTU MEMBER', 178, 86);

  ctx.fillStyle = '#3D2C2C';
  ctx.font = '700 32px Georgia, serif';
  ctx.fillText('NJ GOLD JASTIP', 178, 126);

  // Top Right Tier Badge
  ctx.fillStyle = cardVariant === 'gold' ? '#3D2C2C' : '#B76E79';
  ctx.beginPath();
  ctx.roundRect(width - 285, 52, 232, 52, 26);
  ctx.fill();
  ctx.fillStyle = cardVariant === 'gold' ? '#F6E096' : '#FFF9F7';
  ctx.font = '700 21px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(tierLabel.toUpperCase(), width - 169, 85);

  // Member Name (Large, Elegant)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#7A5C5C';
  ctx.font = '600 18px sans-serif';
  ctx.fillText('NAMA MEMBER', 54, 246);

  ctx.fillStyle = '#3D2C2C';
  ctx.font = '700 46px Georgia, serif';
  const displayName =
    member.nama.length > 26 ? `${member.nama.slice(0, 26)}…` : member.nama;
  ctx.fillText(displayName, 54, 304);

  // Member ID
  ctx.fillStyle = '#7A5C5C';
  ctx.font = '600 17px sans-serif';
  ctx.fillText('MEMBER ID', 54, 376);

  ctx.fillStyle = '#3D2C2C';
  ctx.font = '700 32px monospace';
  ctx.fillText(member.id, 54, 418);

  // Bottom Metadata (Censored WA + Join Date)
  ctx.fillStyle = '#6E5050';
  ctx.font = '600 21px monospace';
  ctx.fillText(`WA: ${maskWaForCard(member.wa)}`, 54, 514);

  ctx.font = '600 21px sans-serif';
  ctx.fillText(`Bergabung: ${formatJoinDateId(member.tanggalBergabung)}`, 54, 554);

  ctx.fillStyle = '#8C4A55';
  ctx.font = '700 16px sans-serif';
  ctx.fillText('EMAS BERKUALITAS, INVESTASI BERKELAS', 54, 594);

  // QR Code Box (Bottom Right with crisp white quiet zone)
  const qrSize = 216;
  const qrX = width - qrSize - 60;
  const qrY = height - qrSize - 82;
  ctx.fillStyle = '#FFF9F7';
  ctx.beginPath();
  ctx.roundRect(qrX - 14, qrY - 14, qrSize + 28, qrSize + 58, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(201, 162, 39, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (qrDataUrl) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = qrDataUrl;
    });
  }

  ctx.fillStyle = '#5B4141';
  ctx.font = '700 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`VERIFIKASI ${member.id}`, qrX + qrSize / 2, qrY + qrSize + 28);

  const link = document.createElement('a');
  link.download = `Kartu-Member-${member.id}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// =========================================================================
// REUSABLE LUXURY DIGITAL MEMBER CARD COMPONENT (WITH REAL QR CODE)
// =========================================================================
const DigitalMemberCard: React.FC<{
  member: Member;
  tierConfig: MemberTierConfig;
  showActions?: boolean;
  isPreviewOnly?: boolean;
  onScreenshotMode?: () => void;
}> = ({ member, tierConfig, showActions = true, isPreviewOnly = false, onScreenshotMode }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [downloading, setDownloading] = useState(false);

  const qrPayload = useMemo(() => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://nj-gold.vercel.app';
    return `${member.id} | ${origin}/#member?verify=${encodeURIComponent(member.id)}`;
  }, [member.id]);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(qrPayload, {
      width: 240,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#3D2C2C',
        light: '#FFF9F7',
      },
    })
      .then((url) => {
        if (active) setQrUrl(url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [qrPayload]);

  const variantClasses: Record<
    'bronze' | 'silver' | 'gold',
    { bg: string; border: string; badge: string; accent: string }
  > = {
    bronze: {
      bg: 'bg-gradient-to-br from-[#FBF1EB] via-[#EBCABB] to-[#D6AA92]',
      border: 'border-[#C79578]',
      badge: 'bg-[#8C4A55] text-[#FFF9F7]',
      accent: 'text-[#7A4435]',
    },
    silver: {
      bg: 'bg-gradient-to-br from-[#FDF9FB] via-[#ECE1E8] to-[#D2C0CC]',
      border: 'border-[#B9A3B1]',
      badge: 'bg-[#6F5466] text-[#FFF9F7]',
      accent: 'text-[#664C5E]',
    },
    gold: {
      bg: 'bg-gradient-to-br from-[#FFF6D4] via-[#EED078] to-[#CFA62D]',
      border: 'border-[#B98D1B]',
      badge: 'bg-[#3D2C2C] text-[#F8E29B]',
      accent: 'text-[#694A0B]',
    },
  };

  const style = variantClasses[tierConfig.cardVariant];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadMemberCardPng(member, tierConfig.label, tierConfig.cardVariant, qrUrl);
    } finally {
      setDownloading(false);
    }
  };

  const shareWaHref = getWhatsAppUrl(
    `Kartu Member Digital NJ GOLD JASTIP\n• Nama: ${member.nama}\n• Member ID: ${member.id}\n• Tier: ${tierConfig.label}\n• WA: ${maskWaForCard(
      member.wa
    )}\n• Bergabung: ${formatJoinDateId(member.tanggalBergabung)}\n(Untuk verifikasi transaksi COD / ambil di rumah)`
  );

  return (
    <div className="space-y-3.5 w-full">
      {/* Landscape ATM / Business Card Frame */}
      <div
        className={`relative w-full rounded-3xl ${style.bg} border-2 ${style.border} p-4 sm:p-6 shadow-[0_18px_46px_rgba(183,110,121,0.22)] overflow-hidden text-[#3D2C2C]`}
      >
        {/* Subtle Foil Diagonal Sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/35 to-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 sm:inset-2.5 rounded-2xl border border-[#FFF9F7]/65"
        />

        <div className="relative z-10 flex flex-col justify-between gap-4 sm:gap-5">
          {/* Card Top Row: Crown NJ Logo + Title + Tier Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF9F7]/92 border border-[#D4AF37]/65 flex items-center justify-center shadow-sm shrink-0">
                <CrownNJLogo size="sm" />
              </div>
              <div className="leading-tight min-w-0">
                <div className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] ${style.accent}`}>
                  KARTU MEMBER
                </div>
                <div className="font-editorial text-[13.5px] sm:text-xl font-bold tracking-wide text-[#3D2C2C] whitespace-nowrap">
                  NJ GOLD JASTIP
                </div>
              </div>
            </div>

            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-wide shadow-sm shrink-0 whitespace-nowrap ${style.badge}`}
            >
              {tierConfig.key === 'Member' ? 'Bronze' : tierConfig.key}
            </span>
          </div>

          {/* Card Middle + QR Row */}
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2.5">
              <div>
                <div className="text-[9.5px] uppercase tracking-[0.16em] text-[#6E5050] font-semibold">
                  Nama Member
                </div>
                <div className="font-editorial text-xl sm:text-2xl font-bold text-[#3D2C2C] leading-tight break-words">
                  {member.nama}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[#6E5050] font-semibold">
                    Member ID
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-[#3D2C2C] tracking-wider">
                    {member.id}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[#6E5050] font-semibold">
                    No. WA (Tersensor)
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-[#4F3939]">
                    {maskWaForCard(member.wa)}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-semibold text-[#5E4545]">
                Bergabung: <strong className="text-[#3D2C2C]">{formatJoinDateId(member.tanggalBergabung)}</strong>
              </div>
            </div>

            {/* Real Scannable QR Code */}
            <div className="shrink-0 flex flex-col items-center bg-[#FFF9F7] p-1.5 sm:p-2 rounded-2xl border border-[#D4AF37]/50 shadow-sm">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt={`QR Verifikasi ${member.id}`}
                  className="w-[74px] h-[74px] sm:w-[92px] sm:h-[92px] rounded-lg block"
                />
              ) : (
                <div className="w-[74px] h-[74px] sm:w-[92px] sm:h-[92px] rounded-lg bg-[#F9EDEA] animate-pulse" />
              )}
              <span className="font-mono text-[8.5px] font-bold text-[#5E4545] mt-1">
                {member.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Required Action Buttons Below Card */}
      {showActions && !isPreviewOnly && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onScreenshotMode}
            className="min-h-[44px] px-3 rounded-full bg-[#FFF9F7] border border-[#B76E79] text-[#8C4A55] text-xs font-bold hover:bg-[#F9EDEA] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            Simpan / Screenshot
          </button>

          <a
            href={shareWaHref}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] px-3 rounded-full bg-[#B76E79] text-[#FFF9F7] text-xs font-bold hover:brightness-105 transition-all inline-flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            Bagikan ke WA
          </a>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading || !qrUrl}
            className="min-h-[44px] px-3 rounded-full btn-gold text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            {downloading ? 'Membuat PNG…' : 'Download PNG'}
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// MAIN MEMBER SECTION + MODALS (DAFTAR MEMBER & CEK KARTU MEMBER SAYA)
// =========================================================================
export const MemberSection: React.FC<MemberSectionProps> = ({
  tiers,
  pointRules,
  directoryMembers,
}) => {
  const [previewTier, setPreviewTier] = useState<MemberTierKey>('Gold');
  const [activeModal, setActiveModal] = useState<'none' | 'daftar' | 'cek'>('none');
  const [screenshotModalMember, setScreenshotModalMember] = useState<Member | null>(null);

  // --- Form Daftar Member States ---
  const [regNama, setRegNama] = useState('');
  const [regWa, setRegWa] = useState('');
  const [regAlamat, setRegAlamat] = useState('');
  const [regTglLahir, setRegTglLahir] = useState('');
  const [regSumber, setRegSumber] = useState('');
  const [regResult, setRegResult] = useState<{
    refCode: string;
    waUrl: string;
  } | null>(null);

  // --- Cek Kartu Member Saya States ---
  const [lookupWa, setLookupWa] = useState('');
  const [lookupSubmitted, setLookupSubmitted] = useState(false);
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [memberHistory, setMemberHistory] = useState<MemberHistoryItem[]>([]);

  const previewTierConfig =
    tiers.find((t) => t.key === previewTier) ?? tiers[tiers.length - 1];

  const genericPreviewMember: Member = useMemo(
    () => ({
      id: 'NJ-2026-XXXX',
      nama: 'Nama Member Anda',
      wa: '6285600003142',
      tanggalBergabung: '2026-11-25',
      tier: previewTier,
      totalGram: 0,
      totalTransaksi: 0,
      poin: 0,
      status: 'Aktif',
    }),
    [previewTier]
  );

  // --- Handle Submit Daftar Member ---
  const handleDaftarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = regNama.trim();
    const cleanWa = regWa.trim();
    if (!cleanName || !cleanWa) return;

    const now = new Date();
    const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const rand4 = String(Math.floor(1000 + Math.random() * 9000));
    const refCode = `NJ-MEMBER-DAFTAR-${ymd}-${rand4}`;

    const waLines = [
      `Halo NJ, saya mau DAFTAR MEMBER:`,
      `Nama: ${cleanName}`,
      `WA: ${cleanWa}`,
      `Alamat: ${regAlamat.trim() || '-'}`,
      regTglLahir ? `Tanggal Lahir: ${regTglLahir}` : null,
      regSumber ? `Tahu NJ dari: ${regSumber}` : null,
      `Ref: ${refCode}`,
    ].filter(Boolean);

    const waUrl = getWhatsAppUrl(waLines.join('\n'));

    // Save registration to localStorage key 'nj_member_daftar' safely
    try {
      const entry: MemberRegistration = {
        ref: refCode,
        nama: cleanName,
        wa: normalizeIndonesianWa(cleanWa),
        ...(regAlamat.trim() ? { alamat: regAlamat.trim() } : {}),
        ...(regTglLahir ? { tanggalLahir: regTglLahir } : {}),
        ...(regSumber ? { sumberInfo: regSumber } : {}),
        tanggalDaftar: now.toISOString(),
        status: 'Menunggu Konfirmasi',
      };
      const raw = localStorage.getItem(MEMBER_DAFTAR_STORAGE_KEY);
      const prev: MemberRegistration[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        MEMBER_DAFTAR_STORAGE_KEY,
        JSON.stringify([entry, ...prev].slice(0, 50))
      );
    } catch {
      // Jangan gagalkan pendaftaran WA jika penyimpanan lokal gagal
    }

    setRegResult({ refCode, waUrl });
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // --- Handle Cek Kartu Member Saya (Strictly Single WA Lookup) ---
  const handleLookupMember = (e: React.FormEvent) => {
    e.preventDefault();
    const targetWa = normalizeIndonesianWa(lookupWa);
    setLookupSubmitted(true);
    if (!targetWa || targetWa.length < 9) {
      setFoundMember(null);
      setMemberHistory([]);
      return;
    }

    // 1. Cek di localStorage ('nj_members') terlebih dahulu
    let matched: Member | undefined;
    try {
      const rawLocal = localStorage.getItem(MEMBERS_STORAGE_KEY);
      const localMembers: Member[] = rawLocal ? JSON.parse(rawLocal) : [];
      matched = localMembers.find((m) => normalizeIndonesianWa(m.wa) === targetWa);
    } catch {
      // Ignore storage error
    }

    // 2. Jika belum ada di localStorage, cek daftar member aktif dari public/members.json
    if (!matched) {
      matched = directoryMembers.find(
        (m) => normalizeIndonesianWa(m.wa) === targetWa && m.status === 'Aktif'
      );
    }

    if (!matched) {
      setFoundMember(null);
      setMemberHistory([]);
      return;
    }

    // 3. Kumpulkan riwayat transaksi milik WA ini saja dari nj_orders & nj_titip_jual
    const history: MemberHistoryItem[] = [];
    try {
      const rawOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      const orders: Order[] = rawOrders ? JSON.parse(rawOrders) : [];
      for (const ord of orders) {
        if (normalizeIndonesianWa(ord.waPelanggan) === targetWa) {
          const grams = ord.items.reduce((s, it) => s + it.gram * it.qty, 0);
          history.push({
            id: ord.id,
            tanggal: ord.tanggal,
            jenis: 'Titip Beli',
            ringkasan: ord.items.map((i) => `${i.qty}× ${i.produk}`).join(', '),
            gram: Number(grams.toFixed(2)),
            total: ord.total,
          });
        }
      }
    } catch {
      // Ignore
    }

    try {
      const rawJual = localStorage.getItem(TITIP_JUAL_STORAGE_KEY);
      const jualList: Array<{
        id?: string;
        tanggal?: string;
        wa?: string;
        waPelanggan?: string;
        brand?: string;
        gram?: number;
        berat?: number;
        total?: number;
        estimasi?: number;
      }> = rawJual ? JSON.parse(rawJual) : [];
      for (const item of jualList) {
        const itemWa = normalizeIndonesianWa(item.wa ?? item.waPelanggan ?? '');
        if (itemWa && itemWa === targetWa) {
          history.push({
            id: item.id ?? 'JUAL-NJ',
            tanggal: item.tanggal ?? new Date().toISOString(),
            jenis: 'Titip Jual',
            ringkasan: `Jual Emas ${item.brand ?? 'NJ'} (${item.gram ?? item.berat ?? 0}g)`,
            gram: Number(item.gram ?? item.berat ?? 0),
            total: Number(item.total ?? item.estimasi ?? 0),
          });
        }
      }
    } catch {
      // Ignore
    }

    history.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

    // Sinkronkan tier otomatis dari totalGram & totalTransaksi (tanpa mengarang angka)
    const effectiveTier = computeEffectiveTier(
      matched.totalGram,
      matched.totalTransaksi,
      tiers,
      matched.tier
    );

    setFoundMember({
      ...matched,
      tier: effectiveTier,
    });
    setMemberHistory(history);
  };

  const foundTierConfig = foundMember
    ? tiers.find((t) => t.key === foundMember.tier) ?? tiers[0]
    : tiers[0];

  const redeemableVouchers = foundMember
    ? Math.floor(foundMember.poin / pointRules.redeemPoints)
    : 0;

  return (
    <section
      id="member"
      className="scroll-mt-24 py-16 sm:py-20 lg:py-24 bg-marble-luxury border-b border-[#EAD3CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Banner + Card Design Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Pitch & 2 Primary CTA Buttons */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9EDEA] border border-[#D4AF37]/50 text-xs font-bold text-[#8C4A55]">
              <Crown className="w-4 h-4 text-[#C9A227]" />
              <span>Program Pelanggan Setia NJ</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3D2C2C] leading-[1.12]">
              Member <span className="italic text-gold-foil">NJ Gold Jastip</span> — Manfaat
              Lebih di Setiap Gram
            </h2>

            <p className="text-sm sm:text-base text-[#7A5C5C] leading-relaxed">
              Khusus pelanggan tetap jastip jual &amp; beli emas NJ. Daftar cukup pakai{' '}
              <strong>Nama &amp; No. WA</strong> (tanpa password, tanpa KTP, tanpa ribet) untuk
              memiliki <strong>Kartu Member Digital</strong> dengan QR verifikasi COD, kumpulkan
              poin, dan nikmati diskon fee hingga 50%!
            </p>

            {/* 4 Ringkas Benefit Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                {
                  icon: Sparkles,
                  title: 'Prioritas Stok & Info Duluan',
                  desc: 'Dapat kabar stok Semar Nusantara, Semar Jawa & Ismoyo lebih awal via WA.',
                },
                {
                  icon: Gift,
                  title: 'Diskon Fee Hingga 50% + Free Fee',
                  desc: 'Hemat biaya jastip hingga setengah harga di tier Silver & Gold.',
                },
                {
                  icon: Award,
                  title: 'Bonus Harga Buyback Lebih Tinggi',
                  desc: 'Tambahan +Rp 5.000/g (Silver) hingga +Rp 10.000/g (Gold) saat jual emas.',
                },
                {
                  icon: CreditCard,
                  title: 'Kartu Digital QR + Kumpul Poin',
                  desc: '1 gram transaksi = 10 poin. 100 poin langsung tukar potongan fee Rp 15.000.',
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#E8CEC7] flex items-start gap-3 shadow-[0_6px_18px_rgba(183,110,121,0.07)]"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F9EDEA] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                    <b.icon className="w-4 h-4 text-[#B76E79]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs sm:text-[13px] font-bold text-[#3D2C2C]">
                      {b.title}
                    </h3>
                    <p className="text-[11px] text-[#7A5C5C] mt-0.5 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 2 Required Main Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRegResult(null);
                  setActiveModal('daftar');
                }}
                className="inline-flex items-center justify-center gap-2 px-7 min-h-[48px] rounded-full btn-gold text-sm font-bold transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Daftar Member
              </button>

              <button
                type="button"
                onClick={() => {
                  setLookupSubmitted(false);
                  setFoundMember(null);
                  setActiveModal('cek');
                }}
                className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-full bg-[#FFF9F7] border-2 border-[#B76E79] text-[#8C4A55] text-sm font-bold hover:bg-[#F9EDEA] transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#B76E79]" />
                Cek Kartu Member Saya
              </button>
            </div>
          </div>

          {/* Right Generic Card Preview (No Private Data Exposed) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8C4A55]">
                Contoh Desain Kartu Member
              </span>
              <div className="inline-flex p-1 rounded-full bg-[#F9EDEA] border border-[#E5C4BB]">
                {(['Member', 'Silver', 'Gold'] as MemberTierKey[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPreviewTier(t)}
                    className={`px-3 min-h-[34px] rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      previewTier === t
                        ? 'btn-gold'
                        : 'text-[#7A5C5C] hover:text-[#3D2C2C]'
                    }`}
                  >
                    {t === 'Member' ? 'Bronze' : t}
                  </button>
                ))}
              </div>
            </div>

            <DigitalMemberCard
              member={genericPreviewMember}
              tierConfig={previewTierConfig}
              showActions={false}
              isPreviewOnly={true}
            />

            <p className="text-[11px] text-[#7A5C5C] text-center">
              Tampilan ilustrasi kartu digital — kartu asli memuat nama, Member ID unik, dan QR
              verifikasi milikmu sendiri.
            </p>
          </div>
        </div>

        {/* 3 Configurable Tier Cards + Point Rules */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((tier) => {
              const isGold = tier.key === 'Gold';
              const isSilver = tier.key === 'Silver';
              return (
                <div
                  key={tier.key}
                  className={`rounded-3xl p-6 border flex flex-col justify-between space-y-4 ${
                    isGold
                      ? 'bg-gradient-to-b from-[#FFF8E2] to-[#F9EDEA] border-[#D4AF37] shadow-[0_14px_34px_rgba(201,162,39,0.16)]'
                      : isSilver
                      ? 'bg-gradient-to-b from-[#FCF8FA] to-[#F4EAEF] border-[#C9B3C0] shadow-[0_10px_28px_rgba(183,110,121,0.1)]'
                      : 'bg-[#FFF9F7] border-[#E8CEC7] shadow-[0_10px_24px_rgba(183,110,121,0.08)]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-editorial text-2xl font-bold text-[#3D2C2C]">
                        {tier.label}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isGold
                            ? 'bg-[#3D2C2C] text-[#F6E096]'
                            : isSilver
                            ? 'bg-[#6F5466] text-[#FFF9F7]'
                            : 'bg-[#F3DAD3] text-[#7A444E]'
                        }`}
                      >
                        {tier.key}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#8C4A55] bg-[#FFF9F7]/85 border border-[#E8CEC7] rounded-xl px-3 py-2">
                      Syarat: {tier.shortRule}
                    </div>

                    <ul className="space-y-2 text-xs sm:text-[13px] text-[#5B4141]">
                      {tier.benefits.map((bf) => (
                        <li key={bf} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                          <span>{bf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRegResult(null);
                      setActiveModal('daftar');
                    }}
                    className={`w-full min-h-[44px] rounded-full text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                      isGold
                        ? 'btn-gold'
                        : 'bg-[#FFF9F7] border border-[#B76E79] text-[#8C4A55] hover:bg-[#F9EDEA]'
                    }`}
                  >
                    Gabung Member NJ
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Aturan Poin + Privacy Assurance Strip */}
          <div className="grid lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 rounded-3xl bg-[#F9EDEA] border border-[#E5C4BB] p-5 sm:p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8C4A55]">
                <Gift className="w-4 h-4 text-[#C9A227]" />
                Aturan Poin Member NJ
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#3D2C2C]">
                {pointRules.summary.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span className="text-[#C9A227] font-bold">✦</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 rounded-3xl bg-[#FFF9F7] border border-[#E5C4BB] p-5 sm:p-6 flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F9EDEA] border border-[#D4AF37]/45 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-[#B76E79]" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[#8C4A55]">
                  Privasi Member Terjaga
                </div>
                <p className="text-xs text-[#6E5050] leading-relaxed">
                  Data member hanya untuk NJ dan kamu. Kartu member jangan dibagikan ke orang
                  lain kecuali untuk verifikasi saat COD / ambil di rumah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: DAFTAR MEMBER (TANPA PASSWORD / KTP / EMAIL / OTP)         */}
      {/* =================================================================== */}
      {activeModal === 'daftar' && (
        <div
          className="fixed inset-0 z-50 bg-[#3D2C2C]/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setActiveModal('none')}
        >
          <div
            className="bg-[#FFF9F7] rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-[#E5C4BB] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 bg-blush-silk text-[#3D2C2C] flex items-center justify-between border-b border-[#E5C4BB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF9F7] border border-[#D4AF37]/55 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5 text-[#B76E79]" />
                </div>
                <div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold">
                    Daftar Member NJ
                  </h3>
                  <p className="text-xs text-[#7A5C5C]">
                    Cukup Nama &amp; No. WA — tanpa password &amp; tanpa KTP
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                aria-label="Tutup form daftar member"
                className="w-10 h-10 rounded-full bg-[#FFF9F7]/85 text-[#3D2C2C] flex items-center justify-center hover:bg-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {!regResult ? (
                <form onSubmit={handleDaftarSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                      Nama Lengkap *{' '}
                      <span className="font-normal text-[#7A5C5C]">
                        (tampil di Kartu Member)
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      value={regNama}
                      onChange={(e) => setRegNama(e.target.value)}
                      placeholder="Contoh: Ibu Dewi Anggraini"
                      className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                      No. WA Aktif *{' '}
                      <span className="font-normal text-[#7A5C5C]">
                        (jadi kunci cek kartu nanti)
                      </span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={regWa}
                      onChange={(e) => setRegWa(e.target.value)}
                      placeholder="Contoh: 085641213142"
                      className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                      Alamat (Opsional — isi kalau mau kirim)
                    </label>
                    <textarea
                      rows={2}
                      value={regAlamat}
                      onChange={(e) => setRegAlamat(e.target.value)}
                      placeholder="Boleh dikosongkan jika biasa COD / ambil di rumah"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                        Tanggal Lahir (Opsional)
                      </label>
                      <input
                        type="date"
                        value={regTglLahir}
                        onChange={(e) => setRegTglLahir(e.target.value)}
                        className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3D2C2C] block mb-1">
                        Darimana tahu NJ? (Opsional)
                      </label>
                      <select
                        value={regSumber}
                        onChange={(e) => setRegSumber(e.target.value)}
                        className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#FFF9F7] border border-[#DFC0B6] text-sm focus:outline-none focus:border-[#C9A227]"
                      >
                        <option value="">Pilih salah satu…</option>
                        <option value="Teman">Teman</option>
                        <option value="Instagram">Instagram</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F9EDEA] border border-[#E8CEC7] text-[11px] text-[#6E5050] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
                    <span>
                      Data member hanya untuk NJ dan kamu. Tanpa password, tanpa OTP, dan tidak
                      ditampilkan ke publik.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] px-5 rounded-full btn-gold font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Daftar via WA
                  </button>
                </form>
              ) : (
                <div className="space-y-5 text-center py-2">
                  <div className="w-14 h-14 rounded-full bg-[#F9EDEA] border border-[#D4AF37]/60 text-[#B76E79] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-editorial text-2xl font-bold text-[#3D2C2C]">
                      Pendaftaran Member Terkirim!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5B4141] leading-relaxed">
                      Pendaftaran kamu sudah dikirim ke WA NJ. Kakak akan konfirmasi dan kirim
                      Kartu Member kamu. Simpan No. WA kamu, itu kunci untuk cek kartu nanti.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F9EDEA] border border-[#E5C4BB] font-mono text-xs text-[#8C4A55] font-bold">
                    Ref: {regResult.refCode}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <a
                      href={regResult.waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full min-h-[48px] px-5 rounded-full btn-gold font-bold text-sm inline-flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Buka WhatsApp NJ ({BRAND_INFO.whatsappDisplay})
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="w-full min-h-[44px] px-5 rounded-full bg-[#FFF9F7] border border-[#DFC0B6] text-xs font-bold text-[#5E4545] cursor-pointer"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: CEK KARTU MEMBER SAYA (SINGLE WA INPUT — PRIVAT!)          */}
      {/* =================================================================== */}
      {activeModal === 'cek' && (
        <div
          className="fixed inset-0 z-50 bg-[#3D2C2C]/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setActiveModal('none')}
        >
          <div
            className="bg-[#FFF9F7] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-[#E5C4BB] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 bg-blush-silk text-[#3D2C2C] flex items-center justify-between border-b border-[#E5C4BB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF9F7] border border-[#D4AF37]/55 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-[#B76E79]" />
                </div>
                <div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold">
                    Cek Kartu Member Saya
                  </h3>
                  <p className="text-xs text-[#7A5C5C]">
                    Masukkan No. WA kamu — satu WA hanya bisa lihat kartunya sendiri
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                aria-label="Tutup cek kartu member"
                className="w-10 h-10 rounded-full bg-[#FFF9F7]/85 text-[#3D2C2C] flex items-center justify-center hover:bg-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {/* Single WA Input Form */}
              <form onSubmit={handleLookupMember} className="space-y-3">
                <label className="text-xs font-bold text-[#3D2C2C] block">
                  No. WA kamu *{' '}
                  <span className="font-normal text-[#7A5C5C]">(contoh: 085641213142)</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="tel"
                      value={lookupWa}
                      onChange={(e) => {
                        setLookupWa(e.target.value);
                        setLookupSubmitted(false);
                      }}
                      placeholder="085641213142"
                      className="w-full min-h-[46px] pl-10 pr-4 rounded-2xl bg-[#FFF9F7] border border-[#DFC0B6] font-mono text-sm text-[#3D2C2C] focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 min-h-[46px] rounded-2xl btn-gold text-sm font-bold cursor-pointer shrink-0"
                  >
                    Lihat Kartu Saya
                  </button>
                </div>
              </form>

              {/* Not Found State */}
              {lookupSubmitted && !foundMember && (
                <div className="p-5 rounded-3xl bg-[#F9EDEA] border border-[#E5C4BB] space-y-3 text-center">
                  <p className="text-xs sm:text-sm text-[#5B4141] leading-relaxed font-medium">
                    Member dengan WA ini belum ditemukan. Mungkin pendaftaran kamu belum
                    dikonfirmasi kakak, atau kamu belum daftar. Cek lagi nomornya, atau klik
                    Daftar Member.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRegWa(lookupWa);
                      setRegResult(null);
                      setActiveModal('daftar');
                    }}
                    className="px-6 min-h-[44px] rounded-full btn-gold text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Daftar Member
                  </button>
                </div>
              )}

              {/* Found State: Luxury Card + Private Member Dashboard */}
              {foundMember && (
                <div className="space-y-5">
                  <DigitalMemberCard
                    member={foundMember}
                    tierConfig={foundTierConfig}
                    showActions={true}
                    onScreenshotMode={() => setScreenshotModalMember(foundMember)}
                  />

                  {/* Private Member Stats Grid */}
                  <div className="rounded-3xl bg-[#F9EDEA]/80 border border-[#E5C4BB] p-4 sm:p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8CEC7] pb-3">
                      <div>
                        <div className="text-xs font-bold text-[#3D2C2C]">
                          Dashboard Member Pribadi
                        </div>
                        <div className="text-[11px] font-mono text-[#7A5C5C]">
                          WA Terverifikasi: {formatWaFullPrivate(foundMember.wa)}
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#EEF7F2] border border-[#BFE0CD] text-[#1E6346] text-[11px] font-bold">
                        Status: {foundMember.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE]">
                        <div className="text-[10px] uppercase tracking-wider text-[#7A5C5C] font-bold">
                          Total Gram
                        </div>
                        <div className="font-mono text-lg font-bold text-[#3D2C2C] mt-0.5">
                          {foundMember.totalGram} gram
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE]">
                        <div className="text-[10px] uppercase tracking-wider text-[#7A5C5C] font-bold">
                          Total Transaksi
                        </div>
                        <div className="font-mono text-lg font-bold text-[#3D2C2C] mt-0.5">
                          {foundMember.totalTransaksi}
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE]">
                        <div className="text-[10px] uppercase tracking-wider text-[#7A5C5C] font-bold">
                          Poin Saya
                        </div>
                        <div className="font-mono text-lg font-bold text-[#9C7418] mt-0.5">
                          {foundMember.poin} poin
                        </div>
                        {redeemableVouchers > 0 && (
                          <div className="text-[10px] text-[#1E6346] font-bold mt-0.5">
                            Bisa tukar {redeemableVouchers}× fee gratis!
                          </div>
                        )}
                      </div>
                      <div className="p-3 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE]">
                        <div className="text-[10px] uppercase tracking-wider text-[#7A5C5C] font-bold">
                          Tier Saya
                        </div>
                        <div className="font-editorial text-lg font-bold text-[#8C4A55] mt-0.5">
                          {foundTierConfig.label}
                        </div>
                      </div>
                    </div>

                    {/* Active Benefits */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-[#3D2C2C]">
                        Benefit Saya ({foundTierConfig.label}):
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#5B4141]">
                        {foundTierConfig.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Member Transaction History (from nj_orders & nj_titip_jual) */}
                    <div className="pt-3 border-t border-[#E8CEC7] space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#3D2C2C]">
                        <ReceiptText className="w-4 h-4 text-[#B76E79]" />
                        Riwayat Transaksi Saya
                      </div>
                      {memberHistory.length === 0 ? (
                        <div className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE] text-xs text-[#7A5C5C] text-center">
                          Belum ada transaksi.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {memberHistory.slice(0, 6).map((h) => (
                            <div
                              key={`${h.id}-${h.tanggal}`}
                              className="p-3 rounded-2xl bg-[#FFF9F7] border border-[#ECD5CE] flex items-center justify-between gap-2 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded-full bg-[#F9EDEA] text-[#8C4A55] text-[10px] font-bold">
                                    {h.jenis}
                                  </span>
                                  <span className="font-mono text-[11px] font-bold text-[#3D2C2C]">
                                    {h.id}
                                  </span>
                                </div>
                                <div className="text-[11px] text-[#6E5050] mt-1 truncate">
                                  {h.ringkasan}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-mono font-bold text-[#3D2C2C]">
                                  {formatIDR(h.total)}
                                </div>
                                <div className="font-mono text-[10px] text-[#9C7418]">
                                  {h.gram}g
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Update Data via WA */}
                    <a
                      href={getWhatsAppUrl(
                        `Halo NJ, saya member atas nama ${foundMember.nama} (ID: ${foundMember.id}, WA: ${formatWaFullPrivate(
                          foundMember.wa
                        )}). Saya ingin memperbarui data / cek sinkronisasi poin member saya.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full min-h-[44px] px-4 rounded-full bg-[#FFF9F7] border border-[#B76E79] text-[#8C4A55] text-xs font-bold hover:bg-[#F3DAD3] transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Perbarui Data Saya via WA
                    </a>
                  </div>

                  <p className="text-[11px] text-[#7A5C5C] text-center leading-relaxed">
                    Data member hanya untuk NJ dan kamu. Kartu member jangan dibagikan ke orang
                    lain kecuali untuk verifikasi saat COD / ambil di rumah.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FULLSCREEN CLEAN SCREENSHOT MODAL (FOR EASY MOBILE SCREENSHOT)      */}
      {/* =================================================================== */}
      {screenshotModalMember && (
        <div
          className="fixed inset-0 z-[60] bg-[#3D2C2C]/85 backdrop-blur-md flex flex-col items-center justify-center p-4 gap-4"
          onClick={() => setScreenshotModalMember(null)}
        >
          <div className="text-center text-[#FFF9F7] space-y-1 max-w-md">
            <div className="text-xs font-bold uppercase tracking-widest text-[#F6E096]">
              Mode Screenshot Kartu Member
            </div>
            <p className="text-xs text-[#F3DAD3]">
              Silakan ambil tangkapan layar (screenshot) kartu di bawah ini untuk disimpan di
              galeri HP kamu.
            </p>
          </div>
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <DigitalMemberCard
              member={screenshotModalMember}
              tierConfig={
                tiers.find((t) => t.key === screenshotModalMember.tier) ?? tiers[0]
              }
              showActions={false}
            />
          </div>
          <button
            type="button"
            onClick={() => setScreenshotModalMember(null)}
            className="px-6 min-h-[44px] rounded-full bg-[#FFF9F7] text-[#3D2C2C] text-xs font-bold cursor-pointer"
          >
            Tutup Mode Screenshot
          </button>
        </div>
      )}
    </section>
  );
};
