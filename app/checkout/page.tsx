'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/context/cart-context"
import { placeOrder } from "@/app/actions/checkout"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Carrello vuoto</h1>
        <p className="text-slate-500 mb-8">Non puoi effettuare il checkout senza prodotti.</p>
        <Link href="/catalog">
          <Button>Vai al Catalogo</Button>
        </Link>
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    // Prepare cart items for server action
    const cartItemsPayload = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))

    try {
      const result = await placeOrder(formData, cartItemsPayload)

      if (result.success) {
        clearCart()
        router.push(`/checkout/success/${result.orderId}`)
      } else {
        setError(result.error || "Si è verificato un errore.")
      }
    } catch (e) {
      setError("Errore di connessione. Riprova.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 font-heading text-primary uppercase tracking-wide">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form Section */}
        <div className="flex-1">
          <form action={handleSubmit} className="space-y-8">
            <div className="bg-card p-6 rounded-xl border-2 border-stone-800 space-y-4 shadow-[4px_4px_0px_0px_var(--muted)]">
              <h2 className="text-xl font-bold mb-4 text-primary font-heading uppercase tracking-wide">Dati di Spedizione</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Nome</Label>
                  <Input id="firstName" name="firstName" required placeholder="Mario" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Cognome</Label>
                  <Input id="lastName" name="lastName" required placeholder="Rossi" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="mario.rossi@example.com" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Indirizzo</Label>
                <Input id="address" name="address" required placeholder="Via Roma 1" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Città</Label>
                  <Input id="city" name="city" required placeholder="Milano" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">CAP</Label>
                  <Input id="zipCode" name="zipCode" required placeholder="20100" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Paese</Label>
                  <Input id="country" name="country" defaultValue="Italia" required className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border-2 border-stone-800 space-y-4 shadow-[4px_4px_0px_0px_var(--muted)]">
              <h2 className="text-xl font-bold mb-4 text-primary font-heading uppercase tracking-wide">Pagamento</h2>
              <div className="p-4 border-2 border-stone-700 rounded-lg bg-stone-900/30 text-muted-foreground text-sm">
                In questa demo, il pagamento è simulato. Cliccando su "Conferma Ordine", l'ordine verrà registrato come PAGATO.
              </div>
              {/* Payment fields would go here (Stripe Elements, etc.) */}
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg border-2 border-destructive/50 font-bold">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full font-heading text-xl py-6 tracking-wide" disabled={isSubmitting}>
              {isSubmitting ? 'Elaborazione in corso...' : `Paga €${cartTotal.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-card p-6 rounded-xl border-2 border-stone-800 sticky top-24 shadow-[4px_4px_0px_0px_var(--muted)]">
            <h3 className="font-bold text-lg mb-4 text-primary font-heading uppercase tracking-wide border-b-2 border-stone-800 pb-2">Riepilogo Ordine</h3>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-auto custom-scrollbar">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 text-sm group">
                  <div className="w-12 h-12 bg-stone-900 rounded-md flex-shrink-0 overflow-hidden border border-stone-700">
                     {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold truncate text-foreground font-heading uppercase tracking-wider group-hover:text-primary transition-colors">{item.name}</div>
                    <div className="text-muted-foreground text-xs">Qtà: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-primary font-mono">€{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-stone-800 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Subtotale</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Spedizione</span>
                <span className="text-primary font-bold uppercase">Gratis</span>
              </div>
            </div>
            
            <div className="border-t-2 border-stone-800 mt-4 pt-4 flex justify-between font-bold text-xl text-foreground items-end">
              <span className="uppercase tracking-wide">Totale</span>
              <span className="text-primary font-heading text-2xl">€{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
