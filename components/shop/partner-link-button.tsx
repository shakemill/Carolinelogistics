"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface PartnerLinkButtonProps {
  productId: string
  externalLink: string
}

export function PartnerLinkButton({ productId, externalLink }: PartnerLinkButtonProps) {
  const handleClick = async () => {
    // Track click
    try {
      await fetch(`/api/tracking/product/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "click" }),
      })
    } catch (error) {
      console.error("Failed to track click:", error)
    }
  }

  return (
    <Button
      size="lg"
      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
      asChild
    >
      <a
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <ExternalLink className="w-5 h-5 mr-2" />
        Voir sur le site partenaire
      </a>
    </Button>
  )
}
