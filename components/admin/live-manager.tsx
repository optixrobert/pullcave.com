'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createLiveEvent, deleteLiveEvent, toggleLiveEventStatus } from "@/app/actions/live"
import { Trash2, Video, Power, PowerOff } from "lucide-react"

export default function AdminLivePage({ events }: { events: any[] }) {
  const [isCreating, setIsCreating] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsCreating(true)
    try {
      await createLiveEvent(formData)
      // Reset form handled by browser reload or we can use ref, but server action revalidates path
    } catch (error) {
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestione Live</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Programma Nuova Live</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo Live</Label>
                <Input id="title" name="title" placeholder="Es. Apertura Box Set Base" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Data e Ora</Label>
                <Input 
                  id="scheduledAt" 
                  name="scheduledAt" 
                  type="datetime-local" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link Streaming</Label>
                <Input id="link" name="link" placeholder="https://twitch.tv/..." required />
              </div>

              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? 'Programmazione...' : 'Programma Live'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storico Live</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Titolo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      {new Date(event.scheduledAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.scheduledAt).toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {event.isActive ? (
                        <span className="text-green-500 flex items-center gap-1">
                          <Video className="w-3 h-3" /> Attiva
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Terminata</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleLiveEventStatus(event.id, !event.isActive)}
                        >
                          {event.isActive ? <PowerOff className="w-4 h-4 text-orange-500" /> : <Power className="w-4 h-4 text-green-500" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteLiveEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Nessuna live programmata
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
