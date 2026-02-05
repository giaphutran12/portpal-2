'use client'

import { useEffect } from 'react'

export function SWRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        console.log('Service Worker registered:', registration)
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }

    // Register on mount
    registerServiceWorker()

    // Check for updates periodically (every hour)
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update()
        }
      })
    }, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}
