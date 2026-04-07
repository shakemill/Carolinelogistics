"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useWishlist } from "@/components/shop/wishlist-context"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export function WishlistButton({ 
  productId, 
  size = "icon", 
  variant = "outline",
  className 
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist()
  const inWishlist = isInWishlist(productId)

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => toggleItem(productId)}
      className={cn(
        className,
        inWishlist && "text-destructive hover:text-destructive"
      )}
      aria-label={inWishlist ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
    >
      <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
    </Button>
  )
}
