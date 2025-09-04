import { useEffect, useState } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose, 
  duration = 4000 
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = {
      backgroundColor: '',
      borderColor: '',
      color: '#2d3e1f'
    };

    switch (type) {
      case 'success':
        baseStyles.backgroundColor = '#a8b876';
        baseStyles.borderColor = '#9aab6b';
        break;
      case 'error':
        baseStyles.backgroundColor = '#ff6b6b';
        baseStyles.borderColor = '#ff5252';
        baseStyles.color = '#ffffff';
        break;
      case 'warning':
        baseStyles.backgroundColor = '#ffa726';
        baseStyles.borderColor = '#ff9800';
        baseStyles.color = '#2d3e1f';
        break;
      case 'info':
        baseStyles.backgroundColor = '#42a5f5';
        baseStyles.borderColor = '#2196f3';
        baseStyles.color = '#ffffff';
        break;
      default:
        baseStyles.backgroundColor = '#a8b876';
        baseStyles.borderColor = '#9aab6b';
    }

    return baseStyles;
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  const styles = getToastStyles();

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-[400px]
          transition-all duration-300 ease-in-out transform
          ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          hover:shadow-xl hover:-translate-y-1
        `}
        style={{
          backgroundColor: styles.backgroundColor,
          borderLeftColor: styles.borderColor,
          color: styles.color,
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Icône */}
        <div className="flex-shrink-0 text-xl font-bold">
          {getIcon()}
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-lg font-bold opacity-70 hover:opacity-100 transition-opacity duration-200 ml-2"
          aria-label="Fermer la notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
