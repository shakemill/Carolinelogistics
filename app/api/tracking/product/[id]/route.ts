import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params)
    const productId = resolvedParams.id

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const { type } = await req.json()

    if (type !== "view" && type !== "click") {
      return NextResponse.json(
        { error: "Type must be 'view' or 'click'" },
        { status: 400 }
      )
    }

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: productId },
          { slug: productId },
        ],
      },
    })

    if (!product) {
      console.error(`Product not found for tracking: ${productId}`)
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Only track partner products
    if (!product.isPartner) {
      return NextResponse.json({ success: true, message: "Not a partner product, skipping tracking" })
    }

    const updateData =
      type === "view"
        ? { views: { increment: 1 } }
        : { clicks: { increment: 1 } }

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: updateData,
    })

    console.log(`Tracked ${type} for product ${product.id}: views=${updated.views}, clicks=${updated.clicks}`)

    return NextResponse.json({ 
      success: true, 
      productId: product.id,
      views: updated.views,
      clicks: updated.clicks,
    })
  } catch (error) {
    console.error("Error tracking product:", error)
    return NextResponse.json(
      { error: "Failed to track product" },
      { status: 500 }
    )
  }
}
