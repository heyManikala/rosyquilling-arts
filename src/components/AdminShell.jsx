import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminShell({ children }) {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()

    async function handleSignOut() {
        await signOut()
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen bg-[#F2EDE4]">
            <header className="bg-[#F2EDE4] border-b border-[#E0D8CC] px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/admin" className="font-serif italic text-xl text-ink">
                        Rosy Quilling Arts
                    </Link>
                    <nav className="flex items-center gap-6">
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                `text-xs tracking-widest uppercase font-sans transition-colors ${isActive ? 'text-ink' : 'text-[#888] hover:text-ink'}`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/admin/artworks"
                            className={({ isActive }) =>
                                `text-xs tracking-widest uppercase font-sans transition-colors ${isActive ? 'text-ink' : 'text-[#888] hover:text-ink'}`
                            }
                        >
                            Artworks
                        </NavLink>
                        <NavLink
                            to="/admin/profile"
                            className={({ isActive }) =>
                                `text-xs tracking-widest uppercase font-sans transition-colors ${isActive ? 'text-ink' : 'text-[#888] hover:text-ink'}`
                            }
                        >
                            Profile
                        </NavLink>
                        <Link
                            to="/"
                            target="_blank"
                            className="text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink transition-colors"
                        >
                            View site ↗
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 bg-ink text-[#F2EDE4] text-xs tracking-widest uppercase font-sans hover:bg-[#333] transition-colors"
                        >
                            Sign out
                        </button>
                    </nav>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-6 py-10">
                {children}
            </main>
        </div>
    )
}