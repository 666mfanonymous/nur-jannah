# NJ — Jastip Jual & Beli Emas

Landing page resmi **NJ (NJ Gold Jastip)** untuk layanan jual & beli emas **Semar Nusantara**, **Semar Jawa (Jawa Toko Mas)**, **Ismoyo (J5)**, dan opsi tambahan **ANTAM Logam Mulia**.

Dirancang sebagai **static site ringan siap deploy gratis ke Vercel (free tier)** — tanpa login wajib, tanpa OTP, dan tanpa database berbayar untuk tahap MVP.

---

## 1. Cara Edit Harga & Stok (Cukup di 1 File!)

Seluruh harga beli, harga buyback, jumlah stok, dan status (`Ready` / `Pre-order` / `Habis`) bersumber dari satu file:

- **`public/prices.json`** *(dibaca otomatis setiap website dibuka & auto-refresh tiap 5 menit)*
- Nilai fallback default juga ada di **`src/data/goldData.ts`**.

Contoh format item di `public/prices.json`:
```json
{
  "id": "semar-smg-1g",
  "brand": "Semar Nusantara",
  "produk": "SMG Press 24K (1 Gram)",
  "gram": 1,
  "hargaBeli": 2261000,
  "buyback": 2149000,
  "feeJastip": 20000,
  "stok": 5,
  "status": "Ready"
}
```
- Jika harga resmi suatu brand belum diisi, biarkan `"hargaBeli": null` dan `"buyback": null` → website otomatis menampilkan **`Tanya WA`** tanpa angka.
- Jika `"stok": 0` atau `"status": "Habis"`, tombol **Titip Beli** otomatis dinonaktifkan menjadi **Tanya WA / Pre-order** agar pelanggan tidak checkout barang habis.
- Perbarui field `"updatedAt"` setiap kali mengubah harga/stok agar jam update terbaru tampil di Hero, Panel Harga, dan Katalog.

---

## 2. Cara Edit Nomor WA, Google Maps & Log Order

Semua pengaturan penting dipusatkan di **`src/config.ts`**:
- `WA_NUMBER` & `WA_LINK` — nomor WhatsApp resmi NJ (`+62 856-4121-3142`)
- `MAPS_LINK` & `LOCATION_ADDRESS` — lokasi pengambilan Mbak Jannah (Sragen)
- `ORDER_LOG_URL` — kosong dulu untuk MVP. Nanti jika order sudah ramai dan ingin mencatat otomatis ke Google Sheets / webhook / database, cukup tempelkan URL endpoint di `ORDER_LOG_URL`.

> **Catatan Arsitektur MVP:** Sengaja tidak memakai database berbayar untuk MVP ini agar biaya operasional Rp 0 dan super cepat diakses dari IG Story / WhatsApp. Riwayat pesanan tetap tersimpan otomatis di browser pelanggan (`localStorage` key `nj_orders`) dan terkirim rapi langsung ke WhatsApp NJ. Database atau sinkronisasi Google Sheet baru perlu ditambahkan nanti ketika volume order sudah ramai.

---

## 3. Cara Deploy Gratis ke Vercel

### Opsi A — Via GitHub (Paling Mudah, Auto-Deploy Tiap Update Harga)
1. Push folder proyek ini ke repository GitHub kamu (bisa private repo).
2. Buka [vercel.com](https://vercel.com) → login gratis menggunakan akun GitHub.
3. Klik **Add New Project** → pilih repository proyek ini.
4. Vercel otomatis mendeteksi **Vite** (`Build Command: npm run build`, `Output Directory: dist` — sudah diatur di `vercel.json`).
5. Klik **Deploy** → dalam ±30 detik website langsung online dengan link `https://nama-project.vercel.app` (siap di-share ke IG Story & WA!).
6. Setiap kali kamu update `public/prices.json` lalu commit & push, Vercel otomatis memperbarui website dalam hitungan detik.

### Opsi B — Via Vercel CLI
```bash
npm install
npm run build
npx vercel --prod
```

---

## 4. Menjalankan Secara Lokal

```bash
npm install
npm run dev
```
Untuk verifikasi production build:
```bash
npm run build
```
