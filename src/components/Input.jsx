/**
 * Premium Glass Input Component
 */
export default function Input({
  label,
  error,
  type = 'text',
  className = '',
  wrapperClassName = '',
  icon: Icon,
  ...props
}) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          className={`input-glass w-full ${Icon ? 'pl-11' : ''} ${className}`}
          {...props}
        />
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="w-5 h-5 text-white/50" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
