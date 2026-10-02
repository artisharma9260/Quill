import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  function handleLogout() {
    logout();
    toast('Logged out successfully', 'success');
    navigate('/');
    setMenuOpen(false);
    setProfileOpen(false);
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-sans font-medium transition-colors ${
      isActive ? 'text-[#C41E3A]' : 'text-[#57534E] hover:text-[#1C1917]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E7E5E4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-[#C41E3A] font-serif text-2xl font-bold leading-none">Quill</span>
            <span className="hidden sm:block w-px h-5 bg-[#E7E5E4]" />
            <span className="hidden sm:block text-xs text-[#A8A29E] font-sans uppercase tracking-widest">Publishing</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/?category=Technology" className={navLinkClass}>Technology</NavLink>
            <NavLink to="/?category=Programming" className={navLinkClass}>Programming</NavLink>
            <NavLink to="/?category=AI" className={navLinkClass}>AI</NavLink>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/create">
                  <Button size="sm" variant="outline">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Write
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="sm" variant="ghost">Dashboard</Button>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#E7E5E4] hover:border-[#C41E3A] transition-colors"
                    />
                  </button>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-10 z-20 bg-white rounded-lg shadow-lg border border-[#E7E5E4] min-w-48 py-1">
                        <div className="px-4 py-2 border-b border-[#F5F5F4]">
                          <p className="text-sm font-medium text-[#1C1917] font-sans">{user?.name}</p>
                          <p className="text-xs text-[#A8A29E] font-sans truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1C1917] transition-colors font-sans"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/create"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1C1917] transition-colors font-sans"
                        >
                          New Post
                        </Link>
                        <div className="border-t border-[#F5F5F4] mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#C41E3A] hover:bg-red-50 transition-colors font-sans"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button size="sm" variant="ghost">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="primary">Get started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-[#57534E] hover:bg-[#F5F5F4]"
          >
            {menuOpen ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#E7E5E4] py-4 space-y-1">
            {isAuthenticated && (
              <div className="flex items-center gap-3 px-2 py-2 mb-3">
                <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-[#1C1917] font-sans">{user?.name}</p>
                  <p className="text-xs text-[#A8A29E] font-sans">{user?.email}</p>
                </div>
              </div>
            )}
            {[
              { to: '/', label: 'Home' },
              { to: '/dashboard', label: 'Dashboard', auth: true },
              { to: '/create', label: 'Write a Post', auth: true },
            ]
              .filter((item) => !item.auth || isAuthenticated)
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-2.5 text-sm font-sans text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4] rounded-md"
                >
                  {item.label}
                </Link>
              ))}
            <div className="pt-3 border-t border-[#E7E5E4] flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2.5 text-sm font-sans text-[#C41E3A] hover:bg-red-50 rounded-md"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign in</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full">Get started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
