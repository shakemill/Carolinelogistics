import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { PromotionBanner } from "@/components/home/promotion-banner"
import { AboutPreview } from "@/components/home/about-preview"
import { BlogSection } from "@/components/home/blog-section"
import { prisma } from "@/lib/db/prisma"
import { getProductPriceWithPromotion } from "@/lib/utils/promotions"

async function getHomepageData() {
  const [featuredProducts, latestProducts, categories, activePromotions, blogPosts, settings] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 8,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      take: 6,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    }),
    prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      take: 3,
      orderBy: { endDate: "asc" },
    }),
    prisma.blogPost
      ? prisma.blogPost.findMany({
          where: { isActive: true },
          take: 2,
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          select: { id: true, title: true, slug: true, excerpt: true, image: true, publishedAt: true },
        })
      : Promise.resolve([]),
    prisma.settings.findUnique({
      where: { id: "main" },
      select: { defaultBlogImage: true },
    }),
  ])

  // Get pricing with promotions for products
  const featuredWithPricing = await Promise.all(
    featuredProducts.map(async (product) => {
      const pricing = await getProductPriceWithPromotion(product.id)
      return { ...product, pricing }
    })
  )

  const latestWithPricing = await Promise.all(
    latestProducts.map(async (product) => {
      const pricing = await getProductPriceWithPromotion(product.id)
      return { ...product, pricing }
    })
  )

  return {
    featuredProducts: featuredWithPricing,
    latestProducts: latestWithPricing,
    categories,
    activePromotions,
    blogPosts: blogPosts ?? [],
    defaultBlogImage: settings?.defaultBlogImage ?? null,
  }
}

export default async function HomePage() {
  const data = await getHomepageData()

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection categories={data.categories} />
        <FeaturedProducts products={data.featuredProducts} />
        <PromotionBanner promotions={data.activePromotions} />
        <BlogSection posts={data.blogPosts} defaultImage={data.defaultBlogImage} />
        <AboutPreview />
      </main>
      <Footer />
    </div>
  )
}
