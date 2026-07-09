export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      width: '100%',
    }}>
      <div style={{
        position: 'relative',
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
      }}>
        {/* Pulsing ring behind the logo */}
        <div style={{
          position: 'absolute',
          inset: -8,
          borderRadius: '50%',
          border: '2px solid var(--green-primary)',
          opacity: 0.5,
          animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        }} />
        
        {/* The Logo */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          padding: 4,
          position: 'relative',
          zIndex: 1,
          animation: 'pulse-glow 2s infinite ease-in-out',
        }}>
          <img src="/logo192.png" alt="Loading..." style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      
      <p style={{
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--green-primary)',
        fontSize: '0.875rem',
        letterSpacing: 2,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}>
        INITIALIZING_UPLINK...
      </p>

    </div>
  );
}
