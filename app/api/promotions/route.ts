import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createPromotionSchema } from "@/lib/validations/promotion"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const active = searchParams.get("active")

    const where: any = {}
    if (active === "true") {
      const now = new Date()
      where.isActive = true
      where.startDate = { lte: now }
      where.endDate = { gte: now }
    }

    const promotions = await prisma.promotion.findMany({
      where,
      include: {
        products: {
          include: {
            product: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(promotions)
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const data = createPromotionSchema.parse(body)

    const promotion = await prisma.promotion.create({
      data: {
        type: data.type,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        discountType: data.discountType,
        discountValue: data.discountValue,
        isActive: data.isActive,
      },
    })

    // Link products if provided
    if (data.productIds && data.productIds.length > 0) {
      await prisma.promotionProduct.createMany({
        data: data.productIds.map((productId: string) => ({
          promotionId: promotion.id,
          productId,
        })),
      })
    }

    // Link categories if provided
    if (data.categoryIds && data.categoryIds.length > 0) {
      await prisma.promotionCategory.createMany({
        data: data.categoryIds.map((categoryId: string) => ({
          promotionId: promotion.id,
          categoryId,
        })),
      })
    }

    await logActivity("CREATE", "Promotion", promotion.id, {
      name: promotion.name,
    })

    return NextResponse.json(promotion, { status: 201 })
  } catch (error: any) {
    console.error("Error creating promotion:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 }
    )
  }
}
