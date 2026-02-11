"use client"

import { useState } from "react"
import { BonusWheelPrize } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createWheelPrize, updateWheelPrize, deleteWheelPrize, toggleWheelPrizeStatus } from "@/app/actions/admin/wheel"
import { Trash2, Edit, Plus, Save } from "lucide-react"
import { toast } from "sonner"

interface WheelManagerProps {
  initialPrizes: BonusWheelPrize[]
}

export default function WheelManager({ initialPrizes }: WheelManagerProps) {
  const [prizes, setPrizes] = useState<BonusWheelPrize[]>(initialPrizes)
  const [isOpen, setIsOpen] = useState(false)
  const [editingPrize, setEditingPrize] = useState<BonusWheelPrize | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    value: 0,
    probability: 0,
    color: "#fbbf24"
  })

  const totalProbability = prizes.reduce((sum, p) => p.isActive ? sum + p.probability : sum, 0)

  const handleOpenCreate = () => {
    setEditingPrize(null)
    setFormData({ label: "", value: 0, probability: 0, color: "#fbbf24" })
    setIsOpen(true)
  }

  const handleOpenEdit = (prize: BonusWheelPrize) => {
    setEditingPrize(prize)
    setFormData({
      label: prize.label,
      value: prize.value,
      probability: prize.probability,
      color: prize.color
    })
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingPrize) {
        await updateWheelPrize(editingPrize.id, formData)
        toast.success("Premio aggiornato")
      } else {
        await createWheelPrize(formData)
        toast.success("Premio creato")
      }
      setIsOpen(false)
      // Optimistic update or router refresh could go here, 
      // but for now we rely on parent re-passing props or router.refresh() if we added it.
      // Since this is a client component receiving props, we might want to call a refresh function passed from parent
      // or just reload the window for simplicity in MVP, OR better:
      // use router.refresh() from next/navigation
    } catch (error) {
      toast.error("Errore nel salvataggio")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo premio?")) {
      await deleteWheelPrize(id)
      toast.success("Premio eliminato")
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleWheelPrizeStatus(id, !currentStatus)
    toast.success("Stato aggiornato")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestione Ruota Bonus</h2>
          <p className="text-muted-foreground">Gestisci i premi e le probabilità della ruota della fortuna.</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" /> Aggiungi Premio
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Probabilità Totale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProbability === 100 ? 'text-green-500' : 'text-yellow-500'}`}>
              {totalProbability}%
            </div>
            <p className="text-xs text-muted-foreground">
              Deve essere 100% per un funzionamento corretto
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colore</TableHead>
              <TableHead>Etichetta</TableHead>
              <TableHead>Valore (Cavernotti)</TableHead>
              <TableHead>Probabilità</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prizes.map((prize) => (
              <TableRow key={prize.id}>
                <TableCell>
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: prize.color }} />
                </TableCell>
                <TableCell className="font-medium">{prize.label}</TableCell>
                <TableCell>{prize.value}</TableCell>
                <TableCell>{prize.probability}%</TableCell>
                <TableCell>
                  <Button 
                    variant={prize.isActive ? "default" : "secondary"} 
                    size="sm"
                    onClick={() => handleToggleStatus(prize.id, prize.isActive)}
                  >
                    {prize.isActive ? "Attivo" : "Inattivo"}
                  </Button>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(prize)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(prize.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {prizes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Nessun premio configurato. Aggiungine uno per iniziare.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPrize ? "Modifica Premio" : "Nuovo Premio"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Etichetta</Label>
              <Input 
                placeholder="Es. 100 Cavernotti" 
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valore (Cavernotti)</Label>
                <Input 
                  type="number" 
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Probabilità (%)</Label>
                <Input 
                  type="number" 
                  value={formData.probability}
                  onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Colore</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  className="w-12 h-10 p-1"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
                <Input 
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Annulla</Button>
            <Button onClick={handleSubmit}><Save className="mr-2 h-4 w-4" /> Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
