"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/admin/image-upload"
import { RichTextEditor } from "@/components/admin/richtext-editor"

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    publishedAt: "",
    isActive: true,
  })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`)
        if (!res.ok) throw new Error("Article non trouvé")
        const data = await res.json()
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          image: data.image || "",
          publishedAt: data.publishedAt
            ? new Date(data.publishedAt).toISOString().slice(0, 16)
            : "",
          isActive: data.isActive ?? true,
        })
      } catch (e: any) {
        setError(e.message || "Erreur")
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.title.trim()) {
      setError("Le titre est requis")
      return
    }
    if (!formData.slug.trim()) {
      setError("Le slug est requis")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          excerpt: formData.excerpt.trim() || null,
          content: formData.content.trim() || null,
          image: formData.image || null,
          publishedAt: formData.publishedAt
            ? new Date(formData.publishedAt).toISOString()
            : null,
          isActive: formData.isActive,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de la mise à jour")
      }

      router.push("/admin/blog")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erreur")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Modifier l&apos;article</h1>
            <p className="text-muted-foreground mt-1">Modifier le contenu de l&apos;article</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Contenu de l&apos;article</CardTitle>
            <CardDescription>Titre, extrait, image et corps de l&apos;article</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de l'article"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="titre-article"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Extrait / Résumé</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Courte description pour les listes et cartes"
                rows={2}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Image de l&apos;article</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Si vide, l&apos;image par défaut du blog (Paramètres) sera utilisée
              </p>
              <div className="mt-2">
                <ImageUpload
                  images={formData.image ? [formData.image] : []}
                  onChange={(urls) => setFormData({ ...formData, image: urls[0] || "" })}
                  maxImages={1}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">Contenu (optionnel)</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Utilisez la barre d&apos;outils pour mettre en forme le texte (gras, listes, liens, etc.)
              </p>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Contenu complet de l'article..."
              />
            </div>

            <div>
              <Label htmlFor="publishedAt">Date de publication</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isActive">Article actif (visible sur le site)</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/blog">Annuler</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
