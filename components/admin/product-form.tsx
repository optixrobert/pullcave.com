'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProduct, updateProduct } from "@/app/actions/products"

type ProductFormProps = {
  product?: {
    id: string
    name: string
    description: string
    price: number // Changed from Decimal to number for simplicity in props
    category: string
    set: string | null
    rarity: string | null
    condition: string | null
    stock: number
    cavernottiPoints: number
    imageUrl: string | null
  }
}

export default function ProductForm({ product }: ProductFormProps) {
  const isEdit = !!product
  const action = isEdit ? updateProduct.bind(null, product.id) : createProduct

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Prodotto</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrizione</Label>
        <Textarea id="description" name="description" defaultValue={product?.description} required />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prezzo (€)</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" defaultValue={product?.stock} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cavernottiPoints">Cavernotti</Label>
          <Input id="cavernottiPoints" name="cavernottiPoints" type="number" defaultValue={product?.cavernottiPoints || 0} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select name="category" defaultValue={product?.category || "Pokemon"}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pokemon">Pokemon</SelectItem>
              <SelectItem value="Magic: The Gathering">Magic: The Gathering</SelectItem>
              <SelectItem value="Yu-Gi-Oh">Yu-Gi-Oh</SelectItem>
              <SelectItem value="Other">Altro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="set">Set / Espansione</Label>
          <Input id="set" name="set" defaultValue={product?.set || ''} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rarity">Rarità</Label>
          <Input id="rarity" name="rarity" defaultValue={product?.rarity || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condizione</Label>
          <Select name="condition" defaultValue={product?.condition || "Near Mint"}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona condizione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gem Mint">Gem Mint</SelectItem>
              <SelectItem value="Mint">Mint</SelectItem>
              <SelectItem value="Near Mint">Near Mint</SelectItem>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Played">Played</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL Immagine</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={product?.imageUrl || ''} placeholder="https://..." />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit">{isEdit ? 'Aggiorna Prodotto' : 'Crea Prodotto'}</Button>
        <Button variant="outline" type="button" onClick={() => history.back()}>Annulla</Button>
      </div>
    </form>
  )
}
