import { Coffee } from 'lucide-react';
import { hapticLight } from '../utils/helpers';

/**
 * Premium Glass Product Card
 */
export default function ProductCard({ product, onClick }) {
  const flavorColors = {
    Original: 'from-chocolate-600 to-chocolate-800',
    Matcha: 'from-green-600 to-green-800',
    Taro: 'from-purple-600 to-purple-800',
    Strawberry: 'from-pink-500 to-pink-700',
    Hazelnut: 'from-amber-700 to-amber-900',
    Oreo: 'from-gray-700 to-gray-900',
    'Coklat Susu': 'from-cream-500 to-cream-700',
    'Coklat Keju': 'from-yellow-500 to-yellow-700',
    'Coklat Kacang': 'from-orange-600 to-orange-800',
    'White Coklat': 'from-cream-300 to-cream-500',
    'Coklat Mocha': 'from-chocolate-700 to-chocolate-900',
    'Coklat Caramel': 'from-amber-600 to-amber-800',
  };

  const gradientClass = flavorColors[product.variant] || 'from-chocolate-600 to-chocolate-800';

  const handleClick = () => {
    if (product.is_active) {
      hapticLight();
      onClick(product);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`product-card relative overflow-hidden group ${
        !product.is_active ? 'opacity-50 grayscale' : ''
      }`}
    >
      {/* Gradient Background */}
      <div className={`h-28 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-3 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Coffee className="w-12 h-12 text-white/90 relative z-10" />
      </div>
      
      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-white">{product.name}</h3>
        <p className="text-sm text-white/60">{product.variant}</p>
        <p className="font-bold text-cream-300">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(product.price)}
        </p>
      </div>

      {/* Inactive Badge */}
      {!product.is_active && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <span className="bg-red-500/80 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
            Habis
          </span>
        </div>
      )}
    </div>
  );
}
