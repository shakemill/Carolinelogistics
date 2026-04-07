"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWishlist } from "@/components/shop/wishlist-context"
import { useEffect, useState } from "react"
import { Heart, ShoppingCart, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getProductUrl } from "@/lib/utils"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  category: { name: string } | null
  stock: number
  isPartner?: boolean
  externalLink?: string | null
  pricing?: {
    price: number
    originalPrice: number
    promotionId: string | null
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
}

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchProducts = async () => {
      try {
        const promises = items.map(async (id) => {
          const res = await fetch(`/api/products/${id}`)
          const product = await res.json()
          if (product && !product.error) {
            // Get pricing with promotions
            try {
              const pricingRes = await fetch(`/api/products/pricing?productId=${id}`)
              const pricing = await pricingRes.json()
              return { ...product, pricing }
            } catch {
              return product
            }
          }
          return null
        })
        const results = await Promise.all(promises)
        setProducts(results.filter((p) => p && !p.error))
      } catch (error) {
        console.error("Error fetching wishlist products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [items])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-muted-foreground">Chargement...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[
            { label: "Liste de souhaits" }
          ]} className="mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-8">Ma liste de souhaits</h1>

          {products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Votre liste de souhaits est vide
                </p>
                <Button asChild>
                  <Link href="/boutique">Découvrir nos produits</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group">
                  <Link href={getProductUrl(product)}>
                    <div className="relative aspect-square bg-muted">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={Array.isArray(product.images) ? product.images[0] : "/placeholder.jpg"}
                          alt={product.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {product.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      {product.category?.name || "Sans catégorie"}
                    </p>
                    <Link href={getProductUrl(product)}>
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary">
                        {formatPrice(product.pricing?.price || product.price)}
                        {product.pricing?.originalPrice && product.pricing.originalPrice > product.pricing.price && (
                          <span className="text-xs text-muted-foreground line-through ml-2">
                            {formatPrice(product.pricing.originalPrice)}
                          </span>
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(product.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {product.isPartner && product.externalLink ? (
                      <Button className="w-full" size="sm" asChild>
                        <a
                          href={product.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir sur le site partenaire
                        </a>
                      </Button>
                    ) : (
                      <AddToCartButton
                        productId={product.id}
                        title={product.title}
                        price={product.pricing?.price || product.price}
                        image={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined}
                        size="sm"
                        className="w-full"
                        disabled={product.stock === 0}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
