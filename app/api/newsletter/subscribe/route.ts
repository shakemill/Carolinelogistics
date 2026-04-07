import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const subscribeSchema = z.object({
  email: z.string().email("Email invalide"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Le consentement est requis",
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, consent } = subscribeSchema.parse(body)

    // Check if email already exists
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà inscrit" },
        { status: 400 }
      )
    }

    const subscription = await prisma.newsletter.create({
      data: {
        email,
        consent,
      },
    })

    return NextResponse.json(
      { success: true, message: "Inscription réussie" },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error subscribing to newsletter:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    )
  }
}
