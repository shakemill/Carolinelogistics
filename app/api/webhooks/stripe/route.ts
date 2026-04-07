import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/db/prisma"
import { sendEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

async function sendOrderConfirmationEmail(order: {
  orderNumber: string
  total: number
  shippingCost: number
  customerInfo: unknown
  items: { quantity: number; price: number; product: { title: string } | null }[]
}) {
  const customerInfo = order.customerInfo as { email?: string; name?: string } | null
  const email = customerInfo?.email
  if (!email) return

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)

  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td>${i.product?.title ?? "Produit"} × ${i.quantity}</td><td>${formatPrice(i.price * i.quantity)}</td></tr>`
    )
    .join("")

  const html = `
    <h2>Merci pour votre commande</h2>
    <p>Bonjour ${customerInfo?.name || "Client"},</p>
    <p>Votre commande <strong>${order.orderNumber}</strong> a bien été confirmée.</p>
    <h3>Récapitulatif</h3>
    <table style="border-collapse: collapse; width: 100%;">
      ${itemsHtml}
      <tr><td>Livraison</td><td>${formatPrice(order.shippingCost)}</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>${formatPrice(order.total + order.shippingCost)}</strong></td></tr>
    </table>
    <p>Pour suivre votre commande : <a href="${process.env.NEXTAUTH_URL || "https://carolinelogistics.fr"}/suivi-commande">Suivi de commande</a></p>
    <p>L'équipe Caroline Logistic</p>
  `

  await sendEmail({
    to: email,
    subject: `Confirmation de commande ${order.orderNumber} - Caroline Logistic`,
    html,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.metadata?.orderId) {
        const order = await prisma.order.update({
          where: { id: session.metadata.orderId },
          data: { status: "CONFIRMED" },
          include: {
            items: { include: { product: { select: { title: true } } } },
          },
        })
        await sendOrderConfirmationEmail(order)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
