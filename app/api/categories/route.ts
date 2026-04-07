import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createCategorySchema } from "@/lib/validations/category"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const data = createCategorySchema.parse(body)

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Ce slug existe déjà" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
        image: data.image || null,
        description: data.description || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    })

    await logActivity("CREATE", "Category", category.id, {
      name: category.name,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error("Error creating category:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
