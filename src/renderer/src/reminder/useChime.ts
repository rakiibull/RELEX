import { useCallback, useRef } from 'react'

/** The popup appears with no user gesture, so play() can be rejected by the
 *  autoplay policy — which fails silently and leaves the alarm missing. The
 *  window sets autoplayPolicy: 'no-user-gesture-required'; this still catches
 *  the rejection so a failure is visible in the console rather than invisible. */
export function useChime(): (url: string, volume: number) => void {
  const current = useRef<HTMLAudioElement | null>(null)

  return useCallback((url: string, volume: number) => {
    if (!url) return
    // Stop any chime still ringing, so a quick Done then next break does not
    // overlap two sounds.
    current.current?.pause()

    const audio = new Audio(url)
    audio.volume = Math.min(1, Math.max(0, volume))
    current.current = audio

    audio.play().catch((err: unknown) => {
      console.error('[relex] chime blocked:', err)
    })
  }, [])
}
