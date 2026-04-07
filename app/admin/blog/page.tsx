"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  publishedAt: string | null
  isActive: boolean
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog?admin=true&limit=50")
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const doDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" })
      if (res.ok) fetchPosts()
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
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les articles du blog (section accueil + page blog)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel article
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>
            Les 4 derniers articles actifs sont affichés sur la page d&apos;accueil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun article. Créez-en un pour afficher la section blog sur l&apos;accueil.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg"
                >
                  <div className="relative w-24 h-14 rounded overflow-hidden bg-muted shrink-0">
                    {post.image ? (
                      <Image
                        src={
                          post.image.startsWith("http") || post.image.startsWith("/")
                            ? post.image
                            : `/${post.image}`
                        }
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        Pas d&apos;image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground truncate line-clamp-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          post.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {post.isActive ? "Actif" : "Inactif"}
                      </span>
                      {post.publishedAt && (
                        <span className="text-xs text-muted-foreground">
                          Publié le{" "}
                          {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPendingDeleteId(post.id)
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
        title="Supprimer cet article ?"
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
