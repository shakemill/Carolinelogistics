import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { PromotionBanner } from "@/components/home/promotion-banner"
import { AboutPreview } from "@/components/home/about-preview"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <PromotionBanner />
        <AboutPreview />
      </main>
      <Footer />
    </div>
  )
}
