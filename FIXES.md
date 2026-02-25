# ✅ Perbaikan SQL Schema - Selesai!

## 🔧 Masalah yang Diperbaiki

### Error Sebelumnya:
```
ERROR: 42P17: functions in index expression must be marked IMMUTABLE
```

### Penyebab:
- Fungsi `DATE(created_at)` dan `TIMEZONE('Asia/Jakarta', NOW())` tidak IMMUTABLE
- Tidak bisa digunakan langsung dalam index expression
- Trigger pada `auth.users` memerlukan penanganan khusus

## ✅ Yang Sudah Diperbaiki

### 1. Index Expressions
**Sebelum:**
```sql
CREATE INDEX idx_transactions_date ON transactions(DATE(created_at));
```

**Sesudah:**
```sql
CREATE INDEX idx_transactions_date ON transactions USING btree ((created_at::date));
```

### 2. Timestamp Defaults
**Sebelum:**
```sql
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('Asia/Jakarta', NOW())
```

**Sesudah:**
```sql
created_at TIMESTAMPTZ DEFAULT NOW()
```

### 3. Trigger Auth Users
**Sebelum:**
```sql
CREATE FUNCTION create_user_profile()
```

**Sesudah:**
```sql
CREATE FUNCTION public.handle_new_user()
-- Dengan ON CONFLICT handling
```

### 4. Views
**Sebelum:**
```sql
DATE(created_at) as sale_date
```

**Sesudah:**
```sql
created_at::date as sale_date
```

## 📁 File yang Diubah

| File | Status | Keterangan |
|------|--------|------------|
| `supabase-schema.sql` | ✅ Updated | Schema utama sudah diperbaiki |
| `supabase-schema-fixed.sql` | ✅ Created | Backup schema yang sudah fixed |
| `SETUP_SUPABASE.md` | ✅ Updated | Panduan setup lebih jelas |
| `README.md` | ✅ Updated | Instruksi setup lebih detail |

## 🚀 Cara Menggunakan

### Langkah Cepat:

1. **Buka Supabase Dashboard**
   - https://supabase.com/dashboard

2. **Buka SQL Editor**

3. **Copy & Paste** isi file `supabase-schema.sql`

4. **Klik Run**
   - Tunggu sampai muncul "Success"

5. **Verifikasi Tabel**
   - Buka Table Editor
   - Pastikan ada 4 tabel: `products`, `transactions`, `transaction_items`, `user_profiles`

6. **Buat User**
   - Authentication → Users → Add User
   - Email: `admin@escoklat.com`, Password: `admin123`

7. **Set Role Admin**
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE email = 'admin@escoklat.com';
   ```

8. **Update .env**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

9. **Deploy ke Vercel**
   - Push ke GitHub
   - Vercel akan auto-deploy
   - Jangan lupa set environment variables di Vercel!

## 📋 Checklist Verifikasi

Setelah menjalankan SQL, pastikan:

- [ ] ✅ Tidak ada error saat run SQL
- [ ] ✅ Ke-4 tabel terbuat
- [ ] ✅ 12 produk ada di tabel `products`
- [ ] ✅ Trigger `trg_generate_transaction_code` ada
- [ ] ✅ Trigger `on_auth_user_created` ada
- [ ] ✅ RLS policies aktif
- [ ] ✅ Views terbuat: `daily_sales_summary`, `best_selling_products`, dll

## 🆘 Troubleshooting

### Error: "relation already exists"
- Drop tabel dulu atau gunakan project baru
- Atau run: `DROP TABLE IF EXISTS transaction_items, transactions, user_profiles, products CASCADE;`

### Error: "trigger on_auth_user_created gagal"
- Ini normal jika Supabase sudah punya trigger serupa
- Skip trigger ini dan buat user profile manual

### Data produk kosong?
- Run ulang INSERT di bagian SEED DATA
- Atau insert manual via Table Editor

## 📞 Next Steps

Setelah database setup:

1. ✅ Test login di aplikasi
2. ✅ Test create transaction
3. ✅ Test receipt print
4. ✅ Deploy ke Vercel

---

**Dibuat:** 25 Februari 2026  
**Status:** ✅ Selesai & Siap Deploy
