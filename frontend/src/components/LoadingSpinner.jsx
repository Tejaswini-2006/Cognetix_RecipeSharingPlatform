import React from 'react';
import { ChefHat } from 'lucide-react';

const LoadingSpinner = ({ message = 'Simmering delicious recipes...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      gap: '16px',
      color: 'var(--primary-medium)'
    }}>
      <div style={{
        animation: 'spin 1.5s linear infinite',
        color: 'var(--accent-orange)'
      }}>
        <ChefHat size={44} />
      </div>
      <p style={{
        fontWeight: '600',
        color: 'var(--text-muted)',
        fontSize: '1rem'
      }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
