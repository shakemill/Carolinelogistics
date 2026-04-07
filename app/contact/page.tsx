import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ContactForm } from "@/components/contact-form"
import { Mail, Phone, MapPin, Clock, Facebook } from "lucide-react"
import { TikTokIcon } from "@/components/tiktok-icon"

const contactInfo = [
  {
    icon: Phone,
    title: "Téléphone",
    details: ["+33 7 45 22 36 64", "+33 7 60 27 08 90"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["infocarolinelogistics@gmail.com"],
  },
  {
    icon: MapPin,
    title: "Adresse",
    details: ["Challans – France", "85300"],
  },
  {
    icon: Clock,
    title: "Horaires",
    details: ["Lun - Ven: 8h - 18h", "Sam: 9h - 14h"],
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[
            { label: "Contact" }
          ]} />
        </div>
        {/* Page Header */}
        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Contactez-nous</h1>
            <p className="text-muted-foreground mt-2">Nous sommes là pour vous aider</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>Accueil</span>
              <span>/</span>
              <span className="text-primary">Contact</span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-foreground mb-6">Informations de Contact</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{info.title}</h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-muted-foreground text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Suivez-nous</h3>
                  <div className="flex gap-3">
                    <a
                      href="https://www.facebook.com/caro.linelogistics"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@carolinelogisticsfrance?_r=1&_t=ZN-91WYd1l8gXW"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="TikTok"
                    >
                      <TikTokIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Envoyez-nous un message</h2>
                  <p className="text-muted-foreground mb-6">
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                  </p>

                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="py-8 bg-muted">
          <div className="container mx-auto px-4">
            <div className="aspect-[21/9] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Carte Google Maps</p>
                <p className="text-sm text-muted-foreground">Challans, France 85300</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
