import PageTransition from '../components/PageTransition'

const steps = [
    { number: '01', title: 'Selecting the paper', body: 'Every piece starts with 3mm acid-free paper strips in carefully chosen colours. The weight and texture of the paper determines how it holds tension when coiled.' },
    { number: '02', title: 'Coiling by hand', body: 'Each strip is wound tightly around a 0.5mm quilling needle, then released to find its natural tension. No two coils are identical — small variations create the organic feel of the final work.' },
    { number: '03', title: 'Pinching into forms', body: 'Coils are pinched, squeezed, and shaped into teardrops, marquises, squares, and scrolls. These become petals, leaves, feathers, and geometric tiles.' },
    { number: '04', title: 'Composing the piece', body: 'Hundreds of individual forms are arranged on a backing board, building up depth layer by layer. The composition is planned on paper first, then executed over several sessions.' },
    { number: '05', title: 'Finishing and framing', body: 'Once the adhesive has fully cured, the piece is sealed against dust and framed behind UV-protective glass to preserve the colours for decades.' },
]

export default function Process() {
    return (
        <PageTransition>
            <main className="pt-14">

                <section className="max-w-6xl mx-auto px-6 py-16 border-b border-[#E0D8CC]">
                    <div className="grid md:grid-cols-2 gap-12 items-end">
                        <div>
                            <p className="text-xs tracking-widest uppercase text-[#888] mb-4">The Process</p>
                            <h1 className="font-serif italic text-5xl md:text-6xl lg:text-7xl text-ink leading-tight">
                                Paper, tension, and patience — a slow craft.
                            </h1>
                        </div>
                        <div>
                            <p className="text-[#555] font-sans leading-relaxed text-base">
                                Each piece begins as a single 3mm paper strip. Coiled by hand and
                                pinched into shape, hundreds of forms are arranged into compositions
                                that capture light and shadow like small architectural reliefs.
                                Commissions and original works are available on request.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 py-16">
                    <div className="flex flex-col gap-0">
                        {steps.map((step, i) => (
                            <div
                                key={step.number}
                                className={'grid md:grid-cols-[120px_1fr] gap-6 py-10 ' + (i < steps.length - 1 ? 'border-b border-[#E0D8CC]' : '')}
                            >
                                <p className="font-serif italic text-5xl text-[#E0D8CC]">{step.number}</p>
                                <div>
                                    <h2 className="font-serif italic text-2xl text-ink mb-3">{step.title}</h2>
                                    <p className="text-[#666] font-sans text-sm leading-relaxed max-w-xl">{step.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-[#1A1A1A] py-20 px-6">
                    <div className="max-w-xl mx-auto text-center">
                        <h2 className="font-serif italic text-4xl text-white mb-4">
                            Interested in a commission?
                        </h2>
                        <p className="text-[#888] font-sans text-sm leading-relaxed mb-8">
                            Original works and bespoke commissions are available. Get in touch to discuss your piece.
                        </p>

                        href="mailto:hello@rosyquilling.arts"
                        className="inline-block px-8 py-3 border border-white text-xs tracking-widest uppercase font-sans text-white hover:bg-white hover:text-ink transition-all"
                        <a>
                            Get in touch
                        </a>
                    </div>
                </section>

            </main>
        </PageTransition >
    )
}