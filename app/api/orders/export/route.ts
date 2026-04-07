import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.MANAGER])

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = {}
    if (status) {
      where.status = status
    }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Convert to CSV
    const headers = [
      "Numéro de commande",
      "Date",
      "Statut",
      "Client",
      "Email",
      "Téléphone",
      "Total",
      "Frais de livraison",
      "Zone de livraison",
      "Produits",
    ]

    const rows = orders.map((order) => {
      const customerInfo = order.customerInfo as any
      const products = order.items
        .map((item) => `${item.product.title} (x${item.quantity})`)
        .join("; ")

      return [
        order.orderNumber,
        order.createdAt.toISOString().split("T")[0],
        order.status,
        customerInfo?.name || "",
        customerInfo?.email || "",
        customerInfo?.phone || "",
        order.total.toString(),
        order.shippingCost.toString(),
        order.shippingZone || "",
        products,
      ]
    })

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error: any) {
    console.error("Error exporting orders:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: "Failed to export orders" },
      { status: 500 }
    )
  }
}
