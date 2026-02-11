'use client'

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useState } from "react"
import { toast } from "sonner"
import { Pickaxe } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  set: string | null
  rarity: string | null
  condition: string | null
  stock: number
  cavernottiPoints: number
  imageUrl: string | null
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || undefined
    })
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      setIsAdding(false)
      toast.success('Aggiunto al carrello', {
        description: `${product.name} è ora nel tuo carrello.`,
        action: {
          label: 'VAI AL CARRELLO',
          onClick: () => router.push('/cart')
        },
        duration: 4000,
      })
    }, 500)
  }

  return (
    <div className="bg-background min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="bg-stone-900 rounded-xl aspect-[3/4] flex items-center justify-center overflow-hidden border-4 border-stone-800 shadow-[8px_8px_0px_0px_var(--muted)] relative">
           {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              // Use unoptimized to prevent server crashes on 404 external images
              unoptimized={product.imageUrl.startsWith('http')}
            />
          ) : (
            <span className="text-muted-foreground font-heading uppercase tracking-widest">No Image</span>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div>
            <div className="text-muted-foreground mb-2 font-heading uppercase text-sm tracking-widest">{product.category} &bull; {product.set}</div>
            <h1 className="text-5xl font-bold text-foreground mb-4 font-heading uppercase tracking-wide text-primary leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
              <span className="bg-stone-800 border border-stone-700 px-3 py-1 rounded text-primary uppercase tracking-wider text-xs">Rarità: {product.rarity}</span>
              <span className="bg-stone-800 border border-stone-700 px-3 py-1 rounded text-primary uppercase tracking-wider text-xs">Condizione: {product.condition}</span>
            </div>
          </div>

          <div className="text-4xl font-bold text-primary font-heading tracking-wide">
            €{product.price.toFixed(2)}
          </div>
          
          <div className="flex items-center gap-2 text-amber-500 font-bold text-lg bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 w-fit">
            <Pickaxe className="w-6 h-6" />
            <span>Guadagna {product.cavernottiPoints} Cavernotti</span>
          </div>

          <div className="prose text-muted-foreground text-lg leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="pt-8 border-t-2 border-stone-800">
            <div className="flex items-center gap-4 mb-6">
              <span className={`w-4 h-4 rounded-full border-2 border-stone-900 ${product.stock > 0 ? 'bg-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.3)]' : 'bg-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.3)]'}`}></span>
              <span className="text-base font-bold text-foreground uppercase tracking-wide">
                {product.stock > 0 ? `${product.stock} disponibili` : 'Non disponibile'}
              </span>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 font-heading uppercase tracking-wide text-xl h-16 border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 transition-all" 
                disabled={product.stock === 0 || isAdding}
                onClick={handleAddToCart}
              >
                {isAdding ? 'Aggiunta...' : (product.stock > 0 ? 'Aggiungi al Carrello' : 'Esaurito')}
              </Button>
              <Button variant="outline" size="lg" className="h-16 w-16 border-2 border-stone-700 hover:border-primary hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
