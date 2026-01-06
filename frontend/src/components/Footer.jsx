export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #ddd',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        fontSize: '0.95rem',
        color: '#444',
        width: '100%',
        marginTop: '3rem',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <p style={{ margin: 0, color: '#555' }}>
        © {year} E-Learning Platform. All rights reserved.
      </p>
    </footer>
  );
}
