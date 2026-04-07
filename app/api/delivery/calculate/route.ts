import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const zoneId = searchParams.get("zone")

    if (!zoneId) {
      return NextResponse.json(
        { error: "Zone ID is required" },
        { status: 400 }
      )
    }

    const zone = await prisma.deliveryZone.findUnique({
      where: { id: zoneId },
    })

    if (!zone) {
      return NextResponse.json(
        { error: "Delivery zone not found" },
        { status: 404 }
      )
    }

    if (!zone.isActive) {
      return NextResponse.json(
        { error: "Delivery zone is not active" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      zoneId: zone.id,
      zoneName: zone.name,
      price: zone.price,
    })
  } catch (error) {
    console.error("Error calculating delivery:", error)
    return NextResponse.json(
      { error: "Failed to calculate delivery" },
      { status: 500 }
    )
  }
}
