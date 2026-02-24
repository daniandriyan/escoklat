import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Button from './Button';
import { formatRupiah } from '../utils/helpers';

/**
 * Cart Item Component
 */
function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-coklat-50 rounded-xl">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-coklat-800 truncate">{item.name}</h4>
        <p className="text-sm text-coklat-500">{item.variant}</p>
        <p className="text-sm font-semibold text-coklat-700">{formatRupiah(item.price)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQty(item.product_id, item.qty - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-coklat-200 hover:bg-coklat-100 transition-colors"
        >
          <Minus className="w-3.5 h-3.5 text-coklat-600" />
        </button>
        
        <span className="w-8 text-center font-semibold text-coklat-800">{item.qty}</span>
        
        <button
          onClick={() => onUpdateQty(item.product_id, item.qty + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-coklat-200 hover:bg-coklat-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-coklat-600" />
        </button>
      </div>
      
      <button
        onClick={() => onRemove(item.product_id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Cart Component untuk POS Sidebar
 */
export default function Cart({
  items,
  total,
  onUpdateQty,
  onRemove,
  onClear,
  onCheckout,
  paid,
  onPaidChange,
  change,
}) {
  const isEmpty = items.length === 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-coklat-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-coklat-100 bg-gradient-to-r from-coklat-700 to-coklat-800">
        <div className="flex items-center gap-2 text-white">
          <ShoppingBag className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Keranjang</h2>
          {items.length > 0 && (
            <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">
              {items.reduce((sum, item) => sum + item.qty, 0)} item
            </span>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-coklat-400">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center">Keranjang kosong</p>
            <p className="text-sm text-center">Klik produk untuk menambahkan</p>
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
        <div className="p-4 border-t border-coklat-100 bg-coklat-50 space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-coklat-600">Total</span>
            <span className="text-xl font-bold text-coklat-800">{formatRupiah(total)}</span>
          </div>

          {/* Input Uang Bayar */}
          <div>
            <label className="block text-sm font-medium text-coklat-700 mb-1.5">
              Uang Bayar
            </label>
            <input
              type="number"
              value={paid || ''}
              onChange={(e) => onPaidChange(parseInt(e.target.value) || 0)}
              placeholder="Masukkan jumlah uang"
              className="w-full px-4 py-2.5 rounded-xl border border-coklat-200 focus:border-coklat-500 focus:ring-2 focus:ring-coklat-200 outline-none transition-all"
            />
          </div>

          {/* Kembalian */}
          {paid !== undefined && paid > 0 && (
            <div className={`flex justify-between items-center p-3 rounded-xl ${change >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>Kembalian</span>
              <span className={`text-lg font-bold ${change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatRupiah(Math.abs(change))}
                {change < 0 && ' (Kurang)'}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
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
  );
}
