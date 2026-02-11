'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const set = formData.get('set') as string
  const rarity = formData.get('rarity') as string
  const condition = formData.get('condition') as string
  const stock = parseInt(formData.get('stock') as string)
  const cavernottiPoints = parseInt(formData.get('cavernottiPoints') as string) || 0
  const imageUrl = formData.get('imageUrl') as string

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      category,
      set,
      rarity,
      condition,
      stock,
      cavernottiPoints,
      imageUrl,
    }
  })

  revalidatePath('/admin/products')
  revalidatePath('/catalog')
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const set = formData.get('set') as string
  const rarity = formData.get('rarity') as string
  const condition = formData.get('condition') as string
  const stock = parseInt(formData.get('stock') as string)
  const cavernottiPoints = parseInt(formData.get('cavernottiPoints') as string) || 0
  const imageUrl = formData.get('imageUrl') as string

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      category,
      set,
      rarity,
      condition,
      stock,
      cavernottiPoints,
      imageUrl,
    }
  })

  revalidatePath('/admin/products')
  revalidatePath(`/products/${id}`)
  revalidatePath('/catalog')
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  })

  revalidatePath('/admin/products')
  revalidatePath('/catalog')
}
