import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import PageTransition from '../components/PageTransition'

export default function Contact() {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        async function fetchProfile() {
            const { data } = await supabase.from('profile').select('*').single()
            if (data) setProfile(data)
        }
        fetchProfile()
    }, [])

    return (
        <PageTransition>
            <main className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center bg-[#F2EDE4]">

                {/* Header */}
                <div className="w-10 h-px bg-[#C0796A] mb-8 mx-auto" />
                <h1 className="font-serif italic text-5xl text-ink">Contact</h1>

                <p className="mt-4 text-[#888] text-sm max-w-md leading-relaxed">
                    Let's connect for custom quilling artworks, commissions, or collaborations.
                </p>

                {/* Contact Cards */}
                <div className="mt-12 flex flex-col gap-6 text-sm max-w-sm w-full">

                    {/* EMAIL */}
                    {profile?.email && (
                        <a
                            href={`mailto:${profile.email}`}
                            className="flex items-center gap-3 px-6 py-4 border border-[#E0D8CC] hover:border-ink transition-colors group"
                        >
                            <span className="text-lg">✉️</span>
                            <div className="text-left">
                                <p className="text-xs tracking-widest uppercase text-[#888] mb-0.5">
                                    Email
                                </p>
                                <p className="text-ink group-hover:text-teal transition-colors">
                                    {profile.email}
                                </p>
                            </div>
                        </a>
                    )}

                    {/* PHONE */}
                    {profile?.phone && (
                        <a
                            href={`tel:${profile.phone}`}
                            className="flex items-center gap-3 px-6 py-4 border border-[#E0D8CC] hover:border-ink transition-colors group"
                        >
                            <span className="text-lg">📞</span>
                            <div className="text-left">
                                <p className="text-xs tracking-widest uppercase text-[#888] mb-0.5">
                                    Phone / WhatsApp
                                </p>
                                <p className="text-ink group-hover:text-teal transition-colors">
                                    {profile.phone}
                                </p>
                            </div>
                        </a>
                    )}

                    {/* LOCATION */}
                    {profile?.location && (
                        <div className="flex items-center gap-3 px-6 py-4 border border-[#E0D8CC]">
                            <span className="text-lg">📍</span>
                            <div className="text-left">
                                <p className="text-xs tracking-widest uppercase text-[#888] mb-0.5">
                                    Location
                                </p>
                                <p className="text-ink">{profile.location}</p>
                            </div>
                        </div>
                    )}

                    {/* INSTAGRAM */}
                    {profile?.instagram_url && (
                        <a
                            href={profile.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-4 border border-[#E0D8CC] hover:border-ink transition-colors group"
                        >
                            <span className="text-lg">📷</span>

                            <div className="text-left">
                                <p className="text-xs tracking-widest uppercase text-[#888] mb-0.5">
                                    Instagram
                                </p>
                                <p className="text-ink group-hover:text-teal transition-colors">
                                    {profile.instagram || 'rosyquilling.arts'}
                                </p>
                            </div>
                        </a>
                    )}

                </div>

                {/* Footer note */}
                <p className="mt-12 text-xs text-[#AAA]">
                    Based in {profile?.location || 'Nepal'} · Available for commissions worldwide
                </p>

            </main>
        </PageTransition>
    )
}