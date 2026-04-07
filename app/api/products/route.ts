import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createProductSchema } from "@/lib/validations/product"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const categoryId = searchParams.get("categoryId")
    const isPartner = searchParams.get("isPartner")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const where: any = {
      isActive: true,
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (isPartner !== null) {
      where.isPartner = isPartner === "true"
    }

    if (search) {
      // MySQL: contains is case-insensitive by default
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Construire l'objet orderBy
    const orderBy: any = {}
    const validSortFields = ["title", "price", "stock", "createdAt", "updatedAt", "categoryId", "isPartner", "isFeatured"]
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt"
    orderBy[sortField] = sortOrder === "asc" ? "asc" : "desc"

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          partner: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF])
    const body = await req.json()
    const data = createProductSchema.parse(body)

    // Générer le slug si non fourni
    let slug = data.slug
    if (!slug && data.title) {
      slug = data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: slug || null,
        description: data.description || null,
        price: data.price,
        dimensions: data.dimensions || null,
        weight: data.weight || null,
        stock: data.stock,
        tva: data.tva || null,
        images: data.images || [],
        categoryId: data.categoryId || null,
        isPartner: data.isPartner,
        partnerId: data.partnerId || null,
        externalLink: data.externalLink || null,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
      include: {
        category: true,
        partner: true,
      },
    })

    await logActivity("CREATE", "Product", product.id, {
      title: product.title,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
