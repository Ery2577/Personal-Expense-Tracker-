import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = "px-8 py-3 rounded-full text-base font-semibold cursor-pointer transition-all duration-300 min-w-[100px] hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";
  
  const variantStyles = {
    primary: {
      backgroundColor: '#2d3e1f',
      color: '#a8b876'
    },
    secondary: {
      backgroundColor: '#a8b876',
      color: '#2d3e1f'
    }
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`}
      style={variantStyles[variant]}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}