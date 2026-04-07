"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/shop/cart-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Truck, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart, updateQuantity, removeItem } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedZone, setSelectedZone] = useState("")
  const [deliveryZones, setDeliveryZones] = useState<any[]>([])
  const [deliveryCost, setDeliveryCost] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  })
  const [phoneCountryCode, setPhoneCountryCode] = useState("+33")
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      router.push("/boutique")
      return
    }

    // Fetch delivery zones
    fetch("/api/delivery/zones")
      .then((res) => res.json())
      .then((data) => {
        setDeliveryZones(data.filter((z: any) => z.isActive))
      })
      .catch(console.error)
  }, [items, router])

  useEffect(() => {
    if (selectedZone) {
      fetch(`/api/delivery/calculate?zone=${selectedZone}`)
        .then((res) => res.json())
        .then((data) => {
          setDeliveryCost(data.price || 0)
        })
        .catch(console.error)
    } else {
      setDeliveryCost(0)
    }
  }, [selectedZone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const fullPhone = `${phoneCountryCode}${formData.phone.replace(/\s/g, "")}`
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerInfo: { ...formData, phone: fullPhone, phoneCountryCode },
          shippingZone: selectedZone,
          shippingCost: deliveryCost,
          total: getTotal() + deliveryCost,
        }),
      })

      const data = await response.json()

      if (response.ok && data.orderId) {
        // Create Stripe checkout session
        const stripeResponse = await fetch("/api/checkout/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            amount: getTotal() + deliveryCost,
          }),
        })

        const stripeData = await stripeResponse.json()

        if (stripeData.url) {
          // Redirect to Stripe checkout
          window.location.href = stripeData.url
        } else {
          const msg = stripeData.error || "Failed to create checkout session"
          const details = stripeData.details ? ` — ${stripeData.details}` : ""
          toast({
            title: "Erreur lors de la commande",
            description: msg + details,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Erreur lors de la commande",
          description: data.error || "Impossible de créer la commande.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      const message = error?.message || "Une erreur inattendue s'est produite."
      toast({
        title: "Erreur lors de la commande",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const subtotal = getTotal()
  const total = subtotal + deliveryCost

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[
            { label: "Boutique", href: "/boutique" },
            { label: "Checkout" }
          ]} className="mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de livraison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone *</Label>
                        <div className="flex gap-2">
                          <select
                            id="phone-country"
                            value={phoneCountryCode}
                            onChange={(e) => setPhoneCountryCode(e.target.value)}
                            className="h-10 w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <option value="+33">🇫🇷 +33</option>
                            <option value="+32">🇧🇪 +32</option>
                            <option value="+41">🇨🇭 +41</option>
                            <option value="+212">🇲🇦 +212</option>
                            <option value="+213">🇩🇿 +213</option>
                            <option value="+228">🇹🇬 +228</option>
                            <option value="+223">🇲🇱 +223</option>
                            <option value="+221">🇸🇳 +221</option>
                            <option value="+225">🇨🇮 +225</option>
                            <option value="+226">🇧🇫 +226</option>
                            <option value="+227">🇳🇪 +227</option>
                            <option value="+229">🇧🇯 +229</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+49">🇩🇪 +49</option>
                            <option value="+39">🇮🇹 +39</option>
                            <option value="+34">🇪🇸 +34</option>
                            <option value="+351">🇵🇹 +351</option>
                            <option value="+237">🇨🇲 +237</option>
                            <option value="+242">🇨🇬 +242</option>
                            <option value="+243">🇨🇩 +243</option>
                            <option value="+261">🇲🇬 +261</option>
                            <option value="+262">🇷🇪 +262</option>
                            <option value="+230">🇲🇺 +230</option>
                          </select>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            placeholder="6 12 34 56 78"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Adresse *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Zone de livraison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {deliveryZones.map((zone) => (
                        <label
                          key={zone.id}
                          className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted"
                        >
                          <input
                            type="radio"
                            name="zone"
                            value={zone.id}
                            checked={selectedZone === zone.id}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            className="accent-primary"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{zone.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatPrice(zone.price)}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Panier</CardTitle>
                    {items.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmClearOpen(true)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Vider
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {items.map((item) => {
                        const imageSrc = item.image 
                          ? (item.image.startsWith("http") || item.image.startsWith("/") 
                              ? item.image 
                              : `/${item.image}`)
                          : "/placeholder.svg"
                        
                        return (
                          <div key={item.productId} className="flex gap-3 pb-4 border-b border-border last:border-0">
                            {/* Image */}
                            <Link href={`/boutique/${item.productId}`} className="flex-shrink-0">
                              <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
                                <Image
                                  src={imageSrc}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </Link>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <Link href={`/boutique/${item.productId}`}>
                                <h3 className="font-medium text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatPrice(item.price)} chacun
                              </p>

                              {/* Quantity controls */}
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1 border border-border rounded-md">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        updateQuantity(item.productId, item.quantity - 1)
                                      } else {
                                        removeItem(item.productId)
                                      }
                                    }}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => removeItem(item.productId)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex-shrink-0 text-right">
                              <p className="font-semibold text-foreground">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span className="text-foreground">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="text-foreground">
                          {deliveryCost > 0 ? formatPrice(deliveryCost) : "À sélectionner"}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !selectedZone || items.length === 0}
                    >
                      {loading ? "Traitement..." : "Procéder au paiement"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Vous serez redirigé vers Stripe pour le paiement sécurisé
                    </p>

                    {/* Payment methods accepted */}
                    <div className="border-t border-border pt-4 mt-4">
                      <p className="text-xs text-muted-foreground mb-3 text-center">
                        Moyens de paiement acceptés
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {/* Visa */}
                        <div className="flex items-center justify-center w-12 h-8 bg-white rounded border border-border shadow-sm px-1.5">
                          <span className="text-[10px] font-bold text-[#1434CB] tracking-tight">Visa</span>
                        </div>
                        
                        {/* Mastercard */}
                        <div className="flex items-center justify-center w-12 h-8 bg-white rounded border border-border shadow-sm">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#EB001B] -mr-3"></div>
                            <div className="w-6 h-6 rounded-full bg-[#F79E1B]"></div>
                          </div>
                        </div>
                        
                        {/* American Express */}
                        <div className="flex items-center justify-center w-12 h-8 bg-white rounded border border-border shadow-sm">
                          <span className="text-[9px] font-bold text-[#006FCF]">AMEX</span>
                        </div>
                        
                        {/* Generic Card Icon */}
                        <div className="flex items-center justify-center w-12 h-8 bg-muted rounded border border-border">
                          <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                            <rect width="32" height="20" rx="2" fill="#1A1F71"/>
                            <rect x="4" y="6" width="6" height="4" rx="1" fill="white"/>
                            <rect x="12" y="6" width="16" height="4" rx="1" fill="white"/>
                            <rect x="4" y="12" width="8" height="2" rx="1" fill="#8B9DC3"/>
                            <rect x="4" y="15" width="12" height="2" rx="1" fill="#8B9DC3"/>
                          </svg>
                        </div>
                        
                        {/* PayPal */}
                        <div className="flex items-center justify-center w-12 h-8 bg-white rounded border border-border shadow-sm px-1">
                          <svg className="w-9 h-5" viewBox="0 0 24 24" fill="#003087">
                            <path d="M20.067 8.27c.086.57.075 1.34-.032 2.2-.12.94-.42 1.88-.936 2.717-.526.85-1.275 1.558-2.238 2.105-.99.56-2.15.876-3.4.876H12.3l-.595 3.763a1.23 1.23 0 0 1-1.212 1.014H8.58a.96.96 0 0 1-.944-.792L4.35 2.77A.96.96 0 0 1 5.294 1.8h5.722c1.892 0 3.105.404 3.736 1.238.63.834.78 1.966.435 3.392z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-3">
                        <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.905 0-4.357-.927-5.93-1.763L4.35 24c1.732.888 4.357 1.444 6.953 1.444 2.532 0 4.735-.624 6.283-1.813 1.583-1.188 2.467-3.169 2.467-5.298 0-4.532-2.692-6.249-6.977-7.183h.001z"/>
                        </svg>
                        <p className="text-xs text-center text-muted-foreground">
                          Paiement sécurisé par Stripe
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />

      <ConfirmDialog
        open={confirmClearOpen}
        title="Vider le panier"
        message="Êtes-vous sûr de vouloir vider le panier ?"
        confirmLabel="Vider"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={() => {
          clearCart()
          setConfirmClearOpen(false)
        }}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  )
}
