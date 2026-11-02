import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        margin: '40px 0 20px'
      }}
    >
      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '8px 12px' }}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: p === currentPage ? 'none' : '1px solid var(--border-medium)',
            backgroundColor:
              p === currentPage ? 'var(--primary-deep)' : 'var(--bg-surface)',
            color: p === currentPage ? '#fff' : 'var(--text-dark)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '8px 12px' }}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
