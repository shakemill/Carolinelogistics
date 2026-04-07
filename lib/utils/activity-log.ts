import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth/session"

export type ActivityAction = "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "LOGIN" | "LOGOUT" | "EXPORT"

export async function logActivity(
  action: ActivityAction,
  entity: string,
  entityId?: string,
  details?: Record<string, any>
) {
  try {
    const user = await getCurrentUser()
    if (!user) return

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action,
        entity,
        entityId: entityId || null,
        details: details || {},
      },
    })
  } catch (error) {
    // Silently fail - logging should not break the app
    console.error("Failed to log activity:", error)
  }
}
