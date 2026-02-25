-- ============================================
-- SUPABASE SCHEMA - ES COKLAT POS (PREMIUM)
-- FIXED VERSION - Compatible with Supabase
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABEL: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    variant VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk products
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_variant ON products(variant);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============================================
-- TABEL: transactions
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_code VARCHAR(50) UNIQUE NOT NULL,
    total INTEGER NOT NULL CHECK (total >= 0),
    paid INTEGER NOT NULL CHECK (paid >= 0),
    change INTEGER NOT NULL CHECK (change >= 0),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk transactions
CREATE INDEX IF NOT EXISTS idx_transactions_code ON transactions(transaction_code);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- ============================================
-- TABEL: transaction_items
-- ============================================
CREATE TABLE IF NOT EXISTS transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    price INTEGER NOT NULL CHECK (price >= 0),
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk transaction_items
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_product_id ON transaction_items(product_id);

-- ============================================
-- TABEL: user_profiles (untuk role management)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'kasir' CHECK (role IN ('admin', 'kasir')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- ============================================
-- FUNCTION: Generate transaction code
-- ============================================
CREATE OR REPLACE FUNCTION generate_transaction_code()
RETURNS TRIGGER AS $$
DECLARE
    code VARCHAR(50);
    date_part VARCHAR(8);
    seq INTEGER;
BEGIN
    -- Format: TRX-YYYYMMDD-XXXX
    date_part := TO_CHAR(NEW.created_at, 'YYYYMMDD');

    -- Get sequence number for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(transaction_code FROM 13) AS INTEGER)), 0) + 1
    INTO seq
    FROM transactions
    WHERE transaction_code LIKE 'TRX-' || date_part || '-%';

    -- Generate code with zero-padded sequence
    code := 'TRX-' || date_part || '-' || LPAD(seq::TEXT, 4, '0');

    NEW.transaction_code := code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-generate transaction code
DROP TRIGGER IF EXISTS trg_generate_transaction_code ON transactions;
CREATE TRIGGER trg_generate_transaction_code
    BEFORE INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION generate_transaction_code();

-- ============================================
-- FUNCTION: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk products
DROP TRIGGER IF EXISTS trg_update_products_updated_at ON products;
CREATE TRIGGER trg_update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk user_profiles
DROP TRIGGER IF EXISTS trg_update_profiles_updated_at ON user_profiles;
CREATE TRIGGER trg_update_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'kasir')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger untuk create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS untuk semua tabel
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: products
-- ============================================
DROP POLICY IF EXISTS "Users can view active products" ON products;
CREATE POLICY "Users can view active products" ON products
    FOR SELECT
    USING (is_active = true AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- ============================================
-- POLICIES: transactions
-- ============================================
DROP POLICY IF EXISTS "Users can view transactions" ON transactions;
CREATE POLICY "Users can view transactions" ON transactions
    FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can create transactions" ON transactions;
CREATE POLICY "Users can create transactions" ON transactions
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete transactions" ON transactions;
CREATE POLICY "Admins can delete transactions" ON transactions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- ============================================
-- POLICIES: transaction_items
-- ============================================
DROP POLICY IF EXISTS "Users can view transaction items" ON transaction_items;
CREATE POLICY "Users can view transaction items" ON transaction_items
    FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can create transaction items" ON transaction_items;
CREATE POLICY "Users can create transaction items" ON transaction_items
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- POLICIES: user_profiles
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid()
            AND up.role = 'admin'
        )
    );

-- ============================================
-- SEED DATA: Sample Products (12 Varian)
-- ============================================
INSERT INTO products (name, variant, price, is_active) VALUES
    ('Es Coklat', 'Original', 12000, true),
    ('Es Coklat', 'Matcha', 15000, true),
    ('Es Coklat', 'Taro', 15000, true),
    ('Es Coklat', 'Strawberry', 15000, true),
    ('Es Coklat', 'Hazelnut', 15000, true),
    ('Es Coklat', 'Oreo', 16000, true),
    ('Es Coklat', 'Coklat Susu', 13000, true),
    ('Es Coklat', 'Coklat Keju', 16000, true),
    ('Es Coklat', 'Coklat Kacang', 16000, true),
    ('Es Coklat', 'White Coklat', 15000, true),
    ('Es Coklat', 'Coklat Mocha', 15000, true),
    ('Es Coklat', 'Coklat Caramel', 16000, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VIEW: Daily Sales Summary
-- ============================================
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT
    created_at::date as sale_date,
    COUNT(*) as total_transactions,
    SUM(total) as total_revenue,
    AVG(total) as average_transaction
FROM transactions
GROUP BY created_at::date
ORDER BY sale_date DESC;

-- ============================================
-- VIEW: Best Selling Products
-- ============================================
CREATE OR REPLACE VIEW best_selling_products AS
SELECT
    p.id,
    p.name,
    p.variant,
    COALESCE(SUM(ti.qty), 0) as total_sold,
    COALESCE(SUM(ti.subtotal), 0) as total_revenue
FROM products p
LEFT JOIN transaction_items ti ON p.id = ti.product_id
GROUP BY p.id, p.name, p.variant
ORDER BY total_sold DESC;

-- ============================================
-- VIEW: Transaction Details
-- ============================================
CREATE OR REPLACE VIEW transaction_details AS
SELECT
    t.id as transaction_id,
    t.transaction_code,
    t.total,
    t.paid,
    t.change,
    t.created_at,
    up.full_name as cashier_name,
    ti.product_id,
    p.name as product_name,
    p.variant as product_variant,
    ti.qty,
    ti.price,
    ti.subtotal
FROM transactions t
LEFT JOIN user_profiles up ON t.user_id = up.id
LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
LEFT JOIN products p ON ti.product_id = p.id
ORDER BY t.created_at DESC;

-- ============================================
-- VIEW: Monthly Revenue Summary
-- ============================================
CREATE OR REPLACE VIEW monthly_revenue_summary AS
SELECT
    TO_CHAR(created_at, 'YYYY-MM') as month,
    COUNT(*) as total_transactions,
    SUM(total) as total_revenue,
    AVG(total) as average_transaction
FROM transactions
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month DESC;

-- ============================================
-- NOTES
-- ============================================
-- 1. Create users via Supabase Auth UI
-- 2. Update admin role: 
--    UPDATE user_profiles SET role = 'admin' WHERE email = 'admin@escoklat.com';
-- 3. Default credentials:
--    Admin: admin@escoklat.com / admin123
--    Kasir: kasir@escoklat.com / kasir123

