"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface WishlistContextType {
  items: string[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wishlist")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error("Error loading wishlist from localStorage:", e)
      }
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const addItem = (productId: string) => {
    setItems((prev) => {
      if (prev.includes(productId)) return prev
      return [...prev, productId]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((id) => id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return items.includes(productId)
  }

  const toggleItem = (productId: string) => {
    if (isInWishlist(productId)) {
      removeItem(productId)
    } else {
      addItem(productId)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        toggleItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
