import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { formatRupiah } from '../utils/helpers';
import { hapticLight } from '../utils/helpers';
import Button from './Button';

/**
 * Cart Item Component
 */
function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate">{item.name}</h4>
        <p className="text-sm text-white/60">{item.variant}</p>
        <p className="text-sm font-semibold text-cream-300">{formatRupiah(item.price)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            hapticLight();
            onUpdateQty(item.product_id, item.qty - 1);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Minus className="w-4 h-4 text-white" />
        </button>
        
        <span className="w-8 text-center font-semibold text-white">{item.qty}</span>
        
        <button
          onClick={() => {
            hapticLight();
            onUpdateQty(item.product_id, item.qty + 1);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>
      
      <button
        onClick={() => {
          hapticLight();
          onRemove(item.product_id);
        }}
        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Slide-up Cart Drawer Component
 */
export default function CartDrawer({
  isOpen,
  onClose,
  items,
  total,
  onUpdateQty,
  onRemove,
  onClear,
  onCheckout,
  paid,
  onPaidChange,
}) {
  const isEmpty = items.length === 0;
  const change = paid - total;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:static lg:block transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
        }`}
      >
        <div className="glass-card-dark mx-4 mb-24 lg:mx-0 lg:mb-0 lg:h-full rounded-t-3xl lg:rounded-2xl overflow-hidden flex flex-col max-h-[85vh] lg:max-h-none">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cream-300" />
              <h2 className="font-semibold text-white text-lg">Keranjang</h2>
              {items.length > 0 && (
                <span className="bg-cream-500/20 text-cream-300 px-2 py-0.5 rounded-full text-xs font-medium">
                  {items.reduce((sum, item) => sum + item.qty, 0)} item
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isEmpty ? (
              <div className="h-40 flex flex-col items-center justify-center text-white/40">
                <ShoppingBag className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Keranjang kosong</p>
                <p className="text-xs">Tap produk untuk menambahkan</p>
              </div>
            ) : (
              items.map((item) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  onUpdateQty={onUpdateQty}
                  onRemove={onRemove}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {!isEmpty && (
            <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total</span>
                <span className="text-2xl font-bold text-cream-300">{formatRupiah(total)}</span>
              </div>

              {/* Input Uang Bayar */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Uang Bayar
                </label>
                <input
                  type="number"
                  value={paid || ''}
                  onChange={(e) => onPaidChange(parseInt(e.target.value) || 0)}
                  placeholder="Masukkan jumlah uang"
                  className="input-glass w-full text-lg font-semibold"
                />
              </div>

              {/* Kembalian */}
              {paid !== undefined && paid > 0 && (
                <div className={`p-3 rounded-xl ${change >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <div className="flex justify-between items-center">
                    <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>Kembalian</span>
                    <span className={`text-lg font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatRupiah(Math.abs(change))}
                      {change < 0 && ' (Kurang)'}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    hapticLight();
                    onClear();
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  variant="accent"
                  size="md"
                  onClick={onCheckout}
                  disabled={change < 0}
                  className="flex-1"
                >
                  Bayar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
