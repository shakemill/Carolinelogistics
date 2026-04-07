import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const heroSlideSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().min(1, "L'image est requise"),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

// GET - Public: list active slides for homepage
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const admin = searchParams.get("admin") === "true"

    if (admin) {
      await requireRole([UserRole.ADMIN, UserRole.MANAGER])
      const slides = await prisma.heroSlide.findMany({
        orderBy: { sortOrder: "asc" },
      })
      return NextResponse.json(slides)
    }

    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(slides)
  } catch (error: any) {
    console.error("Error fetching hero slides:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: "Failed to fetch hero slides" },
      { status: 500 }
    )
  }
}

// POST - Admin: create slide
export async function POST(req: NextRequest) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const data = heroSlideSchema.parse(body)

    // Check if heroSlide model exists
    if (!prisma.heroSlide) {
      throw new Error("Prisma client not properly initialized. Please restart the development server.")
    }

    const maxOrder = await prisma.heroSlide.aggregate({
      _max: { sortOrder: true },
    })
    const sortOrder = data.order ?? (maxOrder._max.sortOrder ?? 0) + 1

    const slide = await prisma.heroSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle ?? null,
        description: data.description ?? null,
        image: data.image,
        ctaText: data.ctaText ?? null,
        ctaLink: data.ctaLink ?? null,
        badge: data.badge ?? null,
        sortOrder,
        isActive: data.isActive ?? true,
      },
    })

    return NextResponse.json(slide, { status: 201 })
  } catch (error: any) {
    console.error("Error creating hero slide:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    const message =
      process.env.NODE_ENV === "development"
        ? error?.message || String(error)
        : "Failed to create hero slide"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
