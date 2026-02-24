import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth functions
export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// User profile functions
export const getUserProfile = async (userId) => {
  return await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
};

// Product functions
export const getProducts = async (activeOnly = true) => {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  
  return await query;
};

export const getProductById = async (id) => {
  return await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
};

export const createProduct = async (product) => {
  return await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
};

export const updateProduct = async (id, product) => {
  return await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();
};

export const deleteProduct = async (id) => {
  return await supabase
    .from('products')
    .delete()
    .eq('id', id);
};

// Transaction functions
export const getTransactions = async (startDate = null, endDate = null) => {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      user_profiles (full_name, email)
    `)
    .order('created_at', { ascending: false });
  
  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    query = query.lte('created_at', endDate);
  }
  
  return await query;
};

export const getTransactionById = async (id) => {
  return await supabase
    .from('transactions')
    .select(`
      *,
      user_profiles (full_name, email),
      transaction_items (
        *,
        products (name, variant)
      )
    `)
    .eq('id', id)
    .single();
};

export const createTransaction = async (transaction, items) => {
  // Use RPC or direct insert with transaction_items
  const { data: transData, error: transError } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();
  
  if (transError) throw transError;
  
  // Insert transaction items
  const transactionItems = items.map(item => ({
    transaction_id: transData.id,
    product_id: item.product_id,
    qty: item.qty,
    price: item.price,
    subtotal: item.subtotal,
  }));
  
  const { data: itemsData, error: itemsError } = await supabase
    .from('transaction_items')
    .insert(transactionItems)
    .select();
  
  if (itemsError) throw itemsError;
  
  return { transaction: transData, items: itemsData };
};

// Dashboard stats functions
export const getTodayStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = today.toISOString();
  
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('total, created_at')
    .gte('created_at', startDate);
  
  if (error) throw error;
  
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  
  return {
    totalTransactions,
    totalRevenue,
    averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
  };
};

export const getBestSellingProducts = async (limit = 5) => {
  return await supabase
    .from('best_selling_products')
    .select('*')
    .limit(limit);
};

export const getDailySales = async (days = 7) => {
  const { data, error } = await supabase
    .from('daily_sales_summary')
    .select('*')
    .limit(days);
  
  if (error) throw error;
  return data;
};
