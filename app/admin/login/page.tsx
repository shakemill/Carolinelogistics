"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("Attempting login for:", email)
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/admin/dashboard"
      
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: callbackUrl,
      })

      console.log("SignIn result:", result)

      if (result?.error) {
        setError(`Erreur: ${result.error}`)
        console.error("Login error:", result.error)
      } else if (result?.ok) {
        console.log("Login successful, redirecting...")
        // Force a full page reload to ensure session is available
        window.location.href = callbackUrl
      } else {
        setError("Une erreur est survenue lors de la connexion")
        console.error("Unexpected result:", result)
      }
    } catch (err: any) {
      console.error("Login exception:", err)
      setError(err?.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card border border-border rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative h-16 w-auto">
              <Image
                src="/logo.png"
                alt="Caroline Logistics"
                width={200}
                height={64}
                className="h-16 w-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="admin@carolinelogistic.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
