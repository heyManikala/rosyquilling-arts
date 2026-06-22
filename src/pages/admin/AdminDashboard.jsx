import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import AdminShell from '../../components/AdminShell'

export default function AdminDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({ total: 0, featured: 0 })
    const [profile, setProfile] = useState(null)
    const [recentArtworks, setRecentArtworks] = useState([])

    useEffect(() => {
        async function fetchData() {
            const { data: artworkData } = await supabase
                .from('artworks')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4)

            const { data: allArtworks } = await supabase
                .from('artworks')
                .select('id, featured')

            const { data: profileData } = await supabase
                .from('profile')
                .select('*')
                .single()

            if (artworkData) setRecentArtworks(artworkData)
            if (allArtworks) {
                setStats({
                    total: allArtworks.length,
                    featured: allArtworks.filter(a => a.featured).length,
                })
            }
            if (profileData) setProfile(profileData)
        }
        fetchData()
    }, [])

    const profileComplete = profile?.name && profile?.bio && profile?.email

    return (
        <AdminShell>
            <p className="text-xs tracking-widest uppercase text-[#AAA] mb-1">
                The Workshop · Dashboard
            </p>
            <h1 className="font-serif text-5xl text-ink mb-1">Studio control</h1>
            <p className="text-sm text-[#888] mb-10">
                Signed in as <span className="text-ink font-medium">{user?.email}</span>
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-ink text-white p-6">
                    <p className="text-xs tracking-widest uppercase text-[#888] mb-3">Total works</p>
                    <div className="w-4 h-px bg-[#C0796A] mb-3" />
                    <p className="font-serif italic text-5xl">{stats.total}</p>
                </div>
                <div className="bg-white border border-[#E0D8CC] p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <p className="text-xs tracking-widest uppercase text-[#888]">Featured</p>
                    </div>
                    <div className="w-4 h-px bg-[#C0796A] mb-3" />
                    <p className="font-serif italic text-5xl text-ink">{stats.featured}</p>
                </div>
                <div className="bg-white border border-[#E0D8CC] p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${profileComplete ? 'bg-teal-500' : 'bg-[#DDD]'}`} />
                        <p className="text-xs tracking-widest uppercase text-[#888]">Profile</p>
                    </div>
                    <div className="w-4 h-px bg-[#C0796A] mb-3" />
                    <p className="font-serif italic text-2xl text-ink">
                        {profileComplete ? 'Complete' : 'Incomplete'}
                    </p>
                </div>
                <div className="bg-white border border-[#E0D8CC] p-6">
                    <p className="text-xs tracking-widest uppercase text-[#888] mb-3">Quick add</p>
                    <p className="font-serif italic text-lg text-ink mb-3">New artwork</p>
                    <Link
                        to="/admin/artworks"
                        className="inline-block bg-[#C0796A] text-white text-xs tracking-widest uppercase px-4 py-2 hover:bg-[#A86358] transition-colors"
                    >
                        + Add piece
                    </Link>
                </div>
            </div>

            {/* Workshop banner */}
            <div className="bg-[#EAE4DB] border border-[#D8D0C4] p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <p className="text-xs tracking-widest uppercase text-[#AAA] mb-2">Workshop</p>
                    <h2 className="font-serif italic text-3xl text-ink mb-2">
                        Ready to showcase your latest work?
                    </h2>
                    <p className="text-sm text-[#888]">
                        Upload an image, add dimensions, and set it live on the gallery.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <Link
                        to="/admin/profile"
                        className="px-5 py-2.5 border border-[#D0C8BC] text-xs tracking-widest uppercase font-sans text-[#888] hover:border-ink hover:text-ink transition-all"
                    >
                        Edit profile
                    </Link>
                    <Link
                        to="/admin/artworks"
                        className="px-5 py-2.5 border border-ink text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all"
                    >
                        Add work
                    </Link>
                </div>
            </div>

            {/* Recent artworks */}
            <div className="bg-white border border-[#E0D8CC] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <p className="text-xs tracking-widest uppercase text-[#AAA]">Workshop</p>
                        <h3 className="font-serif italic text-2xl text-ink">Works</h3>
                        <p className="text-xs text-[#AAA]">{stats.total} of {stats.total}</p>
                    </div>
                    <Link
                        to="/admin/artworks"
                        className="px-4 py-2 bg-ink text-white text-xs tracking-widest uppercase font-sans hover:bg-[#333] transition-all"
                    >
                        + Add
                    </Link>
                </div>

                <div className="flex flex-col divide-y divide-[#F0EAE0]">
                    {recentArtworks.length === 0 && (
                        <p className="text-sm text-[#888] py-6">No artworks yet. Add your first piece!</p>
                    )}
                    {recentArtworks.map(art => (
                        <div key={art.id} className="flex items-center gap-4 py-4">
                            {art.image_url ? (
                                <img
                                    src={art.image_url}
                                    alt={art.title}
                                    className="w-14 h-14 object-cover shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-14 bg-[#E8E2D9] shrink-0 flex items-center justify-center">
                                    <span className="text-xs text-[#AAA]">img</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-serif italic text-ink">{art.title}</p>
                                <p className="text-xs text-[#888]">
                                    {art.year}{art.dimensions ? ` · ${art.dimensions}` : ''}
                                </p>
                            </div>
                            {art.featured && (
                                <span className="text-xs tracking-widest uppercase bg-[#EAE4DB] px-3 py-1 text-[#888]">
                                    Featured
                                </span>
                            )}
                            <div className="flex gap-2 shrink-0">
                                <Link
                                    to="/admin/artworks"
                                    className="text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink border border-[#E0D8CC] px-3 py-1"
                                >
                                    Edit
                                </Link>
                                <Link
                                    to="/gallery"
                                    target="_blank"
                                    className="text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink border border-[#E0D8CC] px-3 py-1"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {stats.total > 4 && (
                    <div className="mt-4 pt-4 border-t border-[#F0EAE0]">
                        <Link
                            to="/admin/artworks"
                            className="text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink"
                        >
                            View all {stats.total} works →
                        </Link>
                    </div>
                )}
            </div>
        </AdminShell>
    )
}