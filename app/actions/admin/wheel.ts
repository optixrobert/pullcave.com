'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getWheelPrizes() {
  try {
    const prizes = await prisma.bonusWheelPrize.findMany({
      orderBy: { value: 'asc' }
    })
    return prizes
  } catch (error) {
    console.error("Error fetching wheel prizes:", error)
    return []
  }
}

export async function createWheelPrize(data: {
  label: string
  value: number
  probability: number
  color: string
}) {
  try {
    await prisma.bonusWheelPrize.create({
      data: {
        label: data.label,
        value: data.value,
        probability: data.probability,
        color: data.color,
        type: 'CAVERNOTTI'
      }
    })
    revalidatePath('/admin/wheel')
    return { success: true }
  } catch (error) {
    console.error("Error creating wheel prize:", error)
    return { success: false, error: "Failed to create prize" }
  }
}

export async function updateWheelPrize(id: string, data: {
  label: string
  value: number
  probability: number
  color: string
}) {
  try {
    await prisma.bonusWheelPrize.update({
      where: { id },
      data: {
        label: data.label,
        value: data.value,
        probability: data.probability,
        color: data.color
      }
    })
    revalidatePath('/admin/wheel')
    return { success: true }
  } catch (error) {
    console.error("Error updating wheel prize:", error)
    return { success: false, error: "Failed to update prize" }
  }
}

export async function deleteWheelPrize(id: string) {
  try {
    await prisma.bonusWheelPrize.delete({
      where: { id }
    })
    revalidatePath('/admin/wheel')
    return { success: true }
  } catch (error) {
    console.error("Error deleting wheel prize:", error)
    return { success: false, error: "Failed to delete prize" }
  }
}

export async function toggleWheelPrizeStatus(id: string, isActive: boolean) {
  try {
    await prisma.bonusWheelPrize.update({
      where: { id },
      data: { isActive }
    })
    revalidatePath('/admin/wheel')
    return { success: true }
  } catch (error) {
    console.error("Error toggling wheel prize status:", error)
    return { success: false, error: "Failed to toggle status" }
  }
}
