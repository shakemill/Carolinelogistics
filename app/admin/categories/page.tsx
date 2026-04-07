"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Edit, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  image: string | null
  description: string | null
  parent: Category | null
  children: Category[]
  _count: {
    products: number
  }
}

function CategoryTreeItem({
  category,
  onRequestDelete,
}: {
  category: Category
  onRequestDelete: (cat: Category) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = category.children && Array.isArray(category.children) && category.children.length > 0

  return (
    <div className="ml-4">
      <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg group">
        <div className="flex items-center gap-2 flex-1">
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-background rounded"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          <div className="flex-1">
            <div className="font-medium text-foreground">{category.name}</div>
            <div className="text-sm text-muted-foreground">
              {category._count?.products || 0} produit(s) • {category.slug}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/categories/${category.id}/edit`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRequestDelete(category)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {(category.children || []).map((child) => (
            <CategoryTreeItem key={child.id} category={child} onRequestDelete={onRequestDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null)

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      
      // S'assurer que toutes les catégories ont un tableau children
      const normalizeCategory = (cat: any): Category => ({
        ...cat,
        children: Array.isArray(cat.children) ? cat.children.map(normalizeCategory) : [],
        _count: cat._count || { products: 0 },
      })
      
      const normalizedData = Array.isArray(data) ? data.map(normalizeCategory) : []
      
      // Build tree structure (only root categories)
      const rootCategories = normalizedData.filter((cat: Category) => !cat.parentId)
      setCategories(rootCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const doDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (res.ok) fetchCategories()
      else {
        const error = await res.json()
        alert(error.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Erreur lors de la suppression")
    } finally {
      setConfirmOpen(false)
      setPendingDelete(null)
    }
  }

  const handleConfirmDelete = () => {
    if (pendingDelete) doDelete(pendingDelete.id)
  }

  const handleRequestDelete = (cat: Category) => {
    setPendingDelete({ id: cat.id, name: cat.name })
    setConfirmOpen(true)
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Catégories</h1>
          <p className="text-muted-foreground mt-2">
            Gestion des catégories et sous-catégories
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle catégorie
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des catégories</CardTitle>
          <CardDescription>
            {categories.length} catégorie(s) racine
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune catégorie. Créez-en une pour commencer.
            </div>
          ) : (
            <div className="space-y-1">
              {categories.map((category) => (
                <CategoryTreeItem
                  key={category.id}
                  category={category}
                  onRequestDelete={handleRequestDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer la catégorie"
        message={pendingDelete ? `Supprimer la catégorie « ${pendingDelete.name} » ? Cette action est irréversible.` : ""}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
