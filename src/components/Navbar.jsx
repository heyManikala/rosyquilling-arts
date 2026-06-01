import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/gallery', label: 'Gallery' },
    { to: '/process', label: 'The Process' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F2EDE4] border-b border-[#E0D8CC]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-serif italic text-xl text-ink tracking-tight">
          Rosy Quilling Arts
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs tracking-widest uppercase font-sans transition-colors ${location.pathname === link.to
                  ? 'text-ink'
                  : 'text-[#888] hover:text-ink'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-ink transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F2EDE4] border-t border-[#E0D8CC] px-6 py-4 flex flex-col gap-4">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}