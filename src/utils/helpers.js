/**
 * Haptic Feedback Utility
 * Memberikan getaran ringan untuk UX yang lebih baik
 */

/**
 * Trigger haptic feedback (vibration)
 * @param {number} pattern - Pattern getaran (ms)
 */
export const haptic = (pattern = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

/**
 * Light tap feedback
 */
export const hapticLight = () => {
  haptic(10);
};

/**
 * Medium tap feedback
 */
export const hapticMedium = () => {
  haptic(20);
};

/**
 * Heavy tap feedback
 */
export const hapticHeavy = () => {
  haptic(30);
};

/**
 * Success feedback
 */
export const hapticSuccess = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([10, 20, 10]);
  }
};

/**
 * Error feedback
 */
export const hapticError = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([30, 20, 30]);
  }
};

/**
 * Format angka ke format Rupiah
 */
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

/**
 * Format tanggal ke format Indonesia
 */
export const formatDate = (dateString, formatStr = 'dd MMMM yyyy') => {
  const date = new Date(dateString);
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    ...formatStr === 'dd MMM yyyy' ? { month: 'short' } : {}
  };
  return date.toLocaleDateString('id-ID', options);
};

/**
 * Format tanggal waktu ke format Indonesia
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format waktu (HH:mm)
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Generate ID unik
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Sleep utility
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
