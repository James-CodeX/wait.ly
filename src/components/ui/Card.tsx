import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick,
}: CardProps) {
  const Component = hover ? motion.div : 'div';
  const motionProps = hover
    ? {
        whileHover: { y: -4, boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.1), 0 4px 6px -2px rgba(5, 150, 105, 0.05)' },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={`${glass ? 'glass-mint' : 'bg-mint-50 dark:bg-dark-card'} rounded-2xl shadow-mint p-6 ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
