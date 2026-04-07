import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createPartnerSchema } from "@/lib/validations/partner"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(partners)
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const data = createPartnerSchema.parse(body)

    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        logo: data.logo || null,
        contact: data.contact || null,
        commissionRate: data.commissionRate,
        isActive: data.isActive,
      },
    })

    await logActivity("CREATE", "Partner", partner.id, {
      name: partner.name,
    })

    return NextResponse.json(partner, { status: 201 })
  } catch (error: any) {
    console.error("Error creating partner:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    )
  }
}
