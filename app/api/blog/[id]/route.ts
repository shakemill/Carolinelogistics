import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { updateBlogPostSchema } from "@/lib/validations/blog"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const post = await prisma.blogPost.findUnique({
      where: { id },
    })
    if (!post) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error: any) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
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
    const data = updateBlogPostSchema.parse({ ...body, id })

    const publishedAt =
      data.publishedAt !== undefined
        ? data.publishedAt
          ? new Date(data.publishedAt as string)
          : null
        : undefined

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.image !== undefined && { image: data.image }),
        ...(publishedAt !== undefined && { publishedAt }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })

    await logActivity("UPDATE", "BlogPost", post.id, { title: post.title })

    return NextResponse.json(post)
  } catch (error: any) {
    console.error("Error updating blog post:", error)
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
      { error: "Failed to update blog post" },
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

    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    await prisma.blogPost.delete({ where: { id } })
    await logActivity("DELETE", "BlogPost", id, { title: post.title })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting blog post:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    )
  }
}
