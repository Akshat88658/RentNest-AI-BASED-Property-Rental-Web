function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-container" id="loader">
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-spinner"></div>
        <div style={{
          position: 'absolute',
          fontSize: '1.25rem',
          animation: 'pulse 1.5s infinite ease-in-out',
          color: 'var(--color-primary)'
        }}>
          🏠
        </div>
      </div>
      <p>{text}</p>
    </div>
  );
}

export default Loader;
