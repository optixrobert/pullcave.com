'use server'

import { auth } from "@/auth"
import prisma from "@/lib/db"

export async function getUserBalance() {
  const session = await auth()

  if (!session?.user?.id) {
    return 0
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { cavernottiBalance: true }
    })

    return user?.cavernottiBalance || 0
  } catch (error) {
    console.error("Error fetching balance:", error)
    return 0
  }
}
