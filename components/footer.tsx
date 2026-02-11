import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-card text-muted-foreground py-12 border-t-4 border-stone-800 mt-auto shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="block mb-4">
              <Image 
                src="/logo.png" 
                alt="PullCave Logo" 
                width={150} 
                height={50} 
                className="h-12 w-auto object-contain drop-shadow-md"
              />
            </Link>
            <p className="text-sm text-muted-foreground font-medium">
              Il rifugio sicuro per i collezionisti di carte. Scava, scambia e colleziona tesori leggendari.
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-bold uppercase tracking-wider mb-4 text-primary font-heading">Sentieri</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><a href="/catalog" className="hover:text-primary transition-colors">Caverna (Catalogo)</a></li>
              <li><a href="/sell" className="hover:text-primary transition-colors">Scambia (Vendi)</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">La Tribù (Chi siamo)</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-bold uppercase tracking-wider mb-4 text-primary font-heading">Aiuto della Tribù</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><a href="/faq" className="hover:text-primary transition-colors">Incisioni (FAQ)</a></li>
              <li><a href="/shipping" className="hover:text-primary transition-colors">Trasporto Tesori</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Chiama lo Sciamano</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-bold uppercase tracking-wider mb-4 text-primary font-heading">Segnali di Fumo</h4>
            <p className="text-sm text-muted-foreground mb-4 font-medium">Iscriviti per ricevere le ultime scoperte.</p>
            {/* Newsletter form placeholder */}
          </div>
        </div>
        <div className="border-t-2 border-stone-800 mt-12 pt-8 text-center text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} PullCave. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  )
}
