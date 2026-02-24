import { Loader2 } from 'lucide-react';

/**
 * Loading Spinner Component
 */
export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-cream-300`} />
    </div>
  );
}

/**
 * Full Page Loading Component
 */
export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-chocolate-500 to-chocolate-700 rounded-3xl shadow-2xl mb-4">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
        <p className="text-white/80 font-medium">Memuat...</p>
      </div>
    </div>
  );
}
