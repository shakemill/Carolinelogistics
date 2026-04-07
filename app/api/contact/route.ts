import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sendEmail } from "@/lib/email"
import { prisma } from "@/lib/db/prisma"

const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message trop court"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Données invalides" },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = parsed.data

    // Récupérer l'email de contact depuis les paramètres
    const settings = await prisma.settings.findUnique({
      where: { id: "main" },
      select: { contactEmail: true },
    })
    const toEmail = settings?.contactEmail || "contact@carolinelogistics.fr"

    const subjectLabel =
      subject === "order"
        ? "Question sur une commande"
        : subject === "product"
          ? "Information sur un produit"
          : subject === "delivery"
            ? "Livraison"
            : subject === "partnership"
              ? "Partenariat"
              : "Autre"

    const html = `
      <h2>Nouveau message depuis le formulaire de contact</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ""}
      <p><strong>Sujet :</strong> ${subjectLabel}</p>
      <p><strong>Message :</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `

    const result = await sendEmail({
      to: toEmail,
      subject: `[Contact] ${subjectLabel} - ${name}`,
      html,
      replyTo: email,
    })

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Erreur lors de l'envoi du message" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
