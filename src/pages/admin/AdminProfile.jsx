import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminShell from '../../components/AdminShell'

const empty = {
    name: '',
    bio: '',
    tagline: '',
    instagram: '',
    instagram_url: '',
    email: '',
    phone: '',
    location: '',
    story_1: '',
    story_2: '',
    story_3: '',
    specialty_1_title: '',
    specialty_1_desc: '',
    specialty_2_title: '',
    specialty_2_desc: '',
    specialty_3_title: '',
    specialty_3_desc: '',
    specialty_4_title: '',
    specialty_4_desc: '',
    specialty_5_title: '',
    specialty_5_desc: '',
    specialty_6_title: '',
    specialty_6_desc: '',
    cta_heading: '',
    cta_subtext: '',
}

export default function AdminProfile() {
    const [form, setForm] = useState(empty)
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [activeTab, setActiveTab] = useState('basic')

    useEffect(() => {
        async function fetchProfile() {
            const { data } = await supabase.from('profile').select('*').single()
            if (data) {
                setForm({
                    name: data.name || '',
                    bio: data.bio || '',
                    tagline: data.tagline || '',
                    instagram: data.instagram || '',
                    instagram_url: data.instagram_url || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    story_1: data.story_1 || '',
                    story_2: data.story_2 || '',
                    story_3: data.story_3 || '',
                    specialty_1_title: data.specialty_1_title || '',
                    specialty_1_desc: data.specialty_1_desc || '',
                    specialty_2_title: data.specialty_2_title || '',
                    specialty_2_desc: data.specialty_2_desc || '',
                    specialty_3_title: data.specialty_3_title || '',
                    specialty_3_desc: data.specialty_3_desc || '',
                    specialty_4_title: data.specialty_4_title || '',
                    specialty_4_desc: data.specialty_4_desc || '',
                    specialty_5_title: data.specialty_5_title || '',
                    specialty_5_desc: data.specialty_5_desc || '',
                    specialty_6_title: data.specialty_6_title || '',
                    specialty_6_desc: data.specialty_6_desc || '',
                    cta_heading: data.cta_heading || '',
                    cta_subtext: data.cta_subtext || '',
                })
                if (data.avatar_url) setAvatarPreview(data.avatar_url)
            }
        }
        fetchProfile()
    }, [])

    function handleAvatarChange(e) {
        const file = e.target.files[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    async function handleSave() {
        setSaving(true)
        setMessage('')
        try {
            let avatar_url = avatarPreview
            if (avatarFile) {
                const ext = avatarFile.name.split('.').pop()
                const filename = `avatar.${ext}`
                await supabase.storage.from('artwork-images').upload(filename, avatarFile, { upsert: true })
                const { data } = supabase.storage.from('artwork-images').getPublicUrl(filename)
                avatar_url = data.publicUrl
            }
            const { data: existing } = await supabase.from('profile').select('id').single()
            if (existing) {
                await supabase.from('profile').update({ ...form, avatar_url }).eq('id', existing.id)
            } else {
                await supabase.from('profile').insert({ ...form, avatar_url })
            }
            setMessage('Profile saved!')
        } catch (err) {
            setMessage('Error: ' + err.message)
        }
        setSaving(false)
    }

    const tabs = [
        { id: 'basic', label: 'Basic info' },
        { id: 'about', label: 'About page' },
        { id: 'specialties', label: 'Specialties' },
        { id: 'cta', label: 'CTA section' },
    ]

    const inputClass = "w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink"
    const textareaClass = "w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink resize-none"
    const labelClass = "block text-xs tracking-widest uppercase text-[#888] mb-2"

    return (
        <AdminShell>

            {/* Header — no save button here */}
            <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-[#AAA] mb-1">The Workshop · Profile</p>
                <h1 className="font-serif italic text-4xl text-ink">Edit Profile</h1>
            </div>

            {/* Message banner */}
            {message && (
                <div className={`mb-6 px-4 py-3 text-xs font-sans border ${message.startsWith('Error')
                        ? 'border-red-300 text-red-600 bg-red-50'
                        : 'border-teal-300 text-teal-700 bg-teal-50'
                    }`}>
                    {message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-8 border-b border-[#E0D8CC]">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 text-xs tracking-widest uppercase font-sans transition-colors border-b-2 -mb-px ${activeTab === tab.id
                                ? 'border-ink text-ink'
                                : 'border-transparent text-[#888] hover:text-ink'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab: Basic info */}
            {activeTab === 'basic' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">

                        {/* Avatar */}
                        <div className="bg-white border border-[#E0D8CC] p-6">
                            <label className={labelClass}>Profile photo</label>
                            {avatarPreview && (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover mb-4 border border-[#E0D8CC]"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="text-sm font-sans text-[#888]"
                            />
                        </div>

                        {/* Contact details */}
                        <div className="bg-white border border-[#E0D8CC] p-6 flex flex-col gap-4">
                            <h3 className="font-serif italic text-lg text-ink">Contact details</h3>
                            {[
                                { key: 'name', label: 'Name', placeholder: 'Your name' },
                                { key: 'email', label: 'Email', placeholder: 'hello@rosyquilling.arts' },
                                { key: 'phone', label: 'Phone / WhatsApp', placeholder: '+977 98XXXXXXXX' },
                                { key: 'location', label: 'Location', placeholder: 'Kathmandu, Nepal' },
                                { key: 'instagram', label: 'Instagram handle', placeholder: '@rosyquilling.arts' },
                                { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
                            ].map(field => (
                                <div key={field.key}>
                                    <label className={labelClass}>{field.label}</label>
                                    <input
                                        type="text"
                                        value={form[field.key]}
                                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                        className={inputClass}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bio & tagline */}
                    <div className="bg-white border border-[#E0D8CC] p-6 flex flex-col gap-4">
                        <h3 className="font-serif italic text-lg text-ink">Bio & tagline</h3>
                        <div>
                            <label className={labelClass}>Tagline (shown on homepage hero)</label>
                            <input
                                type="text"
                                value={form.tagline}
                                onChange={e => setForm({ ...form, tagline: e.target.value })}
                                className={inputClass}
                                placeholder="e.g. Paper, patience & rolled light"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Bio (shown on homepage & about page)</label>
                            <textarea
                                value={form.bio}
                                onChange={e => setForm({ ...form, bio: e.target.value })}
                                rows={6}
                                className={textareaClass}
                                placeholder="Tell visitors about yourself and your craft..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: About page */}
            {activeTab === 'about' && (
                <div className="flex flex-col gap-6">
                    <div className="bg-white border border-[#E0D8CC] p-6">
                        <h3 className="font-serif italic text-lg text-ink mb-2">Your story — 3 paragraphs</h3>
                        <p className="text-xs text-[#888] mb-6">
                            These appear in the "How it all started" section on the About page.
                        </p>
                        <div className="flex flex-col gap-4">
                            {[
                                { key: 'story_1', label: 'Paragraph 1', placeholder: 'How you discovered quilling...' },
                                { key: 'story_2', label: 'Paragraph 2', placeholder: 'Your process and approach...' },
                                { key: 'story_3', label: 'Paragraph 3', placeholder: 'Commissions and what you offer...' },
                            ].map(field => (
                                <div key={field.key}>
                                    <label className={labelClass}>{field.label}</label>
                                    <textarea
                                        value={form[field.key]}
                                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                        rows={4}
                                        className={textareaClass}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Specialties */}
            {activeTab === 'specialties' && (
                <div className="flex flex-col gap-4">
                    <p className="text-xs text-[#888] mb-2">
                        These appear as cards in the "What I create" section on the About page.
                    </p>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="bg-white border border-[#E0D8CC] p-6 grid md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Specialty {n} — Title</label>
                                <input
                                    type="text"
                                    value={form[`specialty_${n}_title`]}
                                    onChange={e => setForm({ ...form, [`specialty_${n}_title`]: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. Botanical art"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Specialty {n} — Description</label>
                                <input
                                    type="text"
                                    value={form[`specialty_${n}_desc`]}
                                    onChange={e => setForm({ ...form, [`specialty_${n}_desc`]: e.target.value })}
                                    className={inputClass}
                                    placeholder="Short description..."
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tab: CTA */}
            {activeTab === 'cta' && (
                <div className="bg-white border border-[#E0D8CC] p-6 flex flex-col gap-4 max-w-lg">
                    <h3 className="font-serif italic text-lg text-ink mb-2">Call to action section</h3>
                    <p className="text-xs text-[#888] mb-2">
                        This appears at the bottom of the About page.
                    </p>
                    <div>
                        <label className={labelClass}>Heading</label>
                        <input
                            type="text"
                            value={form.cta_heading}
                            onChange={e => setForm({ ...form, cta_heading: e.target.value })}
                            className={inputClass}
                            placeholder="e.g. Let's create something together"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Subtext</label>
                        <textarea
                            value={form.cta_subtext}
                            onChange={e => setForm({ ...form, cta_subtext: e.target.value })}
                            rows={3}
                            className={textareaClass}
                            placeholder="e.g. Whether it's a commission or a question about the craft..."
                        />
                    </div>
                </div>
            )}

            {/* Save button — bottom only */}
            <div className="mt-10 flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-ink text-[#F2EDE4] text-xs tracking-widest uppercase font-sans hover:bg-[#333] transition-all disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save all changes'}
                </button>
                {message && (
                    <p className={`text-xs font-sans ${message.startsWith('Error') ? 'text-red-600' : 'text-teal-700'
                        }`}>
                        {message}
                    </p>
                )}
            </div>

        </AdminShell>
    )
}