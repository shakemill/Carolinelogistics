import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/boutique`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  try {
    // Add categories
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    })

    categories.forEach((category) => {
      routes.push({
        url: `${baseUrl}/boutique?category=${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })

    // Add products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, slug: true, updatedAt: true },
    })

    products.forEach((product) => {
      routes.push({
        url: `${baseUrl}/boutique/${product.slug || product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return routes
}
