// =========================================================================
// KONFIGURASI TERPUSAT NJ — JASTIP JUAL & BELI EMAS
// Ubah nomor WA, link Google Maps, atau endpoint log order cukup di file ini.
// Seluruh komponen membaca konfigurasi dari sini.
// =========================================================================

export const WA_NUMBER = '6285641213142';
export const WA_DISPLAY = '+62 856-4121-3142';
export const WA_LINK = 'https://wa.me/6285641213142';

export const MAPS_LINK = 'https://maps.app.goo.gl/QgtHzx9J8enf2JZd9';
export const MAPS_EMBED_URL =
  'https://www.google.com/maps?q=-7.3794047,110.8722012&z=16&output=embed';

export const LOCATION_PIN_NAME = 'Mbak Jannah';
export const LOCATION_ADDRESS =
  'Mororejo RT16 RW 07 Sambiduwur, Kec. Tanon, Kabupaten Sragen, Jawa Tengah 57277';
export const LOCATION_LAT = -7.3794047;
export const LOCATION_LNG = 110.8722012;

// Kosong dulu untuk MVP tanpa database.
// Diisi nanti jika sudah ada Google Apps Script / Sheet / endpoint log order.
export const ORDER_LOG_URL = '';

// Sumber data harga & stok (satu file di public/prices.json)
export const PRICES_JSON_URL = '/prices.json';

// Sumber data member, tier & aturan poin (satu file di public/members.json)
export const MEMBERS_JSON_URL = '/members.json';

// Interval refresh otomatis harga & stok (5 menit)
export const AUTO_REFRESH_MS = 5 * 60 * 1000;

// Key penyimpanan lokal di browser pelanggan
export const CART_STORAGE_KEY = 'nj_cart';
export const ORDERS_STORAGE_KEY = 'nj_orders';
export const TITIP_JUAL_STORAGE_KEY = 'nj_titip_jual';
export const MEMBER_DAFTAR_STORAGE_KEY = 'nj_member_daftar';
export const MEMBERS_STORAGE_KEY = 'nj_members';
