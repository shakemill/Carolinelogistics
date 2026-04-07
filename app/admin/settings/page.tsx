"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { LogoUpload } from "@/components/admin/logo-upload"

interface Settings {
  companyName: string | null
  logo: string | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  defaultTva: number | null
  currency: string | null
  systemEmail: string | null
  facebookUrl: string | null
  twitterUrl: string | null
  instagramUrl: string | null
  linkedinUrl: string | null
  tiktokUrl: string | null
  defaultBlogImage: string | null
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    companyName: null,
    logo: null,
    contactEmail: null,
    contactPhone: null,
    address: null,
    defaultTva: null,
    currency: null,
    systemEmail: null,
    facebookUrl: null,
    twitterUrl: null,
    instagramUrl: null,
    linkedinUrl: null,
    tiktokUrl: null,
    defaultBlogImage: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings")
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        toast({
          variant: "success",
          title: "Paramètres sauvegardés",
          description: "Vos modifications ont été enregistrées avec succès.",
        })
      } else {
        const error = await res.json()
        toast({
          title: "Erreur",
          description: error.error || "Erreur lors de la sauvegarde",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Configuration de l'entreprise et paramètres généraux
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Informations générales de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input
                  id="companyName"
                  value={settings.companyName || ""}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Logo</Label>
                <LogoUpload
                  value={settings.logo || ""}
                  onChange={(url) => setSettings({ ...settings, logo: url })}
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={settings.address || ""}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail || ""}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Téléphone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={settings.contactPhone || ""}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="systemEmail">Email système</Label>
                <Input
                  id="systemEmail"
                  type="email"
                  value={settings.systemEmail || ""}
                  onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })}
                  placeholder="noreply@carolinelogistic.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres financiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultTva">TVA par défaut (%)</Label>
                <Input
                  id="defaultTva"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.defaultTva || ""}
                  onChange={(e) => setSettings({ ...settings, defaultTva: parseFloat(e.target.value) || null })}
                />
              </div>
              <div>
                <Label htmlFor="currency">Devise</Label>
                <Input
                  id="currency"
                  value={settings.currency || ""}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  placeholder="EUR"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blog</CardTitle>
              <CardDescription>
                Image par défaut des articles du blog (si un article n&apos;a pas d&apos;image)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Image par défaut des articles</Label>
                <LogoUpload
                  value={settings.defaultBlogImage || ""}
                  onChange={(url) => setSettings({ ...settings, defaultBlogImage: url })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebookUrl">Facebook</Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={settings.facebookUrl || ""}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="twitterUrl">Twitter</Label>
                <Input
                  id="twitterUrl"
                  type="url"
                  value={settings.twitterUrl || ""}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <Label htmlFor="instagramUrl">Instagram</Label>
                <Input
                  id="instagramUrl"
                  type="url"
                  value={settings.instagramUrl || ""}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={settings.linkedinUrl || ""}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <Label htmlFor="tiktokUrl">TikTok</Label>
                <Input
                  id="tiktokUrl"
                  type="url"
                  value={settings.tiktokUrl || ""}
                  onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Sauvegarde..." : "Enregistrer les paramètres"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
