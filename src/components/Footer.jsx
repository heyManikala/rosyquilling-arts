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

                {/* COPYRIGHT */}
                <p className="text-[11px] text-[#555] border-t border-[#333] pt-4">
                    © 2026 Rosy Quilling Arts. All rights reserved.
                </p>

            </div>
        </footer>
    )
}