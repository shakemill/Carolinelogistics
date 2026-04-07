"use client"

import { useState, useEffect } from "react"
import { Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { TikTokIcon } from "@/components/tiktok-icon"
import Link from "next/link"

interface SocialUrls {
  facebookUrl?: string | null
  twitterUrl?: string | null
  instagramUrl?: string | null
  linkedinUrl?: string | null
  tiktokUrl?: string | null
}

export function HeaderTopBar() {
  const [socialUrls, setSocialUrls] = useState<SocialUrls | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSocialUrls(data))
      .catch(() => setSocialUrls(null))
  }, [])

  return (
    <div className="bg-primary text-primary-foreground py-2 text-xs sm:text-sm">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <a href="tel:+33745223664" className="flex items-center gap-1.5 hover:underline">
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">+33 7 45 22 36 64</span>
          </a>
          <a href="tel:+33760270890" className="flex items-center gap-1.5 hover:underline hidden md:flex">
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>+33 7 60 27 08 90</span>
          </a>
          <a href="mailto:infocarolinelogistics@gmail.com" className="flex items-center gap-1.5 hover:underline">
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden lg:inline">infocarolinelogistics@gmail.com</span>
          </a>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {socialUrls?.facebookUrl && (
            <Link
              href={socialUrls.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </Link>
          )}
          {socialUrls?.instagramUrl && (
            <Link
              href={socialUrls.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </Link>
          )}
          {socialUrls?.twitterUrl && (
            <Link
              href={socialUrls.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </Link>
          )}
          {socialUrls?.linkedinUrl && (
            <Link
              href={socialUrls.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </Link>
          )}
          {socialUrls?.tiktokUrl && (
            <Link
              href={socialUrls.tiktokUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
