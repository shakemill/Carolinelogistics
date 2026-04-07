import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, customerInfo, shippingZone, shippingCost, total } = body

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        total,
        shippingCost,
        shippingZone,
        customerInfo,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber })
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    )
  }
}
