import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
    { to: '/admin', label: 'Dashboard', exact: true },
    { to: '/admin/artworks', label: 'Artworks' },
    { to: '/admin/profile', label: 'Profile' },
]

export default function AdminShell({ children }) {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()

    async function handleSignOut() {
        await signOut()
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#F2EDE4]">
            {/* Sidebar */}
            <aside className="w-full md:w-56 bg-[#1A1A1A] flex flex-col">
                <div className="p-6 border-b border-[#333]">
                    <p className="font-serif italic text-white text-lg">Rosy Quilling</p>
                    <p className="text-xs text-[#666] mt-1 truncate">{user?.email}</p>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-1">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            className={({ isActive }) =>
                                `px-4 py-2.5 text-xs tracking-widest uppercase font-sans transition-colors ${isActive
                                    ? 'bg-[#333] text-white'
                                    : 'text-[#888] hover:text-white'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#333]">
                    <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2.5 text-xs tracking-widest uppercase font-sans text-[#888] hover:text-white transition-colors text-left"
                    >
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}