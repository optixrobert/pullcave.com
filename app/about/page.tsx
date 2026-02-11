export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8 text-center neon-text text-foreground">Chi Siamo</h1>
        
        <p className="lead text-xl text-muted-foreground mb-8 text-center">
          PullCave è nata dalla passione per il collezionismo e dalla volontà di creare un luogo sicuro e affidabile per gli appassionati di TCG.
        </p>

        <div className="my-12">
          <img 
            src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=2000&auto=format&fit=crop" 
            alt="Card Collection" 
            className="w-full h-64 object-cover rounded-xl shadow-lg neon-border"
          />
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">La Nostra Missione</h2>
        <p className="text-muted-foreground">
          Il nostro obiettivo è fornire ai collezionisti italiani ed europei un accesso facile e trasparente alle carte più ricercate del mercato. 
          Ogni carta venduta su PullCave viene rigorosamente controllata dai nostri esperti per garantirne l'autenticità e la corretta valutazione delle condizioni.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">Cosa Trattiamo</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li><strong className="text-foreground">Pokemon TCG:</strong> Dalle prime edizioni Wizards of the Coast alle espansioni più moderne.</li>
          <li><strong className="text-foreground">Magic: The Gathering:</strong> Carte singole per tornei, Commander e collezionismo puro.</li>
          <li><strong className="text-foreground">Yu-Gi-Oh!:</strong> Le carte più potenti e rare per i duellanti.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">Perché Sceglierci</h2>
        <p className="text-muted-foreground">
          Oltre alla vasta selezione, offriamo spedizioni rapide e imballaggi a prova di bomba ("bomb-proof packaging") per assicurare che i tuoi acquisti arrivino esattamente nelle condizioni descritte.
        </p>
      </div>
    </div>
  )
}
