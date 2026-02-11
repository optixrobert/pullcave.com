import { PrismaClient } from '@prisma/client'
import ProductForm from "@/components/admin/product-form"
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  // Convert Decimal to number for the form component
  const formattedProduct = {
    ...product,
    price: Number(product.price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Modifica Prodotto</h1>
      <ProductForm product={formattedProduct} />
    </div>
  )
}
