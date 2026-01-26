"use client"

import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Casque Audio Premium",
    category: "Électronique",
    price: 85000,
    originalPrice: 120000,
    rating: 4.8,
    reviews: 124,
    badge: "Promo",
    badgeColor: "bg-primary",
    image: "/images/products/headphones.jpg",
  },
  {
    id: 2,
    name: "Montre Connectée Pro",
    category: "Accessoires",
    price: 75000,
    originalPrice: null,
    rating: 4.5,
    reviews: 89,
    badge: "Nouveau",
    badgeColor: "bg-[#6ea935]",
    image: "/images/products/smartwatch.jpg",
  },
  {
    id: 3,
    name: "Sac Cuir Élégant",
    category: "Mode",
    price: 95000,
    originalPrice: 130000,
    rating: 4.7,
    reviews: 256,
    badge: "Bestseller",
    badgeColor: "bg-secondary",
    image: "/images/products/leather-bag.jpg",
  },
  {
    id: 4,
    name: "Set Soin Visage Premium",
    category: "Beauté",
    price: 45000,
    originalPrice: null,
    rating: 4.9,
    reviews: 312,
    badge: "Top Vente",
    badgeColor: "bg-secondary",
    image: "/images/products/skincare-set.jpg",
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
}

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Produits en Vedette</h2>
          <p className="text-muted-foreground mt-2">Découvrez nos meilleures sélections</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Badge */}
                {product.badge && (
                  <span className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs font-medium px-2 py-1 rounded`}>
                    {product.badge}
                  </span>
                )}
                {/* Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 bg-card rounded-full shadow flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-card rounded-full shadow flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <h3 className="font-medium text-foreground mt-1 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                  <span className="text-xs font-medium text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>
                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {/* Add to cart */}
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/boutique">Voir tous les produits</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
