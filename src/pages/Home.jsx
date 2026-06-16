import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import PageTransition from '../components/PageTransition'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
}

export default function Home() {
  const [artworks, setArtworks] = useState([])

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from('artworks')
        .select('*')
        .eq('featured', true)
        .limit(3)

      if (data) setArtworks(data)
    }

    fetchFeatured()
  }, [])

  return (
    <PageTransition>
      <main className="pt-14">

        {/* HERO */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
          <motion.div
            className="w-12 h-px bg-[#C0796A] mb-10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6 }}
          />

          <motion.h1
            className="font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight text-ink max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            The intricate geometry of{' '}
            <span className="text-teal italic">rolled light</span>
          </motion.h1>

          <motion.p
            className="mt-8 text-[#888] font-sans text-base max-w-md leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Handcrafted quilling art — 3mm paper strips coiled into architectural
            landscapes of depth, shadow, and vibrant botanical motion.
          </motion.p>

          <motion.div
            className="flex gap-4 mt-10"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link
              to="/gallery"
              className="px-6 py-3 border border-ink text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all"
            >
              View Gallery
            </Link>

            <Link
              to="/process"
              className="px-6 py-3 text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink transition-colors"
            >
              The Process
            </Link>
          </motion.div>
        </section>

        {/* FEATURED ARTWORKS */}
        {artworks.length > 0 && (
          <section className="px-6 pb-20">
            <div className="max-w-6xl mx-auto">

              <p className="text-xs tracking-widest uppercase text-[#888] mb-6">
                Featured works
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {artworks.map((art, i) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Link to="/gallery">
                      <div className="group overflow-hidden">
                        <img
                          src={art.image_url}
                          alt={art.title}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <p className="mt-2 font-serif italic text-sm text-ink">
                          {art.title}
                        </p>
                        <p className="text-xs text-[#888]">{art.year}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* PROCESS SECTION */}
        <section className="border-t border-[#E0D8CC] py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-widest uppercase text-[#888] mb-4">
                The Process
              </p>
              <h2 className="font-serif italic text-4xl md:text-5xl text-ink leading-snug">
                Paper, tension, & patience — a slow craft.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#888] font-sans leading-relaxed">
                Each piece begins as a single 3mm paper strip. Coiled by hand and
                pinched into shape, hundreds of forms are arranged into compositions
                that capture light and shadow like small architectural reliefs.
              </p>

              <Link
                to="/process"
                className="inline-block mt-6 text-xs tracking-widest uppercase font-sans text-ink border-b border-ink pb-0.5 hover:text-teal hover:border-teal transition-colors"
              >
                Read more
              </Link>
            </motion.div>

          </div>
        </section>

      </main>
    </PageTransition>
  )
}