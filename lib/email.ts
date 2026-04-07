import nodemailer from "nodemailer"

const host = process.env.SMTP_HOST || "mail89.lwspanel.com"
const port = parseInt(process.env.SMTP_PORT || "465", 10)
const user = process.env.SMTP_USER || process.env.SMTP_EMAIL
const pass = process.env.SMTP_PASS

const transporter =
  user && pass
    ? nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      })
    : null

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string
  subject: string
  html?: string
  text?: string
  replyTo?: string
}) {
  if (!transporter) {
    console.warn("SMTP non configuré (SMTP_USER/SMTP_PASS manquants). Email non envoyé.")
    return { ok: false, error: "Email non configuré" }
  }

  // LWS/cPanel exigent souvent que l'expéditeur = utilisateur SMTP authentifié
  const fromEmail = (user || process.env.SMTP_FROM || "contact@carolinelogistics.fr")
    .trim()
    .toLowerCase()
  if (!fromEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
    console.warn("Adresse expéditeur invalide:", JSON.stringify(fromEmail))
    return { ok: false, error: "Configuration email invalide" }
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html: html || text,
      text: text || (html ? html.replace(/<[^>]*>/g, "") : undefined),
      replyTo,
    })
    return { ok: true }
  } catch (err: any) {
    console.error("Erreur envoi email:", err)
    return { ok: false, error: err?.message || "Erreur envoi email" }
  }
}
