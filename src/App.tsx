import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import {
  PRODUCTS,
  GoldProduct,
  BrandType,
  DEMO_TRACKING_ORDERS,
  TrackingOrder,
  Order,
  BRAND_INFO,
  LAST_UPDATED,
  DEFAULT_WORLD_SPOT,
  WorldSpotRef,
  Member,
  MemberTierConfig,
  MemberPointRules,
  DEFAULT_MEMBER_TIERS,
  DEFAULT_MEMBER_POINT_RULES,
  DEFAULT_SAMPLE_MEMBERS,
  mergeProductsWithPrices,
  fetchLivePricesJson,
  fetchLiveMembersJson,
  fetchWorldGoldSpot,
  getWhatsAppUrl,
} from './data/goldData';
import {
  AUTO_REFRESH_MS,
  CART_STORAGE_KEY,
  ORDERS_STORAGE_KEY,
} from './config';
import { NavbarAndTicker } from './components/NavbarAndTicker';
import { HeroSection } from './components/HeroSection';
import { LivePriceBoard } from './components/LivePriceBoard';
import { ProductCatalog } from './components/ProductCatalog';
import { JastipCalculator, CalculatorPrefill } from './components/JastipCalculator';
import { AuthenticityAndVault } from './components/AuthenticityAndVault';
import { MemberSection } from './components/MemberSection';
import { OrderTracker } from './components/OrderTracker';
import { ScheduleAndBranches } from './components/ScheduleAndBranches';
import { TestimonialsAndFaq } from './components/TestimonialsAndFaq';
import { CartAndCheckout, CartItem } from './components/CartAndCheckout';
import { CustomRequestModal } from './components/CustomRequestModal';
import { Footer } from './components/Footer';

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadSavedOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savedOrdersToTrackingMap(orders: Order[]): Record<string, TrackingOrder> {
  const map: Record<string, TrackingOrder> = {};
  for (const ord of orders) {
    const firstBrandLabel = ord.items[0]?.brand ?? 'Semar Nusantara';
    const isCodOrHome = ord.metode === 'COD' || ord.metode === 'Ambil di Rumah';
    const brandCode: BrandType = firstBrandLabel.includes('Ismoyo')
      ? 'ISMOYO'
      : firstBrandLabel.includes('Jawa')
      ? 'SEMAR_JAWA'
      : firstBrandLabel.includes('ANTAM')
      ? 'ANTAM'
      : 'SEMAR_NUSANTARA';
    map[ord.id] = {
      orderId: ord.id,
      customerName: ord.nama,
      city: ord.metode === 'Kirim' ? ord.alamat ?? 'Pengiriman Ekspedisi' : ord.metode,
      brand: brandCode,
      brandLabel: firstBrandLabel,
      transactionType: 'Beli',
      itemsSummary: ord.items.map((i) => `${i.qty}× ${i.produk}`).join(' + '),
      totalValue: ord.total,
      branchSource: `Gerai Resmi ${firstBrandLabel}`,
      runnerName: `Tim NJ (${BRAND_INFO.locationPinName})`,
      receiptNo: `ORDER WA (${ord.id})`,
      courierName: ord.metode === 'Kirim' ? 'Kirim via Ekspedisi Berasuransi' : ord.metode,
      resiNumber: isCodOrHome
        ? ord.jadwal || 'Konfirmasi Jadwal via WA NJ'
        : 'Menunggu Konfirmasi & Packing Kayu',
      insurancePolicy: isCodOrHome ? 'SERAH TERIMA LANGSUNG' : 'ASURANSI 100%',
      currentStep: 0,
      steps: [
        {
          title: 'Order Disiapkan & Tersimpan di Riwayat NJ',
          timestamp: new Date(ord.tanggal).toLocaleString('id-ID'),
          detail: `Order ${ord.id} atas nama ${ord.nama} siap dikonfirmasi melalui WA NJ (${BRAND_INFO.whatsappDisplay}).`,
          completed: true,
        },
        {
          title: 'Konfirmasi Stok & Pembelian di Gerai Resmi',
          timestamp: 'Menunggu Konfirmasi WA',
          detail: 'Tim NJ membelikan langsung di gerai resmi dan mengirim foto nota asli.',
          completed: false,
        },
        {
          title: 'Verifikasi Fisik & Foto Nota Resmi',
          timestamp: 'Tahap Berikutnya',
          detail: 'Dokumentasi HD emas dan surat resmi dikirim ke WhatsApp Anda.',
          completed: false,
        },
        {
          title: isCodOrHome
            ? 'Jadwal COD / Ambil di Rumah Mbak Jannah'
            : 'Packing Kayu & Pengiriman Berasuransi 100%',
          timestamp: 'Tahap Berikutnya',
          detail: isCodOrHome
            ? 'Tanpa ongkir — konfirmasi jadwal via WA sebelum ketemuan.'
            : 'Dikirim menggunakan ekspedisi berasuransi penuh.',
          completed: false,
        },
        {
          title: 'Serah Terima & Selesai',
          timestamp: 'Segera',
          detail: 'Cek fisik emas & surat resmi secara lengkap.',
          completed: false,
        },
      ],
    };
  }
  return map;
}

export function App() {
  const [products, setProducts] = useState<GoldProduct[]>(PRODUCTS);
  const [lastUpdated, setLastUpdated] = useState<string>(LAST_UPDATED);
  const [worldSpot, setWorldSpot] = useState<WorldSpotRef>(DEFAULT_WORLD_SPOT);
  const [memberTiers, setMemberTiers] = useState<MemberTierConfig[]>(DEFAULT_MEMBER_TIERS);
  const [memberPointRules, setMemberPointRules] = useState<MemberPointRules>(
    DEFAULT_MEMBER_POINT_RULES
  );
  const [directoryMembers, setDirectoryMembers] = useState<Member[]>(DEFAULT_SAMPLE_MEMBERS);

  const [cartItems, setCartItems] = useState<CartItem[]>(loadInitialCart);
  const [savedOrders, setSavedOrders] = useState<Order[]>(loadSavedOrders);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState<'ALL' | BrandType>('ALL');
  const [ordersMap, setOrdersMap] = useState<Record<string, TrackingOrder>>(() => ({
    ...savedOrdersToTrackingMap(loadSavedOrders()),
    ...DEMO_TRACKING_ORDERS,
  }));
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [calcPrefill, setCalcPrefill] = useState<CalculatorPrefill | null>(null);

  // Persist cart to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore private browsing quota errors
    }
  }, [cartItems]);

  // Fetch live prices.json + world gold spot on load & auto-refresh every 5 minutes
  const refreshPricesAndSpot = useCallback(async () => {
    const payload = await fetchLivePricesJson();
    let spotFallback = DEFAULT_WORLD_SPOT;
    if (payload) {
      if (payload.updatedAt) setLastUpdated(payload.updatedAt);
      if (payload.worldSpotRef) {
        spotFallback = payload.worldSpotRef;
        setWorldSpot(payload.worldSpotRef);
      }
      const merged = mergeProductsWithPrices(PRODUCTS, payload);
      setProducts(merged);

      // Sync live prices & guard cart against products that became out of stock ("Habis" / stock 0)
      setCartItems((prev) =>
        prev
          .map((ci) => {
            const updated = merged.find((m) => m.id === ci.product.id);
            return updated ? { ...ci, product: updated } : ci;
          })
          .filter((ci) => {
            const updated = merged.find((m) => m.id === ci.product.id);
            if (!updated) return true;
            return updated.stockStatus !== 'Habis' && updated.stock > 0;
          })
      );
    }

    const liveSpot = await fetchWorldGoldSpot(spotFallback);
    setWorldSpot(liveSpot);

    const membersPayload = await fetchLiveMembersJson();
    if (membersPayload) {
      if (Array.isArray(membersPayload.tiers) && membersPayload.tiers.length > 0) {
        setMemberTiers(membersPayload.tiers);
      }
      if (membersPayload.pointRules) {
        setMemberPointRules(membersPayload.pointRules);
      }
      if (Array.isArray(membersPayload.members)) {
        setDirectoryMembers(membersPayload.members);
      }
    }
  }, []);

  useEffect(() => {
    refreshPricesAndSpot();
    const timer = window.setInterval(refreshPricesAndSpot, AUTO_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [refreshPricesAndSpot]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const addToCart = (product: GoldProduct, quantity = 1, customNote?: string) => {
    if (product.stockStatus === 'Habis' || (product.stock === 0 && !customNote)) {
      showToast(`Maaf, ${product.name} sedang habis — silakan Tanya WA untuk Pre-order.`);
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity, customNote }];
    });
    showToast(`${product.name} (${quantity}×) masuk ke Keranjang NJ`);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const handleQuickSelectBrand = (brand: BrandType) => {
    setActiveBrand(brand);
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartSellFlow = (
    brand: BrandType,
    weight: number,
    isJewelry = false,
    karat: '17K' | '10K' = '17K'
  ) => {
    setCalcPrefill({
      mode: 'JUAL',
      brand,
      weight,
      isJewelry,
      karat,
      timestamp: Date.now(),
    });
    const el = document.getElementById('kalkulator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderCreated = (newTrackingOrder: TrackingOrder, standardOrder: Order) => {
    setOrdersMap((prev) => ({
      [newTrackingOrder.orderId]: newTrackingOrder,
      ...prev,
    }));
    setSavedOrders((prev) => [standardOrder, ...prev].slice(0, 50));
    setHighlightedOrderId(newTrackingOrder.orderId);
  };

  const handleJumpToTracker = (orderId: string) => {
    setHighlightedOrderId(orderId);
    const el = document.getElementById('lacak');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F7] text-[#3D2C2C]">
      <NavbarAndTicker
        cartCount={totalCartCount}
        lastUpdated={lastUpdated}
        worldSpot={worldSpot}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomRequest={() => setIsCustomModalOpen(true)}
      />

      <main className="flex-1">
        <HeroSection
          lastUpdated={lastUpdated}
          onQuickSelectBrand={handleQuickSelectBrand}
          onStartSellHero={() => handleStartSellFlow('SEMAR_NUSANTARA', 1)}
        />

        <LivePriceBoard
          products={products}
          lastUpdated={lastUpdated}
          onAddToCart={(product) => addToCart(product, 1)}
          onStartSellFlow={(brand, weight) => handleStartSellFlow(brand, weight)}
        />

        <ProductCatalog
          products={products}
          lastUpdated={lastUpdated}
          activeBrand={activeBrand}
          onBrandChange={setActiveBrand}
          onAddToCart={(product) => addToCart(product, 1)}
          onSellProduct={(brand, weight, isJewelry, karat) =>
            handleStartSellFlow(brand, weight, isJewelry, karat)
          }
          onOpenCustomRequest={() => setIsCustomModalOpen(true)}
        />

        <JastipCalculator
          onAddSimulatedItem={(product, qty) => addToCart(product, qty)}
          prefill={calcPrefill}
        />

        <AuthenticityAndVault />

        <MemberSection
          tiers={memberTiers}
          pointRules={memberPointRules}
          directoryMembers={directoryMembers}
        />

        <OrderTracker
          ordersMap={ordersMap}
          highlightedOrderId={highlightedOrderId}
        />

        <ScheduleAndBranches
          onSelectBrandCatalog={handleQuickSelectBrand}
          onOpenCustomRequest={() => setIsCustomModalOpen(true)}
        />

        <TestimonialsAndFaq />
      </main>

      <Footer />

      {/* Slide-Over Cart & Streamlined No-Login WA Checkout */}
      <CartAndCheckout
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        savedOrders={savedOrders}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
        onOrderCreated={handleOrderCreated}
        onJumpToTracker={handleJumpToTracker}
      />

      {/* Custom Perhiasan Request Modal */}
      <CustomRequestModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddCustomToCart={(product, note) => {
          addToCart(product, 1, note);
          setIsCartOpen(true);
        }}
      />

      {/* Toast Notification (Positioned Bottom-Left to never overlap Chat WA NJ) */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-5 left-4 right-4 sm:right-auto z-40 sm:max-w-sm bg-[#FFF9F7] text-[#3D2C2C] border-2 border-[#D4AF37] px-4 py-3 rounded-2xl shadow-[0_14px_34px_rgba(183,110,121,0.22)] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#B76E79] shrink-0" />
          <div className="text-xs font-semibold leading-snug flex-1">{toastMessage}</div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-bold text-[#9C7418] underline shrink-0 px-2 py-1 cursor-pointer"
          >
            Lihat
          </button>
        </div>
      )}

      {/* Floating WhatsApp Official NJ Button (Visible Number on All Devices) */}
      <a
        href={getWhatsAppUrl(
          'Halo NJ, saya ingin tanya jastip jual/beli emas (Semar Nusantara / Semar Jawa / Ismoyo).'
        )}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WA NJ"
        className="fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-30 inline-flex items-center gap-2 pl-3.5 pr-4 sm:pl-4 sm:pr-5 min-h-[48px] rounded-full bg-gradient-to-r from-[#B76E79] to-[#9B515E] text-[#FFF9F7] text-xs sm:text-sm font-bold shadow-[0_12px_30px_rgba(183,110,121,0.42)] hover:brightness-105 hover:scale-[1.02] transition-all border border-[#F2D77E]/65"
      >
        <MessageCircle className="w-4 h-4 text-[#F7DF8D] shrink-0" />
        <span className="leading-tight text-left">
          <span className="block">Chat WA NJ</span>
          <span className="block font-mono text-[10px] font-medium text-[#FCE9E3]">
            {BRAND_INFO.whatsappDisplay}
          </span>
        </span>
      </a>
    </div>
  );
}

export default App;
