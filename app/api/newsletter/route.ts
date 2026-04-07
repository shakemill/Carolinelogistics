import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    // Require admin or manager role
    await requireRole([UserRole.ADMIN, UserRole.MANAGER])

    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * limit

    // Build where clause (MySQL: contains is case-insensitive by default)
    const where: any = {}
    if (search) {
      where.email = {
        contains: search,
      }
    }

    // Get subscribers with pagination
    const [subscribers, total] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.newsletter.count({ where }),
    ])

    // Get statistics
    const totalSubscribers = await prisma.newsletter.count()
    const withConsent = await prisma.newsletter.count({
      where: { consent: true },
    })
    
    // Get new subscribers from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const newSubscribers = await prisma.newsletter.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalSubscribers,
        withConsent,
        newSubscribers,
      },
    })
  } catch (error: any) {
    console.error("Error fetching newsletter subscribers:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    )
  }
}
