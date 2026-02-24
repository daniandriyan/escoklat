/**
 * Premium Glass Card Component
 */
export default function Card({
  children,
  variant = 'default',
  className = '',
  padding = true,
  onClick,
  hover = true,
  ...props
}) {
  const variants = {
    default: 'glass-card',
    light: 'glass-card-light',
    dark: 'glass-card-dark',
  };

  return (
    <div
      className={`${variants[variant]} ${padding ? 'p-4' : ''} ${onClick ? 'cursor-pointer' : ''} ${hover ? 'hover:bg-white/15' : ''} transition-all duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
