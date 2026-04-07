import { auth } from "@/app/api/auth/[...nextauth]/route"
import { UserRole } from "@prisma/client"

export async function getSession() {
  try {
    const session = await auth()
    console.log("getSession result:", session ? "session found" : "no session")
    return session
  } catch (error) {
    console.error("getSession error:", error)
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session.user
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden")
  }
  return user
}
