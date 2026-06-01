import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminShell from '../../components/AdminShell'

const empty = { title: '', year: '', dimensions: '', description: '', featured: false }

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

    useEffect(() => { fetchArtworks() }, [])

    async function fetchArtworks() {
        const { data } = await supabase
            .from('artworks')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setArtworks(data)
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

        const { error: uploadError } = await supabase.storage
            .from('artwork-images')
            .upload(filename, file, { upsert: true })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            throw uploadError
        }

        const { data } = supabase.storage
            .from('artwork-images')
            .getPublicUrl(filename)

        console.log('Saved URL:', data.publicUrl)
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
                if (!image_url) return setSaving(false) || setMessage('Please upload an image.')
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
        })
        setImagePreview(art.image_url || null)
        setEditingId(art.id)
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleDelete(art) {
        if (!window.confirm(`Delete "${art.title}"? This cannot be undone.`)) return
        setDeleting(art.id)
        await supabase.from('artworks').delete().eq('id', art.id)
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

            {/* Form */}
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
                        <div className="flex items-center gap-3 mt-6">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={form.featured}
                                onChange={e => setForm({ ...form, featured: e.target.checked })}
                                className="w-4 h-4 accent-[#1A1A1A]"
                            />
                            <label htmlFor="featured" className="text-xs tracking-widest uppercase text-[#888]">
                                Show on homepage
                            </label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full border border-[#D0C8BC] bg-transparent px-4 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink resize-none"
                            placeholder="Describe this piece..."
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="text-sm font-sans text-[#888]"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-3 w-40 h-40 object-cover border border-[#E0D8CC]"
                            />
                        )}
                    </div>

                    {message && (
                        <p className={`mt-4 text-xs font-sans ${message.startsWith('Error') ? 'text-red-600' : 'text-teal-700'}`}>
                            {message}
                        </p>
                    )}

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2.5 border border-ink text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : editingId ? 'Update' : 'Save artwork'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2.5 text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Artworks list */}
            {artworks.length === 0 ? (
                <p className="text-[#888] font-sans text-sm py-10">No artworks yet. Add your first one!</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {artworks.map(art => (
                        <div
                            key={art.id}
                            className="bg-white border border-[#E0D8CC] p-4 flex items-center gap-4"
                        >
                            {art.image_url && (
                                <img
                                    src={art.image_url}
                                    alt={art.title}
                                    className="w-16 h-16 object-cover shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-serif italic text-ink truncate">{art.title}</p>
                                <p className="text-xs text-[#888]">
                                    {art.year}{art.dimensions ? ` · ${art.dimensions}` : ''}
                                    {art.featured ? ' · Featured' : ''}
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button
                                    onClick={() => handleEdit(art)}
                                    className="text-xs tracking-widest uppercase font-sans text-[#888] hover:text-ink"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(art)}
                                    disabled={deleting === art.id}
                                    className="text-xs tracking-widest uppercase font-sans text-red-400 hover:text-red-700 disabled:opacity-50"
                                >
                                    {deleting === art.id ? '...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminShell>
    )
}