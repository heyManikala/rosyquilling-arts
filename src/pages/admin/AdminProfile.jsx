import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminShell from '../../components/AdminShell'

const empty = { name: '', bio: '', instagram: '', email: '' }

export default function AdminProfile() {
    const [form, setForm] = useState(empty)
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        async function fetchProfile() {
            const { data } = await supabase
                .from('profile')
                .select('*')
                .single()
            if (data) {
                setForm({
                    name: data.name || '',
                    bio: data.bio || '',
                    instagram: data.instagram || '',
                    email: data.email || '',
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

    return (
        <AdminShell>
            <h1 className="font-serif italic text-3xl text-ink mb-8">Profile</h1>

            <div className="bg-white border border-[#E0D8CC] p-6 max-w-lg">
                {/* Avatar */}
                <div className="mb-6">
                    <label className="block text-xs tracking-widest uppercase text-[#888] mb-3">Profile photo</label>
                    {avatarPreview && (
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover mb-3 border border-[#E0D8CC]"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="text-sm font-sans text-[#888]"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    {[
                        { key: 'name', label: 'Name', placeholder: 'Your name' },
                        { key: 'email', label: 'Contact email', placeholder: 'hello@rosyquilling.arts' },
                        { key: 'instagram', label: 'Instagram handle', placeholder: '@rosyquilling' },
                    ].map(field => (
                        <div key={field.key}>
                            <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">
                                {field.label}
                            </label>
                            <input
                                type="text"
                                value={form[field.key]}
                                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                className="w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                                placeholder={field.placeholder}
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Bio</label>
                        <textarea
                            value={form.bio}
                            onChange={e => setForm({ ...form, bio: e.target.value })}
                            rows={4}
                            className="w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink resize-none"
                            placeholder="Tell visitors about yourself and your craft..."
                        />
                    </div>
                </div>

                {message && (
                    <p className={`mt-4 text-xs font-sans ${message.startsWith('Error') ? 'text-red-600' : 'text-teal-700'}`}>
                        {message}
                    </p>
                )}

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-6 px-6 py-2.5 border border-ink text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save profile'}
                </button>
            </div>
        </AdminShell>
    )
}