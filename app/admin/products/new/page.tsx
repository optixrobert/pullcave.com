import ProductForm from "@/components/admin/product-form"

export default function NewProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nuovo Prodotto</h1>
      <ProductForm />
    </div>
  )
}
