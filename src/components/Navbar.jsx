import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase
        .from('profile')
        .select('instagram_url')
        .single()

      if (data) {
        setProfile(data)
      }
    }

    fetchProfile()
  }, [])

  const links = [
    { to: '/gallery', label: 'Gallery' },
    { to: '/process', label: 'The Process' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F2EDE4] border-b border-[#E0D8CC]">
      <div className="w-full px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="font-serif italic text-xl text-ink tracking-tight"
        >
          Rosy Quilling Arts
        </Link>

        {/* Desktop Navigation */}
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

          {/* Instagram */}
          {profile?.instagram_url && (
            <a
              href={profile?.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#D8CFC2] bg-white hover:bg-[#F9F5F1] hover:border-[#C0796A] hover:text-[#C0796A] transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm4.25 4.25A5.25 5.25 0 1 1 6.75 11.5 5.25 5.25 0 0 1 12 6.25zm0 2A3.25 3.25 0 1 0 15.25 11.5 3.25 3.25 0 0 0 12 8.25zm5-3.1a1.15 1.15 0 1 1-1.15 1.15A1.15 1.15 0 0 1 17 5.15z" />
              </svg>

              <span className="text-xs tracking-widest uppercase">
                Instagram
              </span>
            </a>
          )}

        </div>

        {/* Mobile Hamburger */}
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

      {/* Mobile Menu */}
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

          {/* Instagram */}
          {profile?.instagram_url && (
            <a
              href={profile.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs tracking-widest uppercase font-sans text-[#888] hover:text-[#C13584] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4zm8.75 1a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 16.5 5zm-4.5 1.25A5.25 5.25 0 1 0 17.25 11.5A5.256 5.256 0 0 0 12 6.25zm0 2A3.25 3.25 0 1 1 8.75 11.5A3.254 3.254 0 0 1 12 8.25z" />
              </svg>

              Instagram
            </a>
          )}

        </div>
      )}
    </nav>
  )
}