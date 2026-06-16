import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ArtworkStrip() {
    const [artworks, setArtworks] = useState([])
    const stripRef = useRef(null)

    useEffect(() => {
        async function fetch() {
            const { data } = await supabase
                .from('artworks')
                .select('id, image_url, title')
                .limit(12)
            if (data) setArtworks([...data, ...data]) // duplicate for infinite loop
        }
        fetch()
    }, [])

    useEffect(() => {
        const strip = stripRef.current
        if (!strip) return

        let pos = 0
        let animFrame
        let paused = false

        function animate() {
            if (!paused) {
                pos += 0.5
                if (pos >= strip.scrollWidth / 2) pos = 0
                strip.style.transform = `translateX(-${pos}px)`
            }
            animFrame = requestAnimationFrame(animate)
        }

        strip.addEventListener('mouseenter', () => { paused = true })
        strip.addEventListener('mouseleave', () => { paused = false })

        animFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animFrame)
    }, [artworks])

    if (artworks.length === 0) return null

    return (
        <div className="overflow-hidden py-8 border-t border-b border-[#E0D8CC] my-8">
            <div
                ref={stripRef}
                className="flex gap-4 w-max"
                style={{ willChange: 'transform' }}
            >
                {artworks.map((art, i) => (
                    <div
                        key={`${art.id}-${i}`}
                        className="w-48 h-48 shrink-0 overflow-hidden group"
                    >
                        <img
                            src={art.image_url}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}