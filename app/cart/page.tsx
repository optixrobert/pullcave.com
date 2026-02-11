'use client'

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-6 font-heading">Il tuo carrello è vuoto</h1>
        <p className="text-muted-foreground mb-8 text-lg">Non hai ancora aggiunto tesori al tuo sacco.</p>
        <Button asChild size="lg" className="font-heading">
          <Link href="/catalog">
            Vai alla Caverna
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 font-heading text-primary uppercase tracking-wide">Carrello</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 border-2 border-stone-800 p-4 rounded-xl bg-card shadow-lg hover:border-primary/50 transition-colors group">
              <div className="w-24 h-24 bg-stone-900 rounded-lg flex-shrink-0 overflow-hidden relative border border-stone-700">
                {item.imageUrl ? (
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized={item.imageUrl.startsWith('http')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-heading">No Img</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold text-lg text-card-foreground font-heading uppercase tracking-wide group-hover:text-primary transition-colors">{item.name}</h3>
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded-md"
                    title="Rimuovi"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-primary font-bold text-xl mb-4 font-heading">€{item.price.toFixed(2)}</div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-md border-stone-600 hover:border-primary hover:text-primary"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center text-card-foreground font-bold font-mono text-lg">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-md border-stone-600 hover:border-primary hover:text-primary"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-right">
             <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 font-bold uppercase tracking-wider" onClick={clearCart}>
               Svuota Sacco
             </Button>
          </div>
        </div>

        <div className="lg:w-96">
          <div className="bg-card p-8 rounded-xl sticky top-32 border-2 border-stone-800 shadow-2xl">
            <h3 className="font-bold text-2xl mb-6 text-card-foreground font-heading uppercase border-b-2 border-stone-800 pb-4">Riepilogo</h3>
            <div className="flex justify-between mb-3 text-muted-foreground font-medium">
              <span>Subtotale</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-6 text-muted-foreground font-medium">
              <span>Spedizione</span>
              <span className="text-primary font-bold">Gratis</span>
            </div>
            <div className="border-t-2 border-stone-800 pt-6 flex justify-between items-end mb-8">
              <span className="font-bold text-lg text-card-foreground uppercase">Totale</span>
              <span className="text-3xl font-bold text-primary font-heading">€{cartTotal.toFixed(2)}</span>
            </div>
            <Button className="w-full font-heading text-lg py-6" size="lg" asChild>
              <Link href="/checkout">
                Procedi alla Cassa
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
