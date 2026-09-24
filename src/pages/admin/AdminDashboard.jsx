import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import AdminShell from '../../components/AdminShell'

export default function AdminDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({ total: 0, featured: 0 })
    const [profile, setProfile] = useState(null)
    const [allArtworks, setAllArtworks] = useState([])
    const [modal, setModal] = useState(null) // 'total' | 'featured' | null

    useEffect(() => {
        async function fetchData() {
            const { data: artworks } = await supabase
                .from('artworks')
                .select('*')
                .order('created_at', { ascending: false })

            const { data: profileData } = await supabase
                .from('profile')
                .select('*')
                .single()

            if (artworks) {
                setAllArtworks(artworks)
                setStats({
                    total: artworks.length,
                    featured: artworks.filter(a => a.featured).length,
                })
            }
            if (profileData) setProfile(profileData)
        }
        fetchData()
    }, [])

    const profileComplete = profile?.name && profile?.bio && profile?.email

    const modalArtworks = modal === 'featured'
        ? allArtworks.filter(a => a.featured)
        : allArtworks

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

                {/* Total works — clickable */}
                <button
                    onClick={() => setModal('total')}
                    className="bg-ink text-white p-6 text-left hover:bg-[#222] transition-colors cursor-pointer"
                >
                    <p className="text-xs tracking-widest uppercase text-[#888] mb-3">Total works</p>
                    <div className="w-4 h-px bg-[#C0796A] mb-3" />
                    <p className="font-serif italic text-5xl">{stats.total}</p>
                    <p className="text-xs text-[#666] mt-3">Click to view all →</p>
                </button>

                {/* Featured — clickable */}
                <button
                    onClick={() => setModal('featured')}
                    className="bg-white border border-[#E0D8CC] p-6 text-left hover:border-ink transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <p className="text-xs tracking-widest uppercase text-[#888]">Featured</p>
                    </div>
                    <div className="w-4 h-px bg-[#C0796A] mb-3" />
                    <p className="font-serif italic text-5xl text-ink">{stats.featured}</p>
                    <p className="text-xs text-[#888] mt-3">Click to view →</p>
                </button>

                {/* Profile — clickable */}
                <Link
                    to="/admin/profile"
                    className="bg-white border border-[#E0D8CC] p-6 hover:border-ink transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${profileComplete ? 'bg-teal-500' : 'bg-[#DDD]'}`} />
                        <p className="text-xs tracking-widest uppercase text-[#888]">Profile</p>
                    </div>
                    <div className="w-4 h-px bg-[#C0796A] mb-3" />
                    <p className="font-serif italic text-2xl text-ink">
                        {profileComplete ? 'Complete' : 'Incomplete'}
                    </p>
                    <p className="text-xs text-[#888] mt-3">Edit profile →</p>
                </Link>

                {/* Quick add */}
                <div className="bg-white border border-[#E0D8CC] p-6">
                    <p className="text-xs tracking-widest uppercase text-[#888] mb-3">Quick add</p>
                    <p className="font-serif italic text-lg text-ink mb-3">New artwork</p>
                    <Link
                        to="/admin/artworks?action=new"
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
                        to="/admin/artworks?action=new"
                        className="px-5 py-2.5 border border-ink text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all"
                    >
                        Add work
                    </Link>
                </div>
            </div>

            {/* Recent artworks grid */}
            <div className="bg-white border border-[#E0D8CC] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h3 className="font-serif italic text-2xl text-ink">Recent works</h3>
                        <span className="text-xs tracking-widest uppercase bg-ink text-white px-3 py-1">
                            {stats.total} pieces
                        </span>
                    </div>
                    <Link
                        to="/admin/artworks?action=new"
                        className="px-4 py-2 bg-ink text-white text-xs tracking-widest uppercase font-sans hover:bg-[#333] transition-all"
                    >
                        + Add
                    </Link>
                </div>

                {allArtworks.length === 0 ? (
                    <p className="text-sm text-[#888] py-6">No artworks yet. Add your first piece!</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                            {allArtworks.slice(0, 4).map(art => (
                                <div key={art.id} className="relative group">
                                    {art.image_url ? (
                                        <img src={art.image_url} alt={art.title} className="w-full aspect-square object-cover" />
                                    ) : (
                                        <div className="w-full aspect-square bg-[#E8E2D9] flex items-center justify-center">
                                            <span className="text-xs text-[#AAA]">No image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end p-2">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="font-serif italic text-white text-xs truncate">{art.title}</p>
                                            {art.featured && (
                                                <span className="text-[10px] tracking-widest uppercase text-yellow-400">Featured</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {stats.total > 4 && (
                                <button
                                    onClick={() => setModal('total')}
                                    className="w-full aspect-square bg-[#EAE4DB] border border-[#D8D0C4] flex flex-col items-center justify-center hover:bg-[#E0D8CC] transition-colors group"
                                >
                                    <p className="font-serif italic text-3xl text-ink">+{stats.total - 4}</p>
                                    <p className="text-xs tracking-widest uppercase text-[#888] mt-1 group-hover:text-ink">more</p>
                                </button>
                            )}
                        </div>
                        <div className="border-t border-[#F0EAE0] pt-4 flex items-center justify-between">
                            <p className="text-xs text-[#AAA]">Showing {Math.min(4, stats.total)} of {stats.total} works</p>
                            <Link to="/admin/artworks" className="text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink border-b border-[#888] pb-0.5">
                                Manage all works →
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {/* Pinterest-style Modal */}
            {modal && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex flex-col"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="bg-[#F2EDE4] w-full h-full overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="sticky top-0 bg-[#F2EDE4] border-b border-[#E0D8CC] px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <h2 className="font-serif italic text-2xl text-ink">
                                    {modal === 'featured' ? 'Featured works' : 'All works'}
                                </h2>
                                <span className="text-xs tracking-widest uppercase bg-ink text-white px-3 py-1">
                                    {modalArtworks.length} pieces
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/admin/artworks?action=new"
                                    onClick={() => setModal(null)}
                                    className="px-4 py-2 bg-[#C0796A] text-white text-xs tracking-widest uppercase hover:bg-[#A86358] transition-colors"
                                >
                                    + Add piece
                                </Link>
                                <button
                                    onClick={() => setModal(null)}
                                    className="text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink border border-[#D0C8BC] px-4 py-2"
                                >
                                    Close ✕
                                </button>
                            </div>
                        </div>

                        {/* Pinterest grid */}
                        <div className="p-6">
                            {modalArtworks.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="font-serif italic text-2xl text-ink mb-2">No works yet</p>
                                    <p className="text-sm text-[#888]">Add your first artwork to see it here.</p>
                                </div>
                            ) : (
                                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3">
                                    {modalArtworks.map(art => (
                                        <div key={art.id} className="break-inside-avoid group relative cursor-pointer mb-3">
                                            {art.image_url ? (
                                                <img
                                                    src={art.image_url}
                                                    alt={art.title}
                                                    className="w-full object-cover rounded-lg group-hover:brightness-90 transition-all duration-300"
                                                />
                                            ) : (
                                                <div className="w-full aspect-square bg-[#E8E2D9] rounded-lg flex items-center justify-center">
                                                    <span className="text-xs text-[#AAA]">No image</span>
                                                </div>
                                            )}

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col justify-between p-3">
                                                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {art.featured && (
                                                        <span className="text-[10px] tracking-widest uppercase bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="font-serif italic text-white text-sm">{art.title}</p>
                                                    <p className="text-xs text-white/70">
                                                        {art.year}{art.category ? ` · ${art.category}` : ''}
                                                    </p>
                                                    <div className="flex gap-2 mt-2">
                                                        <Link
                                                            to="/admin/artworks"
                                                            onClick={() => setModal(null)}
                                                            className="text-[10px] tracking-widest uppercase bg-white text-ink px-2 py-1 hover:bg-[#F2EDE4] transition-colors"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </AdminShell>
    )
}