import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Footer() {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        async function fetchProfile() {
            const { data } = await supabase
                .from('profile')
                .select('*')
                .single()

            if (data) setProfile(data)
        }

        fetchProfile()
    }, [])

    return (
        <footer className="bg-[#1A1A1A] text-white py-10 px-6">
            <div className="max-w-4xl mx-auto text-center">

                {/* BRAND */}
                <p className="font-serif italic text-xl mb-2">
                    Rosy Quilling Arts
                </p>

                <p className="text-sm text-[#888] mb-6">
                    Handcrafted with paper & patience
                </p>

                {/* LINKS */}
                <div className="flex justify-center gap-8 text-sm mb-6">

                    <Link to="/gallery" className="text-[#888] hover:text-white transition">
                        Gallery
                    </Link>

                    <Link to="/process" className="text-[#888] hover:text-white transition">
                        The Process
                    </Link>

                    <Link to="/about" className="text-[#888] hover:text-white transition">
                        About
                    </Link>

                    <Link to="/contact" className="text-[#888] hover:text-white transition">
                        Contact
                    </Link>

                </div>

                {/* Instagram */}
                {profile?.instagram_url && (
                    <div className="flex justify-center my-6">
                        <a
                            href={profile.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 px-5 py-3 rounded-full border border-[#444] hover:border-[#C0796A] hover:bg-[#252525] transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm4.25 4.25A5.25 5.25 0 1 1 6.75 11.5 5.25 5.25 0 0 1 12 6.25zm0 2A3.25 3.25 0 1 0 15.25 11.5 3.25 3.25 0 0 0 12 8.25zm5-3.1a1.15 1.15 0 1 1-1.15 1.15A1.15 1.15 0 0 1 17 5.15z" />
                                </svg>
                            </div>

                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-[#999]">
                                    Follow us
                                </p>
                                <p className="text-sm text-white group-hover:text-[#C0796A] transition-colors">
                                    Instagram
                                </p>
                            </div>
                        </a>
                    </div>
                )}

                {/* COPYRIGHT */}
                <p className="text-[11px] text-[#555] border-t border-[#333] pt-4">
                    © 2026 Rosy Quilling Arts. All rights reserved.
                </p>

            </div>
        </footer>
    )
}