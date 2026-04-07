import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { logActivity } from "@/lib/utils/activity-log"

export async function POST() {
  const session = await auth()
  
  if (session?.user) {
    await logActivity("LOGOUT", "User", session.user.id)
  }

  return NextResponse.json({ success: true })
}
