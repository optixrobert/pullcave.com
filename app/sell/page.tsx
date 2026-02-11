import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function SellPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 neon-text">Vendi le tue carte</h1>
        <p className="text-muted-foreground text-lg">
          Hai carte rare che vuoi vendere? Compiliamo una valutazione gratuita per la tua collezione.
          Accettiamo Pokemon, Magic: The Gathering e Yu-Gi-Oh.
        </p>
      </div>

      <div className="bg-card p-8 rounded-xl border border-primary/20 neon-box">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input id="firstName" placeholder="Il tuo nome" className="bg-background border-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Cognome</Label>
              <Input id="lastName" placeholder="Il tuo cognome" className="bg-background border-primary/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tua@email.com" className="bg-background border-primary/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-type">Cosa vuoi vendere?</Label>
            <Input id="collection-type" placeholder="es. Collezione Pokemon anni 90, Mazzo Magic..." className="bg-background border-primary/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione dettagliata / Lista carte</Label>
            <Textarea 
              id="description" 
              placeholder="Elenca le carte principali o descrivi le condizioni generali..." 
              className="min-h-[150px] bg-background border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">Foto (Opzionale - Link esterno)</Label>
            <Input id="photos" placeholder="Link a Google Drive, Dropbox, Imgur..." className="bg-background border-primary/50" />
          </div>

          <Button className="w-full neon-box font-bold" size="lg">Invia Richiesta di Valutazione</Button>
        </form>
      </div>
    </div>
  )
}
