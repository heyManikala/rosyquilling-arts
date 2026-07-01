import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import PageTransition from '../components/PageTransition'

export default function Home() {
  const [artworks, setArtworks] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const { data: art } = await supabase
        .from('artworks')
        .select('*')
        .eq('featured', true)
        .limit(6)

      if (art) setArtworks(art)

      const { data: prof } = await supabase
        .from('profile')
        .select('*')
        .single()

      if (prof) setProfile(prof)
    }

    fetchData()
  }, [])

  return (
    <PageTransition>
      <main className="pt-16 bg-[#F2EDE4]">

        {/* HERO */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 text-center">

          <motion.div
            className="w-10 h-px bg-[#C0796A] mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6 }}
          />

          <motion.h1
            className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight text-ink"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            The intricate geometry of{' '}
            <span className="text-teal">rolled light</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-[#888] text-sm sm:text-base max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {profile?.bio ||
              'Handcrafted quilling art — 3mm paper strips coiled into architectural landscapes of depth, shadow, and vibrant botanical motion.'}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8">
            <Link
              to="/gallery"
              className="px-6 py-3 border border-ink text-xs tracking-widest uppercase text-center hover:bg-ink hover:text-[#F2EDE4] transition"
            >
              View Gallery
            </Link>

            <Link
              to="/process"
              className="px-6 py-3 text-xs tracking-widest uppercase text-[#888] hover:text-ink transition text-center"
            >
              The Process
            </Link>
          </div>
        </section>

        {/* FEATURED WORKS (FIXED LAYOUT) */}
        {artworks.length > 0 && (
          <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pb-20">

            <p className="text-xs tracking-widest uppercase text-[#888] mb-6">
              Featured works
            </p>


            {/* CLEAN GRID WITHOUT CROPPING BUG */}
            <div className="grid grid-cols-12 gap-4">

              {/* BIG IMAGE */}
              {artworks[0] && (
                <div className="col-span-12 md:col-span-8 row-span-2">
                  <Link to="/gallery">
                    <img
                      src={artworks[0].image_url}
                      alt={artworks[0].title}
                      className="w-full h-full object-contain bg-[#EAE4DB] hover:scale-[1.02] transition duration-500"
                    />
                  </Link>
                </div>
              )}

              {/* SIDE IMAGE */}
              {artworks[1] && (
                <div className="col-span-12 md:col-span-4">
                  <Link to="/gallery">
                    <img
                      src={artworks[1].image_url}
                      alt={artworks[1].title}
                      className="w-full h-auto object-contain bg-[#EAE4DB] hover:scale-[1.02] transition duration-500"
                    />
                  </Link>
                </div>
              )}

              {/* QUOTE CARD BELOW SIDE IMAGE */}
              <div className="col-span-12 md:col-span-4 bg-[#EAE4DB] border border-[#D8D0C4] p-6 flex flex-col justify-center">
                <p className="font-serif italic text-ink text-lg leading-relaxed">
                  "Every strip is a decision. The tension in the coil holds the soul of the work together."
                </p>

                <p className="text-xs tracking-widest uppercase text-[#888] mt-5">
                  — {profile?.name || 'Rosy Quilling Arts'}
                </p>
              </div>

              {/* BOTTOM TWO IMAGES */}
              {artworks.slice(2, 4).map((art, i) => (
                <div
                  key={i}
                  className="col-span-12 md:col-span-6"
                >
                  <Link to="/gallery">
                    <img
                      src={art.image_url}
                      alt={art.title}
                      className="w-full h-auto object-contain bg-[#EAE4DB] hover:scale-[1.02] transition duration-500"
                    />
                  </Link>
                </div>
              ))}

            </div>


            <div className="text-right mt-6">
              <Link
                to="/gallery"
                className="text-xs uppercase tracking-widest border-b border-ink pb-1 hover:text-teal"
              >
                View all works →
              </Link>
            </div>
          </section>
        )}
        {/* ABOUT */}
        <section className="border-t border-[#E0D8CC] py-16 sm:py-20 px-5 sm:px-6 md:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

            {/* Image */}
            <div>
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile?.name}
                  className="w-full max-w-md mx-auto rounded-lg object-cover shadow-lg"
                />
              ) : (
                <div className="w-full h-[420px] bg-[#EAE4DB] flex items-center justify-center rounded-lg">
                  <span className="text-[#888] text-sm">
                    Add profile image from Admin
                  </span>
                </div>
              )}
            </div>

            {/* Text */}
            <div>
              <p className="text-xs tracking-widest uppercase text-[#888] mb-3">
                About the Artist
              </p>

              <h2 className="font-serif italic text-3xl sm:text-5xl text-ink leading-tight mb-6">
                Hi, I'm {profile?.name || 'Rosy'}.
              </h2>

              <p className="text-[#777] leading-8 mb-5">
                {profile?.bio ||
                  'I create handcrafted quilling artwork using carefully rolled paper strips. Every design is made patiently by hand, transforming simple paper into detailed floral compositions, portraits, landscapes, and personalized keepsakes.'}
              </p>

              <p className="text-[#777] leading-8 mb-8">
                Every piece is unique and created with attention to detail, making it perfect for gifts, home décor, and memorable occasions.
              </p>

              <Link
                to="/about"
                className="inline-block border border-ink px-6 py-3 text-xs uppercase tracking-widest hover:bg-ink hover:text-[#F2EDE4] transition"
              >
                Learn More
              </Link>
            </div>

          </div>
        </section>

        {/* PROCESS */}
        <section className="border-t border-[#E0D8CC] py-16 sm:py-20 px-5 sm:px-6 md:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12">

            <div>
              <p className="text-xs tracking-widest uppercase text-[#888] mb-3">
                The Process
              </p>
              <h2 className="font-serif italic text-3xl sm:text-5xl text-ink leading-snug">
                Paper, tension, & patience — a slow craft.
              </h2>
            </div>

            <div>
              <p className="text-[#888] text-sm sm:text-base leading-relaxed">
                Each piece begins as a single 3mm paper strip. Coiled by hand and
                arranged into compositions that capture light, shadow, and depth.
              </p>

              <Link
                to="/process"
                className="inline-block mt-6 text-xs uppercase tracking-widest border-b border-ink pb-1 hover:text-teal"
              >
                Read more →
              </Link>
            </div>

          </div>
        </section>

      </main>
      {/* STUDIO ACCESS (Hidden) */}
      <div className="pb-8 text-center">
        <Link
          to="/admin/login"
          className="text-[10px] tracking-[0.35em] uppercase text-[#CFC6B8] hover:text-[#888] transition duration-300"
        >
          Studio Access
        </Link>
      </div>
    </PageTransition>
  )
}