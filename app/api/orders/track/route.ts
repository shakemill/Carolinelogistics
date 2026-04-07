import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

/**
 * GET /api/orders/track?orderNumber=ORD-xxx&email=client@example.com
 * Public: lookup order by order number + email (for customer tracking).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get("orderNumber")?.trim()
    const email = searchParams.get("email")?.trim().toLowerCase()

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Numéro de commande et email requis." },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
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

    if (!order) {
      return NextResponse.json(
        { error: "Aucune commande trouvée pour ce numéro." },
        { status: 404 }
      )
    }

    const customerInfo = order.customerInfo as { email?: string; name?: string; phone?: string; address?: string; city?: string } | null
    const orderEmail = (customerInfo?.email ?? "").toString().trim().toLowerCase()

    if (orderEmail !== email) {
      return NextResponse.json(
        { error: "Aucune commande trouvée pour ce numéro et cet email." },
        { status: 404 }
      )
    }

    // Return only fields needed for public tracking
    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      shippingCost: order.shippingCost,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        title: item.product?.title ?? "Produit",
        quantity: item.quantity,
        price: item.price,
      })),
    })
  } catch (error: any) {
    console.error("Error tracking order:", error)
    return NextResponse.json(
      { error: "Erreur lors de la recherche de la commande." },
      { status: 500 }
    )
  }
}
