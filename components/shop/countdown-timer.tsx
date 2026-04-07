"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  endDate: Date | string
  className?: string
}

export function CountdownTimer({ endDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [expired, setExpired] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const end = new Date(endDate).getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = end - now

      if (distance < 0) {
        setExpired(true)
        setTimeLeft(null)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  // Éviter l'erreur d'hydratation en ne rendant rien jusqu'à ce que le composant soit monté
  if (!mounted || !timeLeft) {
    return (
      <div className={`bg-primary text-primary-foreground text-sm px-3 py-2 rounded ${className}`}>
        {expired ? "Promotion expirée" : "Chargement..."}
      </div>
    )
  }

  if (expired) {
    return (
      <div className={`bg-primary text-primary-foreground text-sm px-3 py-2 rounded ${className}`}>
        Promotion expirée
      </div>
    )
  }

  return (
    <div className={`bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-primary-foreground">{String(timeLeft.days).padStart(2, "0")}</span>
        <span className="text-sm text-primary-foreground/90">j</span>
      </div>
      <span className="text-primary-foreground/80">:</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-primary-foreground">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="text-sm text-primary-foreground/90">h</span>
      </div>
      <span className="text-primary-foreground/80">:</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-primary-foreground">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="text-sm text-primary-foreground/90">m</span>
      </div>
      <span className="text-primary-foreground/80">:</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-primary-foreground">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="text-sm text-primary-foreground/90">s</span>
      </div>
    </div>
  )
}
