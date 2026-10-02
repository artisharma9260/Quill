import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[#E7E5E4] bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#C41E3A] font-serif text-xl font-bold">Quill</span>
            <span className="text-xs text-[#A8A29E] font-sans">Publishing Platform</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {[
              { to: '/', label: 'Home' },
              { to: '/login', label: 'Sign In' },
              { to: '/register', label: 'Register' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-[#78716C] hover:text-[#1C1917] font-sans transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-[#A8A29E] font-sans">
            © {new Date().getFullYear()} Quill Publishing
          </p>
        </div>
      </div>
    </footer>
  );
}
