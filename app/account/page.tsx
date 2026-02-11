import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { formatDate, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Pickaxe, User as UserIcon, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
      }
    }
  })

  if (!user) {
      redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Il mio Account</h1>

      <div className="grid gap-8 md:grid-cols-3">
        {/* User Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <UserIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
               <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <span className="font-medium text-amber-700 dark:text-amber-400">Saldo Cavernotti</span>
                  <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-500">
                    <Pickaxe className="w-5 h-5" />
                    <span>{user.cavernottiBalance}</span>
                  </div>
               </div>
            </div>

            <div className="pt-4">
                <form action={logout}>
                    <Button variant="destructive" className="w-full flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Esci
                    </Button>
                </form>
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="w-5 h-5" />
            I miei Ordini
          </h2>

          {user.orders.length === 0 ? (
            <div className="bg-muted/30 border border-dashed rounded-lg p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-medium text-lg">Nessun ordine trovato</h3>
              <p className="text-muted-foreground">Non hai ancora effettuato acquisti nella caverna.</p>
              <Button asChild className="mt-4">
                <Link href="/catalog">Esplora il Catalogo</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {user.orders.map((order) => (
                <div key={order.id} className="bg-card border rounded-lg p-4 shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                             <span className="font-bold">#{order.id.slice(-6).toUpperCase()}</span>
                             <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                {order.status === 'COMPLETED' ? 'Completato' : order.status}
                             </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Effettuato il {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                        <p className="text-xs text-muted-foreground">{order.items.length} articoli</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                      {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.product.name}</span>
                              <span className="text-muted-foreground">{formatPrice(item.price)}</span>
                          </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
