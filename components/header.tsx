"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search, Menu, X, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useCart } from "@/components/shop/cart-context"
import { useWishlist } from "@/components/shop/wishlist-context"
import { useRouter } from "next/navigation"
import { CategoriesDropdown } from "@/components/categories-dropdown"
import { HeaderTopBar } from "@/components/header-topbar"

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Boutique", href: "/boutique" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const { getItemCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const router = useRouter()

  // Éviter l'erreur d'hydratation en ne rendant le badge qu'après le montage
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get item count only after mount to avoid hydration mismatch
  // Don't call getItemCount() before mount to avoid accessing localStorage during SSR
  const itemCount = mounted ? getItemCount() : 0

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/boutique?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent, query: string) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border" suppressHydrationWarning>
      {/* Top bar */}
      <HeaderTopBar />

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative h-14 w-auto">
              <Image
                src="/logo.png"
                alt="Caroline Logistics"
                width={200}
                height={56}
                className="h-14 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation - desktop */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            <CategoriesDropdown variant="desktop" />
            <Link
              href="/promotions"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Promotions
            </Link>
          </nav>

          {/* Search bar - desktop */}
          <form
            className="hidden md:flex flex-1 max-w-md lg:max-w-xl"
            onSubmit={(e) => handleSearchSubmit(e, searchQuery)}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="hidden sm:flex relative" asChild>
              <Link href="/wishlist">
                <Heart className="w-5 h-5" />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/checkout">
                <ShoppingCart className="w-5 h-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile search */}
            <form
              className="relative mb-4"
              onSubmit={(e) => {
                handleSearchSubmit(e, mobileSearchQuery)
                setMobileMenuOpen(false)
              }}
            >
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <CategoriesDropdown
                variant="mobile"
                onItemClick={() => setMobileMenuOpen(false)}
              />
              <Link
                href="/promotions"
                className="text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Promotions
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
