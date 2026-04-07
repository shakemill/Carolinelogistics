import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createBlogPostSchema } from "@/lib/validations/blog"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

// GET - Public: list published posts (or all if admin)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const admin = searchParams.get("admin") === "true"
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50)

    if (admin) {
      await requireRole([UserRole.ADMIN, UserRole.MANAGER])
      const posts = await prisma.blogPost.findMany({
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: limit,
      })
      return NextResponse.json(posts)
    }

    const posts = await prisma.blogPost.findMany({
      where: { isActive: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    })
    return NextResponse.json(posts)
  } catch (error: any) {
    console.error("Error fetching blog posts:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

// POST - Admin: create post
export async function POST(req: NextRequest) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const body = await req.json()
    const data = createBlogPostSchema.parse(body)

    const publishedAt = data.publishedAt
      ? new Date(data.publishedAt as string)
      : null

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? null,
        content: data.content ?? null,
        image: data.image ?? null,
        publishedAt,
        isActive: data.isActive ?? true,
      },
    })

    await logActivity("CREATE", "BlogPost", post.id, { title: post.title })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error("Error creating blog post:", error)
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
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}
