import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '60px 20px'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          backgroundColor: 'var(--accent-peach)',
          color: 'var(--accent-orange)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        <ChefHat size={40} />
      </div>

      <h1 style={{ fontSize: '3.5rem', marginBottom: '8px' }}>404</h1>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
        Recipe Page Not Found
      </h2>
      <p
        style={{
          color: 'var(--text-muted)',
          maxWidth: '480px',
          marginBottom: '28px',
          fontSize: '1.05rem'
        }}
      >
        Oops! It looks like the recipe or page you're searching for has been moved
        or simmered away.
      </p>

      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={18} />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
