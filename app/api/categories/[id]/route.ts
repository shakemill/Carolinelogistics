import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { updateCategorySchema } from "@/lib/validations/category"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params)
    const identifier = resolvedParams.id

    // Try to find by slug first, then by id
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: identifier },
          { id: identifier },
        ],
      },
      include: {
        parent: true,
        children: true,
        products: {
          take: 10,
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params)
    const categoryId = resolvedParams.id
    
    const data = updateCategorySchema.parse({ ...body, id: categoryId })

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if slug already exists (if changed)
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: data.slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: "Ce slug existe déjà" },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId !== undefined ? data.parentId : undefined,
        image: data.image !== undefined ? data.image : undefined,
        description: data.description !== undefined ? data.description : undefined,
        seoTitle: data.seoTitle !== undefined ? data.seoTitle : undefined,
        seoDescription: data.seoDescription !== undefined ? data.seoDescription : undefined,
      },
    })

    await logActivity("UPDATE", "Category", category.id, {
      name: category.name,
    })

    return NextResponse.json(category)
  } catch (error: any) {
    console.error("Error updating category:", error)
    if (error.name === "ZodError") {
      const validationErrors = error.errors.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      }))
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: validationErrors,
          message: validationErrors.map((e: any) => `${e.path}: ${e.message}`).join(', ')
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update category", details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        children: true,
        products: true,
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if category has children
    if (category.children.length > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer une catégorie avec des sous-catégories" },
        { status: 400 }
      )
    }

    // Check if category has products
    if (category.products.length > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer une catégorie avec des produits" },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id },
    })

    await logActivity("DELETE", "Category", params.id, {
      name: category.name,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
