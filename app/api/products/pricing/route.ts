import { NextRequest, NextResponse } from "next/server"
import { getProductPriceWithPromotion } from "@/lib/utils/promotions"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      )
    }

    const pricing = await getProductPriceWithPromotion(productId)
    return NextResponse.json(pricing)
  } catch (error: any) {
    console.error("Error fetching product pricing:", error)
    return NextResponse.json(
      { error: "Failed to fetch product pricing", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productIds } = await req.json()

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "productIds must be an array" },
        { status: 400 }
      )
    }

    const pricingMap: Record<string, any> = {}

    await Promise.all(
      productIds.map(async (productId: string) => {
        try {
          const pricing = await getProductPriceWithPromotion(productId)
          pricingMap[productId] = pricing
        } catch (error) {
          console.error(`Error fetching pricing for product ${productId}:`, error)
          pricingMap[productId] = null
        }
      })
    )

    return NextResponse.json(pricingMap)
  } catch (error) {
    console.error("Error fetching product pricing:", error)
    return NextResponse.json(
      { error: "Failed to fetch product pricing" },
      { status: 500 }
    )
  }
}
