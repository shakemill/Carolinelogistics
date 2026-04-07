import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.MANAGER])
    const { id } = await Promise.resolve(params)

    // Check if subscriber exists
    const subscriber = await prisma.newsletter.findUnique({
      where: { id },
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: "Abonné non trouvé" },
        { status: 404 }
      )
    }

    // Delete subscriber
    await prisma.newsletter.delete({
      where: { id },
    })

    // Log activity
    await logActivity(user.id, "DELETE", "Newsletter", id, {
      email: subscriber.email,
    })

    return NextResponse.json({
      success: true,
      message: "Abonné supprimé avec succès",
    })
  } catch (error: any) {
    console.error("Error deleting newsletter subscriber:", error)
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    )
  }
}
