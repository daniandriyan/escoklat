/**
 * Select Component
 */
export default function Select({
  label,
  error,
  options = [],
  className = '',
  wrapperClassName = '',
  placeholder = 'Pilih...',
  ...props
}) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-coklat-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 rounded-xl border ${
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-coklat-200 focus:border-coklat-500'
        } focus:ring-2 outline-none transition-all duration-200 bg-white appearance-none cursor-pointer ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
