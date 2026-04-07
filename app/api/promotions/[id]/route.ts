import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { updatePromotionSchema } from "@/lib/validations/promotion"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const promotion = await prisma.promotion.findUnique({
      where: { id },
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
    })

    if (!promotion) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Error fetching promotion:", error)
    return NextResponse.json(
      { error: "Failed to fetch promotion" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const data = updatePromotionSchema.parse({ ...body, id })

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        type: data.type,
        name: data.name,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        discountType: data.discountType,
        discountValue: data.discountValue,
        isActive: data.isActive,
      },
    })

    // Update product links
    if (data.productIds !== undefined) {
      await prisma.promotionProduct.deleteMany({
        where: { promotionId: id },
      })
      if (data.productIds.length > 0) {
        await prisma.promotionProduct.createMany({
          data: data.productIds.map((productId: string) => ({
            promotionId: id,
            productId,
          })),
        })
      }
    }

    // Update category links
    if (data.categoryIds !== undefined) {
      await prisma.promotionCategory.deleteMany({
        where: { promotionId: id },
      })
      if (data.categoryIds.length > 0) {
        await prisma.promotionCategory.createMany({
          data: data.categoryIds.map((categoryId: string) => ({
            promotionId: id,
            categoryId,
          })),
        })
      }
    }

    await logActivity("UPDATE", "Promotion", promotion.id, {
      name: promotion.name,
    })

    return NextResponse.json(promotion)
  } catch (error: any) {
    console.error("Error updating promotion:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])

    const promotion = await prisma.promotion.findUnique({
      where: { id },
    })

    if (!promotion) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      )
    }

    await prisma.promotion.delete({
      where: { id },
    })

    await logActivity("DELETE", "Promotion", id, {
      name: promotion.name,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting promotion:", error)
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    )
  }
}
