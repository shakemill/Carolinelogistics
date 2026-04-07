"use client"

import { useSession } from "next-auth/react"
import { UserRole } from "@prisma/client"

export function useAuth() {
  const { data: session, status } = useSession()

  const user = session?.user
  const isAuthenticated = !!user
  const isLoading = status === "loading"

  const hasRole = (role: UserRole) => {
    return user?.role === role
  }

  const hasAnyRole = (roles: UserRole[]) => {
    return user?.role && roles.includes(user.role)
  }

  const isAdmin = hasRole("ADMIN")
  const isManager = hasRole("MANAGER")
  const isStaff = hasRole("STAFF")

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
    isStaff,
  }
}
