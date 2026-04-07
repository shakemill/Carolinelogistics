import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { updateDeliveryZoneSchema } from "@/lib/validations/delivery"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params)
    const zoneId = resolvedParams.id

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

    return NextResponse.json(zone)
  } catch (error) {
    console.error("Error fetching delivery zone:", error)
    return NextResponse.json(
      { error: "Failed to fetch delivery zone" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params)
    const zoneId = resolvedParams.id

    if (!zoneId) {
      return NextResponse.json(
        { error: "Zone ID is required" },
        { status: 400 }
      )
    }

    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const data = updateDeliveryZoneSchema.parse({ ...body, id: zoneId })

    const zone = await prisma.deliveryZone.update({
      where: { id: zoneId },
      data: {
        name: data.name,
        price: data.price,
        isActive: data.isActive,
      },
    })

    await logActivity("UPDATE", "DeliveryZone", zone.id, {
      name: zone.name,
    })

    return NextResponse.json(zone)
  } catch (error: any) {
    console.error("Error updating delivery zone:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update delivery zone" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params)
    const zoneId = resolvedParams.id

    if (!zoneId) {
      return NextResponse.json(
        { error: "Zone ID is required" },
        { status: 400 }
      )
    }

    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])

    const zone = await prisma.deliveryZone.findUnique({
      where: { id: zoneId },
    })

    if (!zone) {
      return NextResponse.json(
        { error: "Delivery zone not found" },
        { status: 404 }
      )
    }

    await prisma.deliveryZone.delete({
      where: { id: zoneId },
    })

    await logActivity("DELETE", "DeliveryZone", zoneId, {
      name: zone.name,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting delivery zone:", error)
    return NextResponse.json(
      { error: "Failed to delete delivery zone" },
      { status: 500 }
    )
  }
}
