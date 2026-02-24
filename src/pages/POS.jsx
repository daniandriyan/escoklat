import { useState, useEffect } from 'react';
import { Search, Coffee, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProducts, createTransaction } from '../services/supabase';
import { ProductCard, CartDrawer, Modal, Receipt, Button } from '../components';
import { hapticSuccess } from '../utils/helpers';

const variants = [
  'All',
  'Original',
  'Matcha',
  'Taro',
  'Strawberry',
  'Hazelnut',
  'Oreo',
  'Coklat Susu',
  'Coklat Keju',
  'Coklat Kacang',
  'White Coklat',
  'Coklat Mocha',
  'Coklat Caramel',
];

export default function POS() {
  const { user } = useAuth();
  const {
    cartItems,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [paid, setPaid] = useState(0);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [lastTransactionItems, setLastTransactionItems] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedVariant]);

  const loadProducts = async () => {
    try {
      const { data, error } = await getProducts(true);
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.variant.toLowerCase().includes(query)
      );
    }

    if (selectedVariant && selectedVariant !== 'All') {
      filtered = filtered.filter((p) => p.variant === selectedVariant);
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product) => {
    if (product.is_active) {
      addToCart(product);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || paid < cartTotal) return;

    setProcessing(true);

    try {
      const transaction = {
        total: cartTotal,
        paid: paid,
        change: paid - cartTotal,
        user_id: user?.id,
      };

      const items = cartItems.map((item) => ({
        product_id: item.product_id,
        qty: item.qty,
        price: item.price,
        subtotal: item.subtotal,
      }));

      const result = await createTransaction(transaction, items);
      
      setLastTransaction(result.transaction);
      setLastTransactionItems(result.items);
      setShowCheckoutModal(false);
      setShowReceiptModal(true);
      clearCart();
      setPaid(0);
      hapticSuccess();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Gagal menyimpan transaksi. Silakan coba lagi.');
    } finally {
      setProcessing(false);
    }
  };

  const change = paid - cartTotal;

  return (
    <div className="pb-24 lg:pb-6">
      {/* Search & Filter */}
      <div className="sticky top-0 z-20 glass-card-dark lg:glass-card mx-4 mt-4 rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glass w-full pl-12 pr-4 py-3"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          {variants.map((variant) => (
            <button
              key={variant}
              onClick={() => setSelectedVariant(variant)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                selectedVariant === variant
                  ? 'bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {variant}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-white/60">
              <Coffee className="w-12 h-12 mx-auto mb-3 animate-pulse" />
              <p>Memuat produk...</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-white/40">
            <Coffee className="w-16 h-16 mb-4 opacity-50" />
            <p>Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>

      {/* Cart Drawer (Mobile) / Cart Panel (Desktop) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onClear={clearCart}
        onCheckout={() => setShowCheckoutModal(true)}
        paid={paid}
        onPaidChange={setPaid}
      />

      {/* Floating Cart Button (Mobile) */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="lg:hidden fixed bottom-24 right-4 z-30 btn-glass-primary rounded-full p-4 shadow-2xl"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cartItems.reduce((sum, item) => sum + item.qty, 0)}
          </span>
        </button>
      )}

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => {
          setShowCheckoutModal(false);
          setPaid(0);
        }}
        title="Konfirmasi Pembayaran"
        size="md"
      >
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Total Belanja</span>
              <span className="font-semibold">{cartItems.length} item</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-cream-300 pt-2 border-t border-white/10">
              <span>Total Bayar</span>
              <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(cartTotal)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Uang Diterima
            </label>
            <input
              type="number"
              value={paid || ''}
              onChange={(e) => setPaid(parseInt(e.target.value) || 0)}
              placeholder="Masukkan jumlah uang"
              className="input-glass w-full text-lg font-semibold"
              autoFocus
            />
          </div>

          {paid > 0 && (
            <div className={`p-4 rounded-xl ${change >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <div className="flex justify-between">
                <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>
                  Kembalian
                </span>
                <span className={`font-bold text-lg ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(change))}
                  {change < 0 && ' (Kurang)'}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCheckoutModal(false);
                setPaid(0);
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="accent"
              onClick={handleCheckout}
              loading={processing}
              disabled={change < 0}
              className="flex-1"
            >
              Proses Bayar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false);
          setLastTransaction(null);
        }}
        title="Struk Transaksi"
        size="md"
      >
        {lastTransaction && (
          <Receipt
            transaction={lastTransaction}
            items={lastTransactionItems}
            onClose={() => {
              setShowReceiptModal(false);
              setLastTransaction(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
