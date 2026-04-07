"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { TikTokIcon } from "@/components/tiktok-icon"
import { useEffect, useState } from "react"

interface SocialUrls {
  facebookUrl?: string | null
  twitterUrl?: string | null
  instagramUrl?: string | null
  linkedinUrl?: string | null
  tiktokUrl?: string | null
}

export function FooterSocialLinks() {
  const [socialUrls, setSocialUrls] = useState<SocialUrls | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSocialUrls(data))
      .catch(() => setSocialUrls(null))
  }, [])

  const hasAny = socialUrls?.facebookUrl || socialUrls?.instagramUrl || socialUrls?.twitterUrl || socialUrls?.linkedinUrl || socialUrls?.tiktokUrl
  if (!hasAny) return null

  const linkClass = "w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors shrink-0"
  const iconClass = "w-5 h-5"

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-background/90 mb-2">Suivez-nous</p>
      <div className="flex flex-wrap gap-3">
        {socialUrls?.facebookUrl && (
          <Link href={socialUrls.facebookUrl} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="Facebook">
            <Facebook className={iconClass} />
          </Link>
        )}
        {socialUrls?.instagramUrl && (
          <Link href={socialUrls.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="Instagram">
            <Instagram className={iconClass} />
          </Link>
        )}
        {socialUrls?.twitterUrl && (
          <Link href={socialUrls.twitterUrl!} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="Twitter">
            <Twitter className={iconClass} />
          </Link>
        )}
        {socialUrls?.linkedinUrl && (
          <Link href={socialUrls.linkedinUrl} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="LinkedIn">
            <Linkedin className={iconClass} />
          </Link>
        )}
        {socialUrls?.tiktokUrl && (
          <Link href={socialUrls.tiktokUrl.trim()} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="TikTok">
            <TikTokIcon className={iconClass} />
          </Link>
        )}
      </div>
    </div>
  )
}
