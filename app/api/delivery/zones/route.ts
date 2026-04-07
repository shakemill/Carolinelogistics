import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createDeliveryZoneSchema } from "@/lib/validations/delivery"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(zones)
  } catch (error) {
    console.error("Error fetching delivery zones:", error)
    return NextResponse.json(
      { error: "Failed to fetch delivery zones" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const data = createDeliveryZoneSchema.parse(body)

    const zone = await prisma.deliveryZone.create({
      data: {
        name: data.name,
        price: data.price,
        isActive: data.isActive,
      },
    })

    await logActivity("CREATE", "DeliveryZone", zone.id, {
      name: zone.name,
    })

    return NextResponse.json(zone, { status: 201 })
  } catch (error: any) {
    console.error("Error creating delivery zone:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create delivery zone" },
      { status: 500 }
    )
  }
}
