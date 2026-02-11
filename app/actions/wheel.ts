'use server'

import { auth } from "@/auth"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getActiveWheelPrizes() {
  try {
    const prizes = await prisma.bonusWheelPrize.findMany({
      where: { isActive: true },
      orderBy: { value: 'asc' },
      select: {
        id: true,
        label: true,
        color: true,
        probability: true, // Needed for visual slice size
        value: true
      }
    })
    return prizes
  } catch (error) {
    console.error("Error fetching prizes:", error)
    return []
  }
}

export async function spinWheel(orderId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Devi essere loggato per girare la ruota" }
  }

  // 1. Get Order and check eligibility
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  })

  if (!order) {
    return { success: false, error: "Ordine non trovato" }
  }

  if (order.userId !== session.user.id) {
    return { success: false, error: "Non autorizzato" }
  }

  if (order.hasSpunWheel) {
    return { success: false, error: "Hai già girato la ruota per questo ordine" }
  }

  // 2. Get Prizes
  const prizes = await prisma.bonusWheelPrize.findMany({
    where: { isActive: true }
  })

  if (prizes.length === 0) {
    return { success: false, error: "Nessun premio disponibile al momento" }
  }

  // 3. Calculate Winner
  const totalWeight = prizes.reduce((sum, p) => sum + p.probability, 0)
  let random = Math.random() * totalWeight
  let selectedPrize = null

  for (const prize of prizes) {
    if (random < prize.probability) {
      selectedPrize = prize
      break
    }
    random -= prize.probability
  }

  if (!selectedPrize) {
    selectedPrize = prizes[prizes.length - 1]
  }

  // 4. Update Database
  try {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { hasSpunWheel: true }
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          cavernottiBalance: { increment: selectedPrize.value }
        }
      })
    ])
    
    revalidatePath('/account')
    revalidatePath(`/checkout/success/${orderId}`)

    return { success: true, prize: selectedPrize }
  } catch (error) {
    console.error("Spin transaction error:", error)
    return { success: false, error: "Errore durante l'assegnazione del premio" }
  }
}
