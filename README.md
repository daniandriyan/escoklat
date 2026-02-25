# Es Coklat POS - Premium

Aplikasi web POS (Point of Sale) **PREMIUM** dengan Glassmorphism UI untuk UMKM minuman "Es Coklat Varian Rasa".

## ✨ Features

### 🎨 Premium Glassmorphism UI
- Backdrop blur effects
- Soft shadows & smooth animations
- Gradient backgrounds
- Modern, clean, elegant design

### 📱 Mobile-First Design
- Bottom navigation untuk mobile
- One-hand operation
- Slide-up cart drawer
- Touch-friendly buttons
- Haptic feedback

### 🧾 Core POS Features
- Product grid dengan varian warna
- Real-time cart calculation
- Quick checkout
- Thermal printer friendly receipt
- PDF download option

### 📊 Dashboard Analytics
- Today's sales stats
- Transaction count
- Revenue charts
- Best selling products

### 🔐 Role-Based Access
- Admin (full access)
- Kasir (transaction only)
- Secure authentication

## 🚀 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS (Glassmorphism) |
| Backend | Supabase (PostgreSQL + Auth) |
| State | React Context + Hooks |
| Icons | Lucide React |
| Charts | Recharts |
| Hosting | Vercel |

## 🎨 Design System

### Colors
```
Primary:   #4E342E (Chocolate Brown)
Secondary: #8D6E63 (Milk Chocolate)
Accent:    #FFF3E0 (Cream)
Text:      White & Soft Gray
```

### Effects
- Glassmorphism: `bg-white/10 backdrop-blur-xl`
- Cards: `border border-white/20 rounded-2xl shadow-xl`
- Buttons: Gradient with hover effects

### Typography
- Font: Poppins / Inter
- Weights: 300, 400, 500, 600, 700

## 📁 Project Structure

```
src/
├── components/
│   ├── Button.jsx          # Glass button variants
│   ├── Card.jsx            # Glass card component
│   ├── Modal.jsx           # Glass modal
│   ├── Input.jsx           # Glass input
│   ├── BottomNavbar.jsx    # Mobile bottom nav
│   ├── CartDrawer.jsx      # Slide-up cart
│   ├── Receipt.jsx         # Thermal receipt
│   ├── ProductCard.jsx     # Product card
│   ├── Sidebar.jsx         # Desktop sidebar
│   ├── Header.jsx          # Page header
│   ├── Layout.jsx          # Main layout
│   └── index.js
├── context/
│   ├── AuthContext.jsx     # Authentication
│   └── CartContext.jsx     # Shopping cart
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Dashboard.jsx       # Analytics dashboard
│   ├── POS.jsx             # Point of Sale
│   ├── Transactions.jsx    # Transaction history
│   └── Products.jsx        # Product management
├── services/
│   └── supabase.js         # Supabase client
├── utils/
│   └── helpers.js          # Utilities (haptic, format)
├── App.jsx
├── main.jsx
└── index.css               # Global styles
```

## 🛠️ Setup Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase Database

**⚠️ PENTING:** Gunakan file `supabase-schema.sql` yang sudah diperbaiki.

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru atau pilih yang sudah ada
3. Buka **SQL Editor**
4. Copy semua isi dari file `supabase-schema.sql`
5. Paste dan klik **Run**
6. ✅ Pastikan semua tabel berhasil dibuat

### 3. Create Users

1. Buka **Authentication** → **Users**
2. Klik **Add User**
3. Buat 2 user:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@escoklat.com | admin123 |
| Kasir | kasir@escoklat.com | kasir123 |

4. Set role admin dengan SQL:
```sql
UPDATE user_profiles SET role = 'admin' WHERE email = 'admin@escoklat.com';
```

### 4. Get Supabase Credentials

1. Buka **Settings** → **API**
2. Copy:
   - **Project URL**
   - **anon public** key

### 5. Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Run Development

```bash
npm run dev
```

Open `http://localhost:5173`

### 7. Build for Production

```bash
npm run build
```

## 🗄️ Database Schema

### Tables

**products**
- `id` (UUID) - Primary key
- `name` - Product name
- `variant` - Flavor variant
- `price` - Price (IDR)
- `is_active` - Availability status

**transactions**
- `id` (UUID) - Primary key
- `transaction_code` - Auto-generated code
- `total` - Total amount
- `paid` - Amount received
- `change` - Change amount
- `user_id` - Cashier ID

**transaction_items**
- `id` (UUID) - Primary key
- `transaction_id` - FK to transactions
- `product_id` - FK to products
- `qty` - Quantity
- `price` - Unit price
- `subtotal` - Line total

**user_profiles**
- `id` (UUID) - FK to auth.users
- `email` - User email
- `full_name` - Display name
- `role` - admin/kasir

## 📱 Default Login

After setting up database:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@escoklat.com | admin123 |
| Kasir | kasir@escoklat.com | kasir123 |

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## 📄 Receipt Format

Thermal printer optimized (58mm):

```
================================
    ES COKLAT VARIAN RASA
================================

Tanggal: 24 Februari 2024 14:30
No: TRX-20240224-0001

--------------------------------
Menu        Qty   Harga
--------------------------------
Coklat Ori   2   12.000
Matcha      1   15.000
--------------------------------
TOTAL           39.000
BAYAR           50.000
KEMBALI         11.000
================================
    Terima Kasih! ❤️
================================
```

## 🎯 Quality Standards

- ✅ Clean, modular code
- ✅ Reusable components
- ✅ Fast UX for cashiers
- ✅ Mobile-first responsive
- ✅ Production-ready
- ✅ Haptic feedback
- ✅ No page reloads
- ✅ Auto-reset after transaction

## 📝 License

MIT License - Free for commercial use

---

**Es Coklat Varian Rasa** © 2024
*Premium POS System*
# escoklat
