import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    return NextResponse.json({ 
      success: true, 
      message: "Prisma connection OK",
      userCount 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
