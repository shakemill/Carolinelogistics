import { prisma } from "@/lib/db/prisma"
import { DiscountType } from "@prisma/client"

export async function getProductPriceWithPromotion(
  productId: string
): Promise<{ price: number; originalPrice: number; promotionId: string | null }> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      promotions: {
        include: {
          promotion: true,
        },
      },
      category: {
        include: {
          promotions: {
            include: {
              promotion: true,
            },
          },
        },
      },
    },
  })

  if (!product) {
    throw new Error("Product not found")
  }

  const now = new Date()
  let bestPrice = product.price
  let bestPromotionId: string | null = null

  // Check product-specific promotions
  for (const promoProduct of product.promotions) {
    const promo = promoProduct.promotion
    if (
      promo.isActive &&
      promo.startDate <= now &&
      promo.endDate >= now
    ) {
      const discountedPrice = calculateDiscountedPrice(
        product.price,
        promo.discountType,
        promo.discountValue
      )
      if (discountedPrice < bestPrice) {
        bestPrice = discountedPrice
        bestPromotionId = promo.id
      }
    }
  }

  // Check category promotions
  if (product.category) {
    for (const promoCategory of product.category.promotions) {
      const promo = promoCategory.promotion
      if (
        promo.isActive &&
        promo.startDate <= now &&
        promo.endDate >= now
      ) {
        const discountedPrice = calculateDiscountedPrice(
          product.price,
          promo.discountType,
          promo.discountValue
        )
        if (discountedPrice < bestPrice) {
          bestPrice = discountedPrice
          bestPromotionId = promo.id
        }
      }
    }
  }

  return {
    price: bestPrice,
    originalPrice: product.price,
    promotionId: bestPromotionId,
  }
}

function calculateDiscountedPrice(
  originalPrice: number,
  discountType: DiscountType,
  discountValue: number
): number {
  if (discountType === "PERCENTAGE") {
    return originalPrice * (1 - discountValue / 100)
  } else {
    return Math.max(0, originalPrice - discountValue)
  }
}
