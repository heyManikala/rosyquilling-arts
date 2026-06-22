import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import PageTransition from '../components/PageTransition'

export default function Gallery() {
    const [artworks, setArtworks] = useState([])
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchArtworks() {
            const { data } = await supabase
                .from('artworks')
                .select('*')
                .order('created_at', { ascending: false })
            if (data) setArtworks(data)
            setLoading(false)
        }
        fetchArtworks()
    }, [])

    return (
        <PageTransition>
            <main className="pt-14">
                <section className="max-w-6xl mx-auto px-6 py-16">

                    {/* Header */}
                    <div className="text-center mb-14">
                        <div className="w-12 h-px bg-[#C0796A] mx-auto mb-8" />
                        <h1 className="font-serif italic text-5xl md:text-6xl text-ink">Gallery</h1>
                        <p className="mt-4 text-[#888] font-sans text-sm max-w-sm mx-auto">
                            Each piece is handcrafted using 3mm paper strips, coiled and pinched into form.
                        </p>
                    </div>

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-square bg-[#E8E2D9] animate-pulse rounded" />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && artworks.length === 0 && (
                        <p className="text-center text-[#888] font-sans py-20">
                            No artworks yet. Check back soon!
                        </p>
                    )}

                    {/* Masonry grid */}
                    {!loading && artworks.length > 0 && (
                        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                            {artworks.map(art => (
                                <div
                                    key={art.id}
                                    className="break-inside-avoid cursor-pointer group mb-4"
                                    onClick={() => setSelected(art)}
                                >
                                    {/* Image */}
                                    <div className="overflow-hidden relative">
                                        <img
                                            src={art.image_url}
                                            alt={art.title}
                                            className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                                    </div>

                                    {/* Title and year */}
                                    <div className="mt-2 flex justify-between items-start">
                                        <p className="font-serif italic text-sm text-ink">{art.title}</p>
                                        <p className="text-xs text-[#888] ml-2 shrink-0">{art.year}</p>
                                    </div>

                                    {/* Dimensions */}
                                    {art.dimensions && (
                                        <p className="text-xs text-[#AAA]">{art.dimensions}</p>
                                    )}

                                    {/* Paper strips and hours */}
                                    {(art.paper_strips || art.hours_taken) && (
                                        <div className="flex gap-3 mt-1">
                                            {art.paper_strips && (
                                                <p className="text-xs text-[#C0796A] font-sans">
                                                    {art.paper_strips} strips
                                                </p>
                                            )}
                                            {art.paper_strips && art.hours_taken && (
                                                <span className="text-xs text-[#DDD]">·</span>
                                            )}
                                            {art.hours_taken && (
                                                <p className="text-xs text-[#C0796A] font-sans">
                                                    {art.hours_taken} hrs
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Lightbox */}
                {selected && (
                    <div
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
                        onClick={() => setSelected(null)}
                    >
                        <div
                            className="bg-[#F2EDE4] max-w-lg w-full rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Image */}
                            <div className="max-h-[50vh] flex items-center justify-center bg-black">
                                <img
                                    src={selected.image_url}
                                    alt={selected.title}
                                    className="max-h-[50vh] w-auto object-contain"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h2 className="font-serif italic text-2xl text-ink">
                                    {selected.title}
                                </h2>
                                <p className="text-xs text-[#888] mt-1 tracking-wide">
                                    {selected.year}
                                    {selected.dimensions ? ` · ${selected.dimensions}` : ''}
                                </p>

                                {/* Stats — paper strips and hours */}
                                {(selected.paper_strips || selected.hours_taken) && (
                                    <div className="flex gap-8 mt-5 py-4 border-t border-b border-[#E0D8CC]">
                                        {selected.paper_strips && (
                                            <div>
                                                <p className="font-serif italic text-3xl text-ink">
                                                    {selected.paper_strips}
                                                </p>
                                                <p className="text-xs tracking-widest uppercase text-[#888] mt-1">
                                                    Paper strips
                                                </p>
                                            </div>
                                        )}
                                        {selected.hours_taken && (
                                            <div>
                                                <p className="font-serif italic text-3xl text-ink">
                                                    {selected.hours_taken}
                                                </p>
                                                <p className="text-xs tracking-widest uppercase text-[#888] mt-1">
                                                    Hours of work
                                                </p>
                                            </div>
                                        )}
                                        {selected.dimensions && (
                                            <div>
                                                <p className="font-serif italic text-xl text-ink mt-1">
                                                    {selected.dimensions}
                                                </p>
                                                <p className="text-xs tracking-widest uppercase text-[#888] mt-1">
                                                    Dimensions
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                {selected.description && (
                                    <p className="mt-4 text-[#555] font-sans text-sm leading-relaxed">
                                        {selected.description}
                                    </p>
                                )}

                                <button
                                    onClick={() => setSelected(null)}
                                    className="mt-6 text-xs uppercase tracking-widest text-[#888] hover:text-ink border-b border-[#888] pb-0.5 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </PageTransition>
    )
}