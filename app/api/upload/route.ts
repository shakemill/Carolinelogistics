import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { getCurrentUser } from "@/lib/auth/session"
import { UserRole } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification de manière plus sûre
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      )
    }

    // Vérifier le rôle
    const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Accès refusé. Permissions insuffisantes." },
        { status: 403 }
      )
    }
    
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      )
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Le fichier est trop volumineux (max 5MB)" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), "public", "uploads", "products")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Sauvegarder le fichier
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Retourner l'URL publique
    const publicUrl = `/uploads/products/${filename}`

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier", details: error.message },
      { status: 500 }
    )
  }
}
