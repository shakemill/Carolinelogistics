import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    // Require admin or manager role
    await requireRole([UserRole.ADMIN, UserRole.MANAGER])

    // Get all subscribers
    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    })

    // Generate CSV
    const headers = ["Email", "Consentement", "Date d'inscription"]
    const rows = subscribers.map((sub) => [
      sub.email,
      sub.consent ? "Oui" : "Non",
      sub.createdAt.toISOString().split("T")[0],
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error: any) {
    console.error("Error exporting newsletter subscribers:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: "Failed to export subscribers" },
      { status: 500 }
    )
  }
}
