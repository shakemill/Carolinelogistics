"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  image: string
  ctaText: string | null
  ctaLink: string | null
  badge: string | null
  order: number
  isActive: boolean
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/hero-slides?admin=true")
      const data = await res.json()
      setSlides(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching hero slides:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const doDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: "DELETE" })
      if (res.ok) fetchSlides()
      else {
        const err = await res.json()
        alert(err.error || "Erreur")
      }
    } catch (e) {
      alert("Erreur lors de la suppression")
    } finally {
      setConfirmOpen(false)
      setPendingDeleteId(null)
    }
  }

  const handleConfirmDelete = () => {
    if (pendingDeleteId) doDelete(pendingDeleteId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hero Slider</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les slides de la bannière d&apos;accueil
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/hero-slides/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau slide
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Slides</CardTitle>
          <CardDescription>
            Ordre d&apos;affichage et statut actif/inactif
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : slides.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun slide. Créez-en un pour afficher le hero sur la page d&apos;accueil.
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg"
                >
                  <div className="relative w-24 h-14 rounded overflow-hidden bg-muted shrink-0">
                    <Image
                      src={slide.image.startsWith("http") || slide.image.startsWith("/") ? slide.image : `/${slide.image}`}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{slide.title}</h3>
                    {slide.subtitle && (
                      <p className="text-sm text-muted-foreground truncate">{slide.subtitle}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          slide.isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {slide.isActive ? "Actif" : "Inactif"}
                      </span>
                      <span className="text-xs text-muted-foreground">Ordre: {slide.sortOrder}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/hero-slides/${slide.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPendingDeleteId(slide.id)
                        setConfirmOpen(true)
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer ce slide ?"
        message="Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false)
          setPendingDeleteId(null)
        }}
      />
    </div>
  )
}
