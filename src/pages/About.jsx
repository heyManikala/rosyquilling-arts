import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import PageTransition from '../components/PageTransition'

export default function About() {
    const [profile, setProfile] = useState(null)
    const [stats, setStats] = useState({ total: 0, featured: 0 })

    useEffect(() => {
        async function fetchData() {
            const { data: prof } = await supabase
                .from('profile')
                .select('*')
                .single()
            if (prof) setProfile(prof)

            const { data: artworks } = await supabase
                .from('artworks')
                .select('id, featured')
            if (artworks) {
                setStats({
                    total: artworks.length,
                    featured: artworks.filter(a => a.featured).length,
                })
            }
        }
        fetchData()
    }, [])

    return (
        <PageTransition>
            <main className="pt-14 bg-[#F2EDE4]">

                {/* Hero */}
                <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Left — text */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="w-10 h-px bg-[#C0796A] mb-8" />
                            <p className="text-xs tracking-widest uppercase text-[#888] mb-4">About</p>
                            <h1 className="font-serif italic text-5xl md:text-6xl text-ink leading-tight mb-6">
                                The artist behind the coil
                            </h1>
                            <p className="text-[#666] font-sans leading-relaxed text-base mb-4">
                                {profile?.bio ||
                                    'Every piece begins with a single 3mm paper strip and a quiet intention. Quilling is patience made visible — each coil a decision, each form a breath held and released into shape.'}
                            </p>
                            <p className="text-[#666] font-sans leading-relaxed text-base">
                                Based in {profile?.location || 'Nepal'}, I create handcrafted quilling art
                                that captures light, shadow, and botanical movement. Each work is made
                                entirely by hand — no machines, no shortcuts.
                            </p>

                            <div className="flex gap-4 mt-8">
                                <Link
                                    to="/gallery"
                                    className="px-6 py-3 border border-ink text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all"
                                >
                                    View gallery
                                </Link>
                                <Link
                                    to="/contact"
                                    className="px-6 py-3 text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink transition-colors"
                                >
                                    Get in touch
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right — avatar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="flex justify-center"
                        >
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.name || 'Artist'}
                                    className="w-72 h-72 md:w-96 md:h-96 object-cover"
                                />
                            ) : (
                                <div className="w-72 h-72 md:w-96 md:h-96 bg-[#EAE4DB] border border-[#D8D0C4] flex items-center justify-center">
                                    <p className="font-serif italic text-[#AAA] text-lg">
                                        {profile?.name || 'Rosy Quilling Arts'}
                                    </p>
                                </div>
                            )}
                        </motion.div>

                    </div>
                </section>

                {/* Stats */}
                <section className="border-t border-[#E0D8CC] py-16 px-6">
                    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: stats.total, label: 'Artworks created' },
                            { value: stats.featured, label: 'Featured pieces' },
                            { value: '3mm', label: 'Paper strip width' },
                            { value: '100%', label: 'Handcrafted' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="text-center"
                            >
                                <p className="font-serif italic text-4xl md:text-5xl text-ink mb-2">
                                    {stat.value}
                                </p>
                                <p className="text-xs tracking-widest uppercase text-[#888]">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* My story */}
                <section className="border-t border-[#E0D8CC] py-20 px-6">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_2fr] gap-12">
                        <div>
                            <p className="text-xs tracking-widest uppercase text-[#888] mb-4">My story</p>
                            <h2 className="font-serif italic text-4xl text-ink leading-snug">
                                How it all started
                            </h2>
                        </div>
                        <div className="flex flex-col gap-4 text-[#666] font-sans leading-relaxed">
                            <p>
                                Quilling found me during a quiet afternoon with a roll of paper and
                                nothing but time. What started as curiosity became obsession — the way
                                a single strip could be coaxed into a petal, a wave, a tiny architectural
                                form that caught the light differently depending on the angle.
                            </p>
                            <p>
                                Every piece I make is a conversation between the paper and my hands.
                                I never fully plan the outcome — I begin with a colour, a feeling, and
                                let the coils guide the composition. Some pieces take 4 hours. Others
                                take weeks.
                            </p>
                            <p>
                                I take commissions for wall art, greeting cards, framed gifts, and
                                custom installations. If you have an idea, I'd love to bring it to life
                                in paper.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What I make */}
                <section className="border-t border-[#E0D8CC] py-20 px-6 bg-[#EAE4DB]">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-xs tracking-widest uppercase text-[#888] mb-2">Specialties</p>
                        <h2 className="font-serif italic text-4xl text-ink mb-12">What I create</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Botanical art',
                                    desc: 'Flowers, leaves, and nature-inspired forms built from hundreds of individually shaped coils.',
                                },
                                {
                                    title: 'Portrait pieces',
                                    desc: 'Figurative works and silhouettes rendered in paper — each one a unique interpretation.',
                                },
                                {
                                    title: 'Geometric designs',
                                    desc: 'Precise, architectural compositions using marquises, squares, and repeating forms.',
                                },
                                {
                                    title: 'Custom commissions',
                                    desc: 'Personalized pieces for weddings, anniversaries, birthdays, and special occasions.',
                                },
                                {
                                    title: 'Framed gifts',
                                    desc: 'Ready-to-hang artwork in standard frame sizes, packaged carefully for gifting.',
                                },
                                {
                                    title: 'Greeting cards',
                                    desc: 'Miniature quilled artworks on card — each one handmade and one of a kind.',
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    className="bg-[#F2EDE4] border border-[#D8D0C4] p-6"
                                >
                                    <h3 className="font-serif italic text-xl text-ink mb-2">{item.title}</h3>
                                    <p className="text-xs text-[#888] font-sans leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-6 text-center">
                    <div className="max-w-xl mx-auto">
                        <div className="w-10 h-px bg-[#C0796A] mx-auto mb-8" />
                        <h2 className="font-serif italic text-4xl text-ink mb-4">
                            Let's create something together
                        </h2>
                        <p className="text-[#888] font-sans text-sm leading-relaxed mb-8">
                            Whether it's a commission, a collaboration, or just a question about
                            the craft — I'd love to hear from you.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/contact"
                                className="px-6 py-3 border border-ink text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all"
                            >
                                Contact me
                            </Link>
                            <Link
                                to="/gallery"
                                className="px-6 py-3 text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink transition-colors"
                            >
                                See the work
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
        </PageTransition>
    )
}