import { PrismaClient } from '@prisma/client'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'
import Image from 'next/image'
import { Pickaxe, Search } from "lucide-react"

const prisma = new PrismaClient()

// Helper to make search params accessible in server component
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'newest'

  const where = {
    ...(category && { category }),
    ...(search && {
      OR: [
        { name: { contains: search } }, // Case-insensitive handled by SQLite? Check collation. Prisma usually handles this well.
        { description: { contains: search } }
      ]
    })
  }

  const orderBy = (() => {
    switch (sort) {
      case 'price_asc': return { price: 'asc' }
      case 'price_desc': return { price: 'desc' }
      default: return { createdAt: 'desc' }
    }
  })() as any

  const products = await prisma.product.findMany({
    where,
    orderBy,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 font-heading uppercase tracking-wide text-primary">Catalogo Tesori</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="space-y-6 bg-card/50 p-6 rounded-xl border-2 border-stone-800 shadow-lg">
            <div>
              <Label className="text-lg font-bold text-primary font-heading uppercase tracking-wider">Cerca</Label>
              <form action="/catalog" method="GET" className="mt-3 relative">
                <div className="flex gap-2">
                  <Input 
                    name="search" 
                    placeholder="Nome carta..." 
                    defaultValue={search}
                    className="bg-stone-900/50 border-2 border-stone-700 focus:border-primary rounded-lg pr-10"
                  />
                  <Button type="submit" size="icon" className="absolute right-0 top-0 h-full rounded-l-none border-l-0 border-stone-700 bg-stone-800 hover:bg-primary">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                {category && <input type="hidden" name="category" value={category} />}
                {sort && <input type="hidden" name="sort" value={sort} />}
              </form>
            </div>

            <div>
              <Label className="text-lg font-bold text-primary font-heading uppercase tracking-wider">Categoria</Label>
              <div className="flex flex-col gap-2 mt-3">
                <Link href="/catalog" className={`text-sm px-3 py-2 rounded-lg transition-all font-heading uppercase tracking-wide border border-transparent ${!category ? 'bg-primary/20 text-primary border-primary/50 font-bold' : 'text-muted-foreground hover:bg-stone-800 hover:text-foreground hover:border-stone-700'}`}>Tutte le Tribù</Link>
                {['Pokemon', 'Magic: The Gathering', 'Yu-Gi-Oh'].map(c => (
                  <Link 
                    key={c} 
                    href={`/catalog?category=${encodeURIComponent(c)}${search ? `&search=${search}` : ''}${sort ? `&sort=${sort}` : ''}`}
                    className={`text-sm px-3 py-2 rounded-lg transition-all font-heading uppercase tracking-wide border border-transparent ${category === c ? 'bg-primary/20 text-primary border-primary/50 font-bold' : 'text-muted-foreground hover:bg-stone-800 hover:text-foreground hover:border-stone-700'}`}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-card/30 p-4 rounded-xl border border-stone-800">
            <p className="text-muted-foreground font-medium"><span className="text-foreground font-bold">{products.length}</span> tesori trovati</p>
            {/* Simple sort links as buttons for now */}
            <div className="flex flex-wrap gap-2 text-sm items-center">
              <span className="text-muted-foreground font-heading uppercase text-xs mr-2">Ordina per:</span>
              <Link href={`/catalog?sort=newest${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`} className={`px-3 py-1.5 rounded-md transition-all border ${sort === 'newest' ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm' : 'bg-stone-900 border-stone-700 text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}>Novità</Link>
              <Link href={`/catalog?sort=price_asc${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`} className={`px-3 py-1.5 rounded-md transition-all border ${sort === 'price_asc' ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm' : 'bg-stone-900 border-stone-700 text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}>Prezzo &uarr;</Link>
              <Link href={`/catalog?sort=price_desc${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`} className={`px-3 py-1.5 rounded-md transition-all border ${sort === 'price_desc' ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm' : 'bg-stone-900 border-stone-700 text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}>Prezzo &darr;</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:-translate-y-1 transition-all duration-300 border-2 border-stone-800 bg-card group shadow-[4px_4px_0px_0px_var(--muted)] hover:shadow-[6px_6px_0px_0px_var(--primary)] hover:border-primary/50">
                <div className="aspect-[3/4] relative bg-stone-900 border-b-2 border-stone-800 group-hover:border-primary/20 transition-colors">
                   {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={product.imageUrl.startsWith('http')}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground font-heading text-sm">
                      No Img
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-sm border border-stone-700 rounded-full px-2 py-1 text-xs font-bold text-amber-500 flex items-center gap-1 shadow-lg">
                    <Pickaxe className="w-3 h-3" />
                    <span>+{product.cavernottiPoints}</span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="text-xs font-bold text-primary/80 mb-2 uppercase tracking-wider font-heading">{product.category}</div>
                  <h3 className="font-bold text-lg mb-3 truncate text-foreground group-hover:text-primary transition-colors font-heading uppercase tracking-wide">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-primary font-heading">€{Number(product.price).toFixed(2)}</span>
                    <Button size="sm" className="font-heading uppercase tracking-wide shadow-sm" asChild>
                      <Link href={`/products/${product.id}`}>
                        Dettagli
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="text-center py-20 text-muted-foreground bg-stone-900/30 rounded-xl border-2 border-dashed border-stone-800">
              <p className="text-xl font-heading uppercase mb-2">La caverna è vuota</p>
              <p>Nessun tesoro trovato con questi criteri.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
