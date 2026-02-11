import prisma from "@/lib/db"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pickaxe } from "lucide-react"
import { formatDate } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clienti</h1>
        <Badge variant="outline" className="text-base px-4 py-1">
          Totale: {users.length}
        </Badge>
      </div>

      <div className="border rounded-lg shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Ordini</TableHead>
              <TableHead>Saldo Cavernotti</TableHead>
              <TableHead>Data Iscrizione</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Nessun cliente trovato.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user._count.orders}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium text-amber-500">
                      <Pickaxe className="w-4 h-4" />
                      {user.cavernottiBalance}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
