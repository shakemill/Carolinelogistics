import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"
import { logActivity } from "@/lib/utils/activity-log"
import { z } from "zod"

const settingsSchema = z.object({
  companyName: z.string().optional().nullable(),
  logo: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string()
      .refine((val) => !val || val.startsWith("http") || val.startsWith("/"), {
        message: "Le logo doit être une URL valide ou un chemin relatif",
      })
      .optional()
      .nullable()
  ),
  contactEmail: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().email().optional().nullable()
  ),
  contactPhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  defaultTva: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return null
      const num = Number(val)
      return isNaN(num) ? null : num
    },
    z.number().min(0).max(100).optional().nullable()
  ),
  currency: z.string().optional().nullable(),
  systemEmail: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().email().optional().nullable()
  ),
  facebookUrl: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().url().optional().nullable()
  ),
  twitterUrl: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().url().optional().nullable()
  ),
  instagramUrl: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().url().optional().nullable()
  ),
  linkedinUrl: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().url().optional().nullable()
  ),
  tiktokUrl: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().url().optional().nullable()
  ),
  defaultBlogImage: z.preprocess(
    (val) => (val === "" ? null : val),
    z
      .string()
      .refine((val) => !val || val.startsWith("http") || val.startsWith("/"), {
        message: "L'image doit être une URL valide ou un chemin relatif",
      })
      .optional()
      .nullable()
  ),
})

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: "main" },
    })

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.settings.create({
        data: {
          id: "main",
          companyName: "Caroline Logistic",
          currency: "EUR",
          defaultTva: 19.25,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireRole([UserRole.ADMIN])
    const body = await req.json()
    const data = settingsSchema.parse(body)

    const settings = await prisma.settings.upsert({
      where: { id: "main" },
      update: {
        companyName: data.companyName !== undefined ? data.companyName : undefined,
        logo: data.logo !== undefined ? data.logo : undefined,
        contactEmail: data.contactEmail !== undefined ? data.contactEmail : undefined,
        contactPhone: data.contactPhone !== undefined ? data.contactPhone : undefined,
        address: data.address !== undefined ? data.address : undefined,
        defaultTva: data.defaultTva !== undefined ? data.defaultTva : undefined,
        currency: data.currency !== undefined ? data.currency : undefined,
        systemEmail: data.systemEmail !== undefined ? data.systemEmail : undefined,
        facebookUrl: data.facebookUrl !== undefined ? data.facebookUrl : undefined,
        twitterUrl: data.twitterUrl !== undefined ? data.twitterUrl : undefined,
        instagramUrl: data.instagramUrl !== undefined ? data.instagramUrl : undefined,
        linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : undefined,
        tiktokUrl: data.tiktokUrl !== undefined ? data.tiktokUrl : undefined,
        defaultBlogImage: data.defaultBlogImage !== undefined ? data.defaultBlogImage : undefined,
      },
      create: {
        id: "main",
        companyName: data.companyName || "Caroline Logistic",
        logo: data.logo || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        address: data.address || null,
        defaultTva: data.defaultTva || 19.25,
        currency: data.currency || "EUR",
        systemEmail: data.systemEmail || null,
        facebookUrl: data.facebookUrl || null,
        twitterUrl: data.twitterUrl || null,
        instagramUrl: data.instagramUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        tiktokUrl: data.tiktokUrl || null,
        defaultBlogImage: data.defaultBlogImage || null,
      },
    })

    await logActivity("UPDATE", "Settings", settings.id, {
      companyName: settings.companyName,
    })

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error("Error updating settings:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
