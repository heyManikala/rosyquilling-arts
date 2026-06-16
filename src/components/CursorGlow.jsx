import { useEffect, useRef } from 'react'

export default function CursorGlow() {
    const glowRef = useRef(null)

    useEffect(() => {
        const glow = glowRef.current
        if (!glow) return

        let mouseX = 0
        let mouseY = 0
        let currentX = 0
        let currentY = 0
        let animFrame

        function onMouseMove(e) {
            mouseX = e.clientX
            mouseY = e.clientY
        }

        function animate() {
            currentX += (mouseX - currentX) * 0.08
            currentY += (mouseY - currentY) * 0.08
            glow.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`
            animFrame = requestAnimationFrame(animate)
        }

        window.addEventListener('mousemove', onMouseMove)
        animFrame = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            cancelAnimationFrame(animFrame)
        }
    }, [])

    return (
        <div
            ref={glowRef}
            className="pointer-events-none fixed top-0 left-0 z-[9999] w-[400px] h-[400px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(192, 121, 106, 0.12) 0%, rgba(192, 121, 106, 0.04) 50%, transparent 70%)',
                transition: 'opacity 0.3s ease',
            }}
        />
    )
}