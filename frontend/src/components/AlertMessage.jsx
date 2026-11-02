import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const AlertMessage = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: {
      bg: '#FEE2E2',
      border: '#EF4444',
      text: '#991B1B',
      icon: <AlertCircle size={20} color="#DC2626" />
    },
    success: {
      bg: '#DCFCE7',
      border: '#22C55E',
      text: '#166534',
      icon: <CheckCircle2 size={20} color="#16A34A" />
    },
    info: {
      bg: '#E0F2FE',
      border: '#38BDF8',
      text: '#075985',
      icon: <Info size={20} color="#0284C7" />
    }
  };

  const current = styles[type] || styles.error;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: current.bg,
        border: `1px solid ${current.border}`,
        color: current.text,
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '20px',
        fontSize: '0.95rem',
        gap: '12px',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {current.icon}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: current.text,
            padding: '2px'
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
