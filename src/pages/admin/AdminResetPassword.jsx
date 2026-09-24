import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminResetPassword() {
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [ready, setReady] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setReady(true)
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    async function handleReset(e) {
        e.preventDefault()
        setError('')
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password })
        setLoading(false)
        if (error) {
            setError(error.message)
        } else {
            setMessage('Password updated! Redirecting to login...')
            setTimeout(() => navigate('/admin/login'), 2000)
        }
    }

    if (!ready) {
        return (
            <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="font-serif italic text-2xl text-ink mb-2">Rosy Quilling Arts</p>
                    <p className="text-xs text-[#888]">Verifying reset link...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <p className="font-serif italic text-3xl text-ink">Rosy Quilling Arts</p>
                    <p className="text-xs tracking-widest uppercase text-[#888] mt-2">Set new password</p>
                </div>

                <form onSubmit={handleReset} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">New password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full border border-[#D0C8BC] bg-transparent px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                            placeholder="Min 6 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Confirm password</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            className="w-full border border-[#D0C8BC] bg-transparent px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                            placeholder="Repeat password"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">{error}</div>
                    )}
                    {message && (
                        <div className="bg-teal-50 border border-teal-200 px-4 py-3 text-xs text-teal-700">{message}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full border border-ink py-3 text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update password'}
                    </button>
                </form>
            </div>
        </div>
    )
}