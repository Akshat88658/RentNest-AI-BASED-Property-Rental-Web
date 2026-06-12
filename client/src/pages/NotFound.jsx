import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div
      id="not-found-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      {/* Floating orbs background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '8%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />

      {/* 404 Giant Number */}
      <div
        style={{
          fontSize: 'clamp(6rem, 20vw, 14rem)',
          fontWeight: '900',
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent), var(--color-primary))',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 4s ease infinite, slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          opacity: 0,
          marginBottom: '0.5rem',
          letterSpacing: '-0.04em',
        }}
      >
        404
      </div>

      {/* Emoji */}
      <div
        style={{
          fontSize: '3rem',
          marginBottom: '1.5rem',
          animation: 'float 4s ease-in-out infinite',
          display: 'inline-block',
        }}
      >
        🏚️
      </div>

      {/* Heading */}
      <h1
        className="text-heading-2"
        style={{
          marginBottom: '1rem',
          animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
          opacity: 0,
        }}
      >
        Page Not Found
      </h1>

      {/* Subtext */}
      <p
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '1.1rem',
          maxWidth: '420px',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
          animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both',
          opacity: 0,
        }}
      >
        Looks like this property moved out without leaving a forwarding address. Let&rsquo;s get you back home.
      </p>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both',
          opacity: 0,
        }}
      >
        <Link to="/" className="btn btn-primary btn-lg">
          🏠 Go Home
        </Link>
        <Link to="/properties" className="btn btn-outline btn-lg">
          Browse Listings
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
