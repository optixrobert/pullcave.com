import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductDetail from '@/components/product-detail'

const prisma = new PrismaClient()

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  // Pass plain object to client component
  const plainProduct = {
    ...product,
    price: Number(product.price)
  }

  return (
    <ProductDetail product={plainProduct} />
  )
}
