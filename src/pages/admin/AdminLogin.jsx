import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [resetSent, setResetSent] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Clear any broken session when landing on login page
        supabase.auth.signOut()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        })

        setLoading(false)

        if (error) {
            if (error.message.includes('Invalid login')) {
                setError('Wrong email or password.')
            } else if (error.message.includes('Email not confirmed')) {
                setError('Email not confirmed. Go to Supabase → Authentication → Users and confirm your email.')
            } else {
                setError(error.message)
            }
            return
        }

        if (data?.user) {
            navigate('/admin')
        }
    }

    async function handleForgotPassword() {
        if (!email) {
            setError('Enter your email above first, then click Forgot password.')
            return
        }
        setError('')
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/admin/reset-password`,
        })
        if (error) {
            setError(error.message)
        } else {
            setResetSent(true)
        }
    }

    return (
        <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <p className="font-serif italic text-3xl text-ink">Rosy Quilling Arts</p>
                    <p className="text-xs tracking-widest uppercase text-[#888] mt-2">Admin Access</p>
                </div>

                {resetSent ? (
                    <div className="bg-teal-50 border border-teal-200 px-4 py-4 text-sm text-teal-700 text-center">
                        <p className="font-medium mb-1">Reset email sent!</p>
                        <p className="text-xs">Check your inbox and click the link to set a new password.</p>
                        <button
                            onClick={() => setResetSent(false)}
                            className="mt-3 text-xs tracking-widest uppercase border-b border-teal-500 pb-0.5"
                        >
                            Back to login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Email</label>
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
                            <label className="block text-xs tracking-widest uppercase text-[#888] mb-2">Password</label>
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
                            <div className="bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full border border-ink py-3 text-xs tracking-widest uppercase font-sans hover:bg-ink hover:text-[#F2EDE4] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-xs text-[#888] hover:text-ink transition-colors text-center mt-2"
                        >
                            Forgot password? Send reset email
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}