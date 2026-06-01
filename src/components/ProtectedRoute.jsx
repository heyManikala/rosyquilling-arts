import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F2EDE4]">
                <p className="font-serif italic text-2xl text-[#888]">Loading...</p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />
    }

    return children
}