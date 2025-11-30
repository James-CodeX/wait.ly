import { motion } from 'framer-motion';
import { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-mint-600 dark:text-mint-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text placeholder-mint-900/40 dark:placeholder-dark-text-muted focus:outline-none focus:border-mint-600 dark:focus:border-mint-500 focus:ring-4 focus:ring-mint-600/10 dark:focus:ring-mint-500/20 transition-all duration-200 ${error ? 'border-red-500' : ''} ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {label && (
          <motion.label
            initial={false}
            animate={{
              top: isFocused || props.value ? '-8px' : '50%',
              fontSize: isFocused || props.value ? '0.75rem' : '1rem',
              backgroundColor: isFocused || props.value ? 'white' : 'transparent',
            }}
            className={`absolute ${icon ? 'left-10' : 'left-4'} px-2 pointer-events-none text-mint-900/70 dark:text-dark-text-muted transition-all duration-200 -translate-y-1/2`}
          >
            {label}
          </motion.label>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
