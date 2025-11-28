import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  loading = false,
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  const baseStyles = `rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${sizeStyles[size]}`;

  const variants = {
    primary: "bg-mint-600 text-white hover:bg-mint-700 hover:shadow-lg hover:shadow-mint-600/20",
    secondary: "bg-white text-mint-900 border-2 border-mint-600 hover:bg-mint-50",
    ghost: "text-mint-900 hover:bg-mint-50"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
