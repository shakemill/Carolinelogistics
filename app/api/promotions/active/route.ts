import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
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
            product: true,
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

    return NextResponse.json(promotions)
  } catch (error) {
    console.error("Error fetching active promotions:", error)
    return NextResponse.json(
      { error: "Failed to fetch active promotions" },
      { status: 500 }
    )
  }
}
