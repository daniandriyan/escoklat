# Setup Supabase untuk Es Coklat POS

## ⚠️ PENTING: Gunakan File SQL yang Sudah Diperbaiki

File `supabase-schema-fixed.sql` adalah versi yang sudah diperbaiki dan kompatibel dengan Supabase.

## Langkah 1: Setup Database di Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda (atau buat baru)
3. Buka **SQL Editor** (di sidebar kiri)
4. **Copy semua isi dari file `supabase-schema-fixed.sql`**
5. Paste di SQL Editor
6. Klik **Run** atau tekan Ctrl+Enter

✅ Jika berhasil, Anda akan melihat pesan "Success" dan semua tabel dibuat.

## Langkah 2: Verifikasi Tabel

Setelah menjalankan SQL, pastikan tabel-tabel berikut ada:

- [x] `products` - Data produk/minuman (12 varian)
- [x] `transactions` - Data transaksi
- [x] `transaction_items` - Detail item per transaksi
- [x] `user_profiles` - Profil user dan role

Cara cek:
1. Buka **Table Editor** di Supabase
2. Lihat apakah ke-4 tabel muncul

## Langkah 3: Buat User Admin & Kasir

### Opsi A: Melalui Supabase Dashboard

1. Buka **Authentication** → **Users**
2. Klik **Add User**
3. Buat 2 user:

**User Admin:**
- Email: `admin@escoklat.com`
- Password: `admin123`
- Auto Confirm User: ✓ (centang)

**User Kasir:**
- Email: `kasir@escoklat.com`
- Password: `kasir123`
- Auto Confirm User: ✓ (centang)

### Opsi B: Set Role Admin

Setelah user dibuat, jalankan SQL ini untuk set role admin:

```sql
UPDATE user_profiles SET role = 'admin' WHERE email = 'admin@escoklat.com';
UPDATE user_profiles SET role = 'kasir' WHERE email = 'kasir@escoklat.com';
```

## Langkah 4: Verifikasi Data Produk

Jalankan query ini untuk memastikan produk sudah ada:

```sql
SELECT * FROM products WHERE is_active = true;
```

Harusnya ada 12 varian Es Coklat.

## Langkah 5: Setup Environment Variables di Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Es Coklat POS Anda
3. Buka **Settings** → **Environment Variables**
4. Tambahkan 2 variables:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://cgjyxmqkxhkhehfqfkhq.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_OEWNWRWxdo1NEPJnVaDt-A_GywVNMB4` |

5. Klik **Save**
6. **Redeploy** project Anda (perlu deploy ulang agar environment variables terbaca)

## Langkah 6: Test Koneksi

Setelah deploy ulang:

1. Buka aplikasi Vercel URL Anda
2. Login dengan:
   - Email: `admin@escoklat.com`
   - Password: `admin123`
3. Jika berhasil login dan masuk dashboard = ✅ Berhasil!

## Troubleshooting

### Error: "Invalid API key"

- Pastikan `VITE_SUPABASE_ANON_KEY` benar di Vercel
- Check di Supabase Dashboard → **Settings** → **API**

### Error: "Relation does not exist"

- SQL schema belum dijalankan di Supabase
- Ulangi Langkah 1

### Error: "User not found" atau login gagal

- User belum dibuat di Supabase Auth
- Ulangi Langkah 3
- Pastikan user sudah di-verify/confirmed

### Data produk kosong

- Jalankan ulang INSERT di `supabase-schema.sql`
- Atau insert manual di Supabase Dashboard → **Table Editor** → `products`

### RLS Policy Error (Permission denied)

- Pastikan RLS policies sudah dibuat
- Check di Supabase: **Authentication** → **Policies**
- Harus ada policies untuk: `products`, `transactions`, `transaction_items`, `user_profiles`

## Link Penting

- [Supabase Dashboard](https://supabase.com/dashboard/project/cgjyxmqkxhkhehfqfkhq)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Dokumentasi Supabase](https://supabase.com/docs)
