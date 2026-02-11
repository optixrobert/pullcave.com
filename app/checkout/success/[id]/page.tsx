import { Button } from "@/components/ui/button"
import Link from "next/link"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import BonusWheel from "@/components/bonus-wheel"
import { getActiveWheelPrizes } from "@/app/actions/wheel"

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderSuccessPage({ params }: Props) {
  const { id } = await params
  
  // Verify order exists
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true }
  })

  if (!order) {
    notFound()
  }

  const prizes = await getActiveWheelPrizes()

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center text-primary shadow-[0_0_0_4px_var(--border)] border-4 border-stone-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
      
      <h1 className="text-5xl font-bold mb-4 font-heading uppercase tracking-wide text-primary">Grazie!</h1>
      <p className="text-muted-foreground text-lg mb-8 font-medium">
        Il tuo ordine <span className="font-mono font-bold text-foreground text-xl">#{order.id.slice(0,8)}...</span> è stato scolpito nella roccia.
        <br/>Una conferma è stata inviata a <span className="font-bold text-foreground">{order.customerEmail}</span>.
      </p>

      {order.userId && prizes.length > 0 && (
        <div className="mb-12">
           <BonusWheel orderId={order.id} prizes={prizes} hasSpun={order.hasSpunWheel} />
        </div>
      )}

      <div className="bg-card p-8 rounded-xl border-2 border-stone-800 mb-10 text-left shadow-[4px_4px_0px_0px_var(--muted)]">
        <h3 className="font-bold mb-6 text-primary font-heading uppercase tracking-wide text-xl border-b-2 border-stone-800 pb-2">Spedizione</h3>
        <div className="space-y-1 text-lg">
          <p className="text-foreground font-bold">{order.customerName}</p>
          <p className="text-muted-foreground">{order.address}</p>
          <p className="text-muted-foreground">{order.city}, {order.zipCode}</p>
          <p className="text-muted-foreground">{order.country}</p>
        </div>
      </div>

      <div className="flex justify-center gap-4 flex-col sm:flex-row">
        <Link href="/">
          <Button variant="outline" size="lg" className="w-full sm:w-auto font-heading uppercase tracking-wide border-2">Torna alla Caverna</Button>
        </Link>
        <Link href="/catalog">
          <Button size="lg" className="w-full sm:w-auto font-heading uppercase tracking-wide text-lg py-6">Continua la Caccia</Button>
        </Link>
      </div>
    </div>
  )
}
