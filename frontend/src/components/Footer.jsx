export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-light text-center py-3 shadow-sm mt-5">
      <p className="mb-0">© {year} E-Learning. All rights reserved.</p>
    </footer>
  );
}
