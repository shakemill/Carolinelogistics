import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { prisma } from "@/lib/db/prisma"
import { getProductPriceWithPromotion } from "@/lib/utils/promotions"
import { CountdownTimer } from "@/components/shop/countdown-timer"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Percent, Tag } from "lucide-react"
import { getProductUrl } from "@/lib/utils"
import { format } from "date-fns"

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
}

function getPromotionTypeLabel(type: string) {
  const labels: Record<string, string> = {
    HOT_DEAL: "Hot Deal",
    WEEKLY: "Promo Hebdo",
    PRODUCT: "Produit",
    CATEGORY: "Catégorie",
  }
  return labels[type] || type
}

async function getActivePromotions() {
  const now = new Date()
  
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      products: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { endDate: "asc" },
  })

  // Get products with pricing for each promotion
  const promotionsWithProducts = await Promise.all(
    promotions.map(async (promo) => {
      const productIds = promo.products.map((pp) => pp.product.id)
      const productsWithPricing = await Promise.all(
        productIds.map(async (productId) => {
          const pricing = await getProductPriceWithPromotion(productId)
          const product = promo.products.find((pp) => pp.product.id === productId)?.product
          return product ? { ...product, pricing } : null
        })
      )

      return {
        ...promo,
        productsWithPricing: productsWithPricing.filter((p) => p !== null),
      }
    })
  )

  return promotionsWithProducts
}

export default async function PromotionsPage() {
  const promotions = await getActivePromotions()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Promotions" }]} />
        </div>

        {/* Page Header */}
        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Percent className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Nos Promotions</h1>
                <p className="text-muted-foreground mt-1">Profitez de nos offres exclusives</p>
              </div>
            </div>
          </div>
        </section>

        {/* Promotions List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {promotions.length === 0 ? (
              <div className="text-center py-16">
                <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Aucune promotion active</h2>
                <p className="text-muted-foreground mb-6">
                  Revenez bientôt pour découvrir nos prochaines offres !
                </p>
                <Button asChild>
                  <Link href="/boutique">Voir la boutique</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-12">
                {promotions.map((promotion) => {
                  const discountText =
                    promotion.discountType === "PERCENTAGE"
                      ? `-${promotion.discountValue}%`
                      : `-${formatPrice(promotion.discountValue)}`

                  return (
                    <div
                      key={promotion.id}
                      className="bg-card border border-border rounded-2xl p-6 md:p-8 overflow-hidden"
                    >
                      {/* Promotion Header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                              {getPromotionTypeLabel(promotion.type)}
                            </span>
                            <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm font-bold rounded-full">
                              {discountText}
                            </span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            {promotion.name}
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              Du {format(new Date(promotion.startDate), "dd MMM yyyy")} au{" "}
                              {format(new Date(promotion.endDate), "dd MMM yyyy")}
                            </span>
                            <CountdownTimer endDate={promotion.endDate} />
                          </div>
                        </div>
                      </div>

                      {/* Products Grid */}
                      {promotion.productsWithPricing.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                          {promotion.productsWithPricing.map((product: any) => (
                            <Link
                              key={product.id}
                              href={getProductUrl(product)}
                              className="group bg-muted rounded-xl overflow-hidden hover:shadow-xl transition-all"
                            >
                              <div className="relative aspect-square bg-background">
                                {product.images && product.images.length > 0 ? (
                                  <Image
                                    src={
                                      typeof product.images[0] === "string"
                                        ? product.images[0]
                                        : product.images[0].url || "/placeholder.jpg"
                                    }
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-primary">
                                      {product.title.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                  {discountText}
                                </div>
                              </div>
                              <div className="p-4">
                                <p className="text-xs text-muted-foreground mb-1">
                                  {product.category?.name || "Sans catégorie"}
                                </p>
                                <h3 className="font-medium text-foreground line-clamp-2 text-sm mb-2 group-hover:text-primary transition-colors">
                                  {product.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-primary">
                                    {formatPrice(product.pricing?.price || product.price)}
                                  </span>
                                  {product.pricing?.originalPrice &&
                                    product.pricing.originalPrice > product.pricing.price && (
                                      <span className="text-xs text-muted-foreground line-through">
                                        {formatPrice(product.pricing.originalPrice)}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : promotion.categories.length > 0 ? (
                        <div className="bg-muted/50 rounded-xl p-6">
                          <p className="text-muted-foreground mb-4">
                            Cette promotion s&apos;applique aux catégories suivantes :
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {promotion.categories.map((pc) => (
                              <Link
                                key={pc.category.id}
                                href={`/categories/${pc.category.slug || pc.category.id}`}
                                className="px-4 py-2 bg-background rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                {pc.category.name}
                              </Link>
                            ))}
                          </div>
                          <Button asChild className="mt-4">
                            <Link href="/boutique">Voir les produits</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Aucun produit associé à cette promotion
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
