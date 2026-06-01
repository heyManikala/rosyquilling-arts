import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-[#1A1A1A] text-white py-12 px-6">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
                <p className="font-serif italic text-xl">Rosy Quilling Arts</p>
                <p className="text-xs tracking-widest uppercase text-[#888]">
                    Handcrafted with paper & patience
                </p>
                <div className="flex gap-6 mt-2">
                    <Link to="/gallery" className="text-xs tracking-widest uppercase text-[#888] hover:text-white transition-colors">
                        Gallery
                    </Link>
                    <Link to="/process" className="text-xs tracking-widest uppercase text-[#888] hover:text-white transition-colors">
                        The Process
                    </Link>
                </div>
                <p className="text-xs text-[#555] mt-4">© {new Date().getFullYear()} Rosy Quilling Arts. All rights reserved.</p>
            </div>
        </footer>
    )
}