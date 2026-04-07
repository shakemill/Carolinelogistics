import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF])

    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params)
    const orderId = resolvedParams.id

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        user: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error fetching order:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const { status } = body

    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params)
    const orderId = resolvedParams.id

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const validStatuses = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    await logActivity("UPDATE", "Order", order.id, {
      status: order.status,
      orderNumber: order.orderNumber,
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error updating order:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}
