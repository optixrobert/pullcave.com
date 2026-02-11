import { PrismaClient } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 neon-text text-foreground">Gestione Ordini</h1>

      <div className="rounded-md border border-primary/20 neon-box">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-primary/20">
              <TableHead className="text-primary">Ordine #</TableHead>
              <TableHead className="text-primary">Cliente</TableHead>
              <TableHead className="text-primary">Data</TableHead>
              <TableHead className="text-primary">Stato</TableHead>
              <TableHead className="text-right text-primary">Totale</TableHead>
              <TableHead className="text-right text-primary">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-primary/5 border-primary/20">
                <TableCell className="font-mono text-xs text-foreground">{order.id}</TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{order.customerName || 'Ospite'}</div>
                  <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                </TableCell>
                <TableCell className="text-foreground">{order.createdAt.toLocaleDateString('it-IT')}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'PAID' ? 'default' : 'secondary'} className={order.status === 'PAID' ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-foreground">€{Number(order.total).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {/* Future: Link to order detail */}
                  <span className="text-xs text-primary cursor-pointer hover:neon-text">Vedi dettagli</span>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Nessun ordine trovato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
