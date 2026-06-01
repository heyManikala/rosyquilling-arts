import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        const err = await signIn(email, password)
        setLoading(false)
        if (err) {
            setError('Invalid email or password.')
        } else {
            navigate('/admin')
        }
    }

    return (
        <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <p className="font-serif italic text-3xl text-ink">Rosy Quilling Arts</p>
                    <p className="text-xs tracking-widest uppercase text-[#888] mt-2">Admin Access</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full border border-[#D0C8BC] bg-transparent px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full border border-[#D0C8BC] bg-transparent px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-ink"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 font-sans">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full border border-ink py-3 text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    )
}