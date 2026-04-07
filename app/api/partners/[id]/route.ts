import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { updatePartnerSchema } from "@/lib/validations/partner"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error("Error fetching partner:", error)
    return NextResponse.json(
      { error: "Failed to fetch partner" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const data = updatePartnerSchema.parse({ ...body, id })

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo !== undefined ? data.logo : undefined,
        contact: data.contact !== undefined ? data.contact : undefined,
        commissionRate: data.commissionRate,
        isActive: data.isActive,
      },
    })

    await logActivity("UPDATE", "Partner", partner.id, {
      name: partner.name,
    })

    return NextResponse.json(partner)
  } catch (error: any) {
    console.error("Error updating partner:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])

    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        products: true,
      },
    })

    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      )
    }

    if (partner.products.length > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer un partenaire avec des produits" },
        { status: 400 }
      )
    }

    await prisma.partner.delete({
      where: { id },
    })

    await logActivity("DELETE", "Partner", id, {
      name: partner.name,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting partner:", error)
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 }
    )
  }
}
