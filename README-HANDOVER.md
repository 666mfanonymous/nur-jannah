# Panduan Operasional & Pengelolaan Website NJ (Handover untuk Kakak / Muse)

Panduan singkat ini dibuat khusus untuk Kakak / Muse agar bisa mengelola **harga harian, stok, dan data Member NJ** tanpa perlu menyentuh kode React maupun membayar database bulanan.

---

## 1. File Penting yang Perlu Diketahui

Hanya ada **3 file** yang perlu diedit sehari-hari:

1. **`public/prices.json`** → Tempat update harga harian & stok (`Ready` / `Pre-order` / `Habis`).
2. **`public/members.json`** → Tempat kelola seluruh **Member NJ** (daftar member aktif, tier `Member / Silver / Gold`, total gram, jumlah transaksi, poin, dan benefit tier).
3. **`src/config.ts`** → Pengaturan nomor WA resmi (`+62 856-4121-3142`), link Google Maps (`Mbak Jannah`), dan `ORDER_LOG_URL` (opsional nanti jika sudah memakai Google Sheet).

---

## 2. Cara Mengelola Member NJ (Tanpa Pegang Kode)

Buka file **`public/members.json`** (bisa langsung diedit dari GitHub web → klik ikon pensil → **Commit changes** → Vercel otomatis live dalam ±30 detik!).

### A. Cara Menyetujui Pendaftaran Member Baru
1. Pelanggan yang daftar lewat tombol **Daftar Member** akan mengirim pesan WA ke `+62 856-4121-3142`:
   ```
   Halo NJ, saya mau DAFTAR MEMBER:
   Nama: Ibu Rahmawati
   WA: 085612345678
   Alamat: Sragen
   Ref: NJ-MEMBER-DAFTAR-20261125-4821
   ```
2. Buka `public/members.json` → di bagian `"members": [ ... ]`, tambahkan data member baru dengan format:
   ```json
   {
     "id": "NJ-2026-4821",
     "nama": "Ibu Rahmawati",
     "wa": "6285612345678",
     "alamat": "Sragen",
     "tanggalBergabung": "2026-11-25",
     "tier": "Member",
     "totalGram": 0,
     "totalTransaksi": 0,
     "poin": 0,
     "status": "Aktif"
   }
   ```
   - **Member ID**: pakai format `NJ-2026-XXXX` (bisa ambil 4 angka terakhir dari kode `Ref` atau pilih 4 angka unik).
   - **No. WA**: wajib format internasional tanpa tanda `+` atau spasi (`628...`, contoh `6285612345678`).
   - **Status**: isi `"Aktif"`.
3. Simpan / Commit `public/members.json`.
4. Balas WA pelanggan: *"Selamat Ibu Rahmawati, pendaftaran Member NJ sudah aktif! Silakan buka website NJ → menu Member → klik **Cek Kartu Member Saya** lalu masukkan No. WA Ibu untuk melihat & download Kartu Member Digital."*

### B. Cara Update Total Gram, Total Transaksi & Poin Setelah Order Selesai
Setiap kali member menyelesaikan transaksi **beli atau jual emas**:
- Tambahkan berat gram ke `"totalGram"` (misal dari `0` menjadi `5`).
- Tambahkan `1` ke `"totalTransaksi"` (misal dari `0` menjadi `1`).
- Tambahkan poin ke `"poin"` dengan rumus: **`1 gram = 10 poin`** (misal beli 5 gram → tambah `50` poin).
- Jika member menukar **100 poin** untuk potongan fee Rp 15.000 (1× fee gratis), kurangi `"poin"` sebesar `100`.

### C. Cara Menaikkan Tier Member (`Member` → `Silver` → `Gold`)
Website otomatis membaca syarat naik tier dari `public/members.json`:
- **Silver**: otomatis aktif jika `"totalGram" >= 5` **ATAU** `"totalTransaksi" >= 3`.
- **Gold**: otomatis aktif jika `"totalGram" >= 15` **ATAU** `"totalTransaksi" >= 10`.
- Kakak juga bisa menaikkan tier secara manual kapan saja dengan mengubah `"tier": "Silver"` atau `"tier": "Gold"` di `public/members.json`.

### D. Cara Cek Keaslian Kartu Member Saat COD / Ambil di Rumah
1. Minta pelanggan menunjukkan **Kartu Member Digital** (atau file PNG/screenshot di HP-nya).
2. Scan **QR Code** di pojok kanan bawah kartu pakai kamera HP biasa → akan muncul teks **Member ID** (contoh `NJ-2026-4832`).
3. Cocokkan Member ID, Nama, dan 4 digit akhir WA dengan catatan Kakak di `public/members.json` (atau cek langsung melalui menu **Cek Kartu Member Saya** dengan memasukkan No. WA pelanggan).

### E. Cara Mengubah Benefit Tier atau Aturan Poin
Semua benefit tier (`Member`, `Silver`, `Gold`) dan rumus poin berada di bagian atas `public/members.json` (`"pointRules"` dan `"tiers"`). Cukup edit teks benefit atau angkanya di sana — tampilan halaman Member akan langsung ikut berubah otomatis.

---

## 3. PENTING Sebelum Launch ke Publik!

Di `public/members.json` saat ini terdapat **2 member contoh dummy** agar Kakak bisa mencoba melihat bentuk Kartu Member Silver & Gold:
- **Contoh Silver**: WA `081100001111` (`NJ-2026-4832`)
- **Contoh Gold**: WA `081100002222` (`NJ-2026-9104`)

> ⚠️ **Hapus 2 entri bertanda `"isContoh": true` tersebut di `public/members.json` sebelum link website dibagikan luas ke publik**, atau ganti langsung dengan data member asli pertama Kakak!
> *(Website publik tidak pernah menampilkan daftar member; pelanggan hanya bisa melihat kartunya sendiri jika mengetahui No. WA persisnya.)*

---

## 4. Pengingat Privasi & Deploy

- Jangan pernah mempublikasikan daftar lengkap No. WA / alamat member di media sosial.
- Setiap kali file `public/prices.json` atau `public/members.json` diubah lalu di-push ke GitHub, **Vercel** otomatis memperbarui website secara gratis dalam hitungan detik.
- Header `Cache-Control: no-cache` di `vercel.json` sudah diaktifkan sehingga perubahan harga, stok, dan data member langsung terbaca oleh pelanggan.
