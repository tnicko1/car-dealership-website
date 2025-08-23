'use client';

type AnimatedHamburgerIconProps = {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
};

export default function AnimatedHamburgerIcon({ isOpen, onClick, className = '' }: AnimatedHamburgerIconProps) {
  const lineBaseClasses = "h-0.5 w-6 bg-current transition-all duration-300 ease-in-out";

  return (
    <button
      onClick={onClick}
      className={`relative z-50 h-12 w-12 flex flex-col justify-center items-center focus:outline-none ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className={`${lineBaseClasses} ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
      <div className={`${lineBaseClasses} my-1 ${isOpen ? 'opacity-0' : ''}`} />
      <div className={`${lineBaseClasses} ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
    </button>
  );
}
