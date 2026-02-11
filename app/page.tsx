import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import prisma from '@/lib/db'
import { Pickaxe } from "lucide-react"

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc'
    }
  })
  return products
}

export default async function Home() {
  const products = await getFeaturedProducts()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="text-foreground relative overflow-hidden h-[1080px] w-full max-w-[1920px] mx-auto flex flex-col justify-center bg-background">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: 'url("/hero section.png")' }}
        ></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 font-heading uppercase tracking-wide text-primary drop-shadow-[4px_4px_0_rgba(0,0,0,0.8)] stroke-text">TESORI DALLA CAVERNA</h1>
          <p className="text-lg md:text-2xl text-stone-200 mb-8 max-w-2xl mx-auto font-bold drop-shadow-md bg-stone-900/60 p-4 rounded-xl border-2 border-stone-700 backdrop-blur-sm">
            Entra nella tana del collezionista. 
            Pokemon, Magic, Yu-Gi-Oh: estrai le carte più rare direttamente dalla preistoria.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="text-xl px-8 h-16 font-heading uppercase tracking-widest border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 transition-all shadow-xl" asChild>
              <Link href="/catalog">
                Esplora la Caverna
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-xl px-8 h-16 hover:bg-stone-800 hover:text-primary hover:border-primary font-heading uppercase tracking-widest bg-stone-900/80 backdrop-blur-sm border-2 border-stone-600 shadow-xl" asChild>
              <Link href="/sell">
                Scambia / Vendi
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-stone-950/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-primary font-heading uppercase tracking-widest drop-shadow-md">Appena Estratti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:-translate-y-2 transition-transform duration-300 border-2 border-stone-800 bg-card shadow-[8px_8px_0px_0px_var(--muted)] group">
                <div className="aspect-[3/4] relative bg-stone-900 flex items-center justify-center border-b-2 border-stone-800">
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized={product.imageUrl.startsWith('http')}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground font-heading uppercase tracking-widest text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">{product.category}</div>
                  <h3 className="font-bold text-xl mb-3 truncate text-foreground font-heading tracking-wide">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary font-heading">€{Number(product.price).toFixed(2)}</span>
                    <Button variant="secondary" size="sm" className="hover:bg-primary hover:text-white font-bold uppercase tracking-wider text-xs" asChild>
                      <Link href={`/products/${product.id}`}>
                        Dettagli
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-500 font-bold bg-amber-500/10 p-2 rounded border border-amber-500/20 w-fit">
                    <Pickaxe className="w-4 h-4" />
                    <span>+{product.cavernottiPoints} PTS</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button variant="outline" size="lg" className="border-2 border-stone-700 hover:border-primary text-lg px-8 h-14 font-heading uppercase tracking-widest" asChild>
              <Link href="/catalog">
                Vedi tutti i prodotti
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-primary font-heading uppercase tracking-widest drop-shadow-md">Zone di Caccia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Pokemon', 'Magic: The Gathering', 'Yu-Gi-Oh'].map((category) => (
              <Link href={`/catalog?category=${category}`} key={category} className="group block h-full">
                <div className="bg-stone-900 border-2 border-stone-800 rounded-xl p-10 text-center hover:border-primary hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] transition-all h-full flex flex-col justify-center items-center shadow-[8px_8px_0px_0px_var(--muted)] group-hover:-translate-y-1 duration-300">
                  <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors font-heading uppercase tracking-wide mb-4">{category}</h3>
                  <p className="text-muted-foreground font-medium text-lg group-hover:text-stone-300 transition-colors">Inizia la caccia</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
