import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const heroSlideSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional(),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const slide = await prisma.heroSlide.findUnique({
      where: { id },
    })
    if (!slide) {
      return NextResponse.json({ error: "Slide non trouvé" }, { status: 404 })
    }
    return NextResponse.json(slide)
  } catch (error: any) {
    console.error("Error fetching hero slide:", error)
    return NextResponse.json(
      { error: "Failed to fetch hero slide" },
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
    const { id } = await Promise.resolve(params)
    const body = await req.json()
    const data = heroSlideSchema.parse(body)

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.ctaText !== undefined && { ctaText: data.ctaText }),
        ...(data.ctaLink !== undefined && { ctaLink: data.ctaLink }),
        ...(data.badge !== undefined && { badge: data.badge }),
        ...(data.order !== undefined && { sortOrder: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })

    return NextResponse.json(slide)
  } catch (error: any) {
    console.error("Error updating hero slide:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: "Failed to update hero slide" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const { id } = await Promise.resolve(params)

    await prisma.heroSlide.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting hero slide:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: "Failed to delete hero slide" },
      { status: 500 }
    )
  }
}
