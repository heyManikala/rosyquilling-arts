import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminShell from '../../components/AdminShell'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, featured: 0 })

    useEffect(() => {
        async function fetchStats() {
            const { data: artworkData } = await supabase
                .from('artworks')
                .select('id, featured')
            const total = artworkData?.length ?? 0
            const featured = artworkData?.filter(a => a.featured).length ?? 0
            setStats({ total, featured })
        }
        fetchStats()
    }, [])

    return (
        <AdminShell>
            <h1 className="font-serif italic text-3xl text-ink mb-8">Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {[
                    { label: 'Total artworks', value: stats.total },
                    { label: 'Featured works', value: stats.featured },
                ].map(stat => (
                    <div key={stat.label} className="bg-white border border-[#E0D8CC] p-6">
                        <p className="text-xs tracking-widest uppercase text-[#888] mb-2">{stat.label}</p>
                        <p className="font-serif text-4xl text-ink">{stat.value}</p>
                    </div>
                ))}
            </div>
            <div>
                <p className="text-xs tracking-widest uppercase text-[#888] mb-4">Quick actions</p>
                <div className="flex flex-wrap gap-4">
                    <Link to="/admin/artworks" className="px-6 py-3 border border-ink text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all">
                        Manage artworks
                    </Link>
                    <Link to="/admin/profile" className="px-6 py-3 border border-[#D0C8BC] text-xs tracking-widest uppercase font-sans text-[#888] hover:border-ink hover:text-ink transition-all">
                        Edit profile
                    </Link>
                    <Link to="/" target="_blank" className="px-6 py-3 border border-[#D0C8BC] text-xs tracking-widest uppercase font-sans text-[#888] hover:border-ink hover:text-ink transition-all">
                        View site ↗
                    </Link>
                </div>
            </div>
        </AdminShell>
    )
}