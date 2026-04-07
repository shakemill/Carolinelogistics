"use client"

import { ReactNode } from "react"

interface PartnerTrackedLinkProps {
  productId: string
  href: string
  children: ReactNode
  className?: string
}

/**
 * Client Component: external link that tracks partner product clicks.
 * Use this when rendering partner links from a Server Component (e.g. similar products grid).
 */
export function PartnerTrackedLink({ productId, href, children, className }: PartnerTrackedLinkProps) {
  const handleClick = async () => {
    try {
      await fetch(`/api/tracking/product/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "click" }),
      })
    } catch (error) {
      console.error("Failed to track click:", error)
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}
