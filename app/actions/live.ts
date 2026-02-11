'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getNextLiveEvent() {
  try {
    const liveEvent = await prisma.liveEvent.findFirst({
      where: {
        isActive: true,
        scheduledAt: {
          gte: new Date() // Only future or current events
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })
    return liveEvent
  } catch (error) {
    console.error("Error fetching live event:", error)
    return null
  }
}

export async function getAllLiveEvents() {
  return await prisma.liveEvent.findMany({
    orderBy: {
      scheduledAt: 'desc'
    }
  })
}

export async function createLiveEvent(formData: FormData) {
  const title = formData.get('title') as string
  const link = formData.get('link') as string
  const dateStr = formData.get('scheduledAt') as string
  
  if (!title || !link || !dateStr) {
    throw new Error('Missing required fields')
  }

  await prisma.liveEvent.create({
    data: {
      title,
      link,
      scheduledAt: new Date(dateStr),
      isActive: true
    }
  })

  revalidatePath('/admin/live')
  revalidatePath('/')
}

export async function toggleLiveEventStatus(id: string, isActive: boolean) {
  await prisma.liveEvent.update({
    where: { id },
    data: { isActive }
  })
  
  revalidatePath('/admin/live')
  revalidatePath('/')
}

export async function deleteLiveEvent(id: string) {
  await prisma.liveEvent.delete({
    where: { id }
  })
  
  revalidatePath('/admin/live')
  revalidatePath('/')
}
