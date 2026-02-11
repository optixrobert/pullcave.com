'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

type CartItem = {
  productId: string
  quantity: number
}

import { auth } from '@/auth'

export async function placeOrder(formData: FormData, cartItems: CartItem[]) {
  const session = await auth()
  
  if (!session?.user) {
    return { success: false, error: 'Devi effettuare il login per completare l\'ordine.' }
  }

  const customerName = formData.get('firstName') + ' ' + formData.get('lastName')
  const customerEmail = formData.get('email') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const zipCode = formData.get('zipCode') as string
  const country = formData.get('country') as string

  // 1. Calculate total and verify stock server-side
  let total = 0
  let totalCavernotti = 0
  const orderItemsData = []

  // We need to fetch products to get current price and check stock
  // Doing this in a transaction would be best to prevent race conditions
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        })

        if (!product) {
          throw new Error(`Prodotto non trovato: ${item.productId}`)
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insufficiente per ${product.name}. Disponibili: ${product.stock}`)
        }

        const itemTotal = Number(product.price) * item.quantity
        total += itemTotal
        
        const itemCavernotti = (product.cavernottiPoints || 0) * item.quantity
        totalCavernotti += itemCavernotti

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        })

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity }
        })
      }

      // 2. Create Order
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          customerName,
          customerEmail,
          address,
          city,
          zipCode,
          country,
          total: total,
          status: 'PAID', // Simulating successful payment for MVP
          earnedCavernotti: totalCavernotti,
          items: {
            create: orderItemsData
          }
        }
      })
      
      // 3. Update User Cavernotti Balance
      if (totalCavernotti > 0) {
        await tx.user.update({
            where: { id: session.user.id },
            data: {
                cavernottiBalance: {
                    increment: totalCavernotti
                }
            }
        })
      }

      return order
    })

    revalidatePath('/admin/orders')
    revalidatePath('/admin')
    
    return { success: true, orderId: result.id }

  } catch (error: any) {
    console.error('Order failed:', error)
    return { success: false, error: error.message || 'Errore durante la creazione dell\'ordine' }
  }
}
