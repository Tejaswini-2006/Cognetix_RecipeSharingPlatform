import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, title, onConfirm, onCancel, isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(30, 27, 24, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '28px',
          backgroundColor: '#fff',
          boxShadow: 'var(--shadow-lg)',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
          Delete Recipe?
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            marginBottom: '24px',
            lineHeight: 1.5
          }}
        >
          Are you sure you want to delete <strong>"{title}"</strong>? This action
          cannot be undone and will permanently remove this recipe and its images.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Recipe'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DeleteModal;
