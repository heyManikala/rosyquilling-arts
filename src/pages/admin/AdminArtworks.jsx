import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminShell from '../../components/AdminShell'

const empty = {
    title: '',
    year: '',
    dimensions: '',
    description: '',
    featured: false,
    paper_strips: '',
    hours_taken: ''
}

export default function AdminArtworks() {
    const [artworks, setArtworks] = useState([])
    const [form, setForm] = useState(empty)
    const [editingId, setEditingId] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [message, setMessage] = useState('')
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        fetchArtworks()
    }, [])

    async function fetchArtworks() {
        const { data } = await supabase
            .from('artworks')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setArtworks(data)
    }

    // ⭐ FEATURE TOGGLE (ADDED ONLY THIS)
    async function toggleFeatured(id, currentValue) {
        const { error } = await supabase
            .from('artworks')
            .update({ featured: !currentValue })
            .eq('id', id)

        if (error) {
            console.error(error)
            return
        }

        fetchArtworks()
    }

    function handleImageChange(e) {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    async function uploadImage(file) {
        const ext = file.name.split('.').pop()
        const filename = `artwork-${Date.now()}.${ext}`

        const { error } = await supabase.storage
            .from('artwork-images')
            .upload(filename, file, { upsert: true })

        if (error) {
            console.error('Upload error:', error)
            throw error
        }

        const { data } = supabase.storage
            .from('artwork-images')
            .getPublicUrl(filename)

        return data.publicUrl
    }

    async function handleSave() {
        if (!form.title) return setMessage('Title is required.')

        setSaving(true)
        setMessage('')

        try {
            let image_url = form.image_url || null

            if (imageFile) {
                image_url = await uploadImage(imageFile)
            }

            if (editingId) {
                const { error } = await supabase
                    .from('artworks')
                    .update({ ...form, image_url })
                    .eq('id', editingId)

                if (error) throw error
                setMessage('Artwork updated!')
            } else {
                if (!image_url) {
                    setSaving(false)
                    return setMessage('Please upload an image.')
                }

                const { error } = await supabase
                    .from('artworks')
                    .insert({ ...form, image_url })

                if (error) throw error
                setMessage('Artwork added!')
            }

            setForm(empty)
            setEditingId(null)
            setImageFile(null)
            setImagePreview(null)
            setShowForm(false)
            fetchArtworks()

        } catch (err) {
            setMessage('Error: ' + err.message)
        }

        setSaving(false)
    }

    function handleEdit(art) {
        setForm({
            title: art.title,
            year: art.year || '',
            dimensions: art.dimensions || '',
            description: art.description || '',
            featured: art.featured || false,
            image_url: art.image_url || '',
            paper_strips: art.paper_strips || '',
            hours_taken: art.hours_taken || ''
        })

        setImagePreview(art.image_url || null)
        setEditingId(art.id)
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleDelete(art) {
        if (!window.confirm(`Delete "${art.title}"? This cannot be undone.`)) return

        setDeleting(art.id)

        await supabase
            .from('artworks')
            .delete()
            .eq('id', art.id)

        setDeleting(null)
        fetchArtworks()
    }

    function handleCancel() {
        setForm(empty)
        setEditingId(null)
        setImageFile(null)
        setImagePreview(null)
        setShowForm(false)
        setMessage('')
    }

    return (
        <AdminShell>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-serif italic text-3xl text-ink">Artworks</h1>

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-5 py-2.5 border border-ink text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all"
                    >
                        + Add artwork
                    </button>
                )}
            </div>

            {/* FORM (UNCHANGED) */}
            {showForm && (
                <div className="bg-white border border-[#E0D8CC] p-6 mb-10">
                    <h2 className="font-serif italic text-xl text-ink mb-6">
                        {editingId ? 'Edit artwork' : 'New artwork'}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                                placeholder="e.g. Crimson Helix"
                            />
                        </div>

                        <div>
                            <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Year</label>
                            <input
                                type="text"
                                value={form.year}
                                onChange={e => setForm({ ...form, year: e.target.value })}
                                className="w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                                placeholder="e.g. 2024"
                            />
                        </div>

                        <div>
                            <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Dimensions</label>
                            <input
                                type="text"
                                value={form.dimensions}
                                onChange={e => setForm({ ...form, dimensions: e.target.value })}
                                className="w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                                placeholder="e.g. 30 × 30 cm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Paper strips used</label>
                            <input
                                type="number"
                                value={form.paper_strips}
                                onChange={e => setForm({ ...form, paper_strips: e.target.value })}
                                className="w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                            />
                        </div>

                        <div>
                            <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Hours taken</label>
                            <input
                                type="number"
                                value={form.hours_taken}
                                onChange={e => setForm({ ...form, hours_taken: e.target.value })}
                                className="w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink resize-none"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                className="mt-3 w-40 h-40 object-cover border"
                            />
                        )}
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2.5 border border-ink text-xs uppercase"
                        >
                            {saving ? 'Saving...' : editingId ? 'Update' : 'Save artwork'}
                        </button>

                        <button onClick={handleCancel} className="text-xs">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* LIST */}
            <div className="flex flex-col gap-3">
                {artworks.map(art => (
                    <div key={art.id} className="bg-white border p-4 flex items-center gap-4">

                        {art.image_url && (
                            <img
                                src={art.image_url}
                                className="w-16 h-16 object-cover"
                            />
                        )}

                        <div className="flex-1">
                            <p className="font-serif italic">{art.title}</p>
                            <p className="text-xs text-gray-500">
                                {art.year}
                                {art.dimensions ? ` · ${art.dimensions}` : ''}
                                {art.featured ? ' · Featured' : ''}
                            </p>
                        </div>

                        {/* ⭐ FEATURE BUTTON */}
                        <button
                            onClick={() => toggleFeatured(art.id, art.featured)}
                            className={`text-2xl transition ${art.featured ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                        >
                            ⭐
                        </button>

                        <button onClick={() => handleEdit(art)} className="text-xs">
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(art)}
                            className="text-xs text-red-500"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </AdminShell>
    )
}