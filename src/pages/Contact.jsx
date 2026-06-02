import PageTransition from '../components/PageTransition'

export default function Contact() {
    return (
        <PageTransition>
            <main className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center bg-[#F2EDE4]">

                {/* TITLE */}
                <h1 className="font-serif italic text-5xl text-ink">
                    Contact
                </h1>

                <p className="mt-4 text-[#888] text-sm max-w-md">
                    Let’s connect for custom quilling artworks, commissions, or collaborations.
                </p>

                {/* CONTACT INFO */}
                <div className="mt-10 flex flex-col gap-5 text-sm">

                    <a
                        href="mailto:rosyquilling@gmail.com"
                        className="text-[#555] hover:text-ink transition"
                    >
                        📧 rosyquilling@gmail.com
                    </a>

                    <a
                        href="tel:98XXXXXXXX"
                        className="text-[#555] hover:text-ink transition"
                    >
                        📞 98XXXXXXXX
                    </a>

                    <p className="text-[#555]">
                        📍 Kathmandu, Nepal
                    </p>

                    <a
                        href="https://instagram.com/rosyquillingarts"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#555] hover:text-ink transition"
                    >
                        📷 Instagram
                    </a>

                </div>

            </main>
        </PageTransition>
    )
}