"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { spinWheel } from "@/app/actions/wheel"
import { toast } from "sonner"
import { Gift, Loader2, PartyPopper } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface Prize {
  id: string
  label: string
  color: string
  probability: number
  value: number
}

interface BonusWheelProps {
  orderId: string
  prizes: Prize[]
  hasSpun: boolean
}

export default function BonusWheel({ orderId, prizes, hasSpun: initialHasSpun }: BonusWheelProps) {
  const [hasSpun, setHasSpun] = useState(initialHasSpun)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wonPrize, setWonPrize] = useState<Prize | null>(null)
  const [showResult, setShowResult] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  if (prizes.length === 0) return null

  // Calculate slice angles
  const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0)
  let currentAngle = 0
  const slices = prizes.map(prize => {
    const angle = (prize.probability / totalProbability) * 360
    const startAngle = currentAngle
    const midAngle = startAngle + angle / 2
    currentAngle += angle
    return { ...prize, angle, startAngle, midAngle }
  })

  // Conic gradient string
  const gradient = `conic-gradient(${
    slices.map(s => `${s.color} ${s.startAngle}deg ${s.startAngle + s.angle}deg`).join(", ")
  })`

  const handleSpin = async () => {
    if (isSpinning || hasSpun) return

    setIsSpinning(true)
    
    try {
      const result = await spinWheel(orderId)
      
      if (!result.success || !result.prize) {
        toast.error(result.error || "Errore durante il giro della ruota")
        setIsSpinning(false)
        return
      }

      const winner = slices.find(s => s.id === result.prize.id)
      if (!winner) {
        setIsSpinning(false)
        return
      }

      // Calculate rotation to land on winner
      // We want the winner slice to be at the top (0deg or 270deg depending on implementation)
      // Standard CSS rotation moves clockwise. 0deg is top.
      // If we want midAngle to be at 0deg (top) after rotation:
      // Target Rotation = (360 - midAngle) + (360 * spins)
      
      const spins = 5
      const targetRotation = (360 - winner.midAngle) + (360 * spins)
      
      // Add random offset within the slice to make it look natural? 
      // Nah, midAngle is safe.

      setRotation(targetRotation)
      
      // Wait for animation
      setTimeout(() => {
        setWonPrize(result.prize as Prize)
        setHasSpun(true)
        setIsSpinning(false)
        setShowResult(true)
        toast.success(`Hai vinto ${result.prize.label}!`)
      }, 5000) // Match transition duration

    } catch (error) {
      console.error(error)
      toast.error("Si è verificato un errore imprevisto")
      setIsSpinning(false)
    }
  }

  if (hasSpun && !showResult) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8 bg-muted/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
             <PartyPopper className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Bonus già riscosso!</h3>
            <p className="text-muted-foreground">Hai già utilizzato il tuo giro fortunato per questo ordine.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <Card className="border-2 border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 text-primary animate-bounce" />
            Ruota dei Bonus
          </CardTitle>
          <CardDescription>Gira la ruota e vinci Cavernotti extra!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pt-4 pb-8">
          
          <div className="relative">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-primary drop-shadow-lg" />
            </div>

            {/* Wheel */}
            <div 
              className="w-64 h-64 rounded-full border-4 border-muted shadow-xl relative transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1)"
              style={{ 
                background: gradient,
                transform: `rotate(${rotation}deg)`
              }}
              ref={wheelRef}
            >
              {/* Inner Circle for style */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full shadow-inner border-2 border-muted flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full font-bold text-lg h-12 shadow-lg shadow-primary/20" 
            onClick={handleSpin}
            disabled={isSpinning || hasSpun}
          >
            {isSpinning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                La ruota gira...
              </>
            ) : (
              "GIRA ORA!"
            )}
          </Button>

        </CardContent>
      </Card>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl flex flex-col items-center gap-4 pt-4">
              <div className="p-4 bg-yellow-100 rounded-full animate-pulse">
                <Gift className="w-12 h-12 text-yellow-600" />
              </div>
              Complimenti!
            </DialogTitle>
            <DialogDescription className="text-lg">
              Hai vinto <span className="font-bold text-primary text-xl">{wonPrize?.label}</span>!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              I Cavernotti sono stati aggiunti al tuo saldo.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowResult(false)} className="w-full">
              Fantastico!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
