import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create some initial products
  const products = [
    {
      name: 'Charizard',
      description: 'Holo Rare from Base Set. Iconic card.',
      price: 199.99,
      category: 'Pokemon',
      set: 'Base Set',
      rarity: 'Holo Rare',
      condition: 'Near Mint',
      stock: 5,
      imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=2669&auto=format&fit=crop'
    },
    {
      name: 'Blue-Eyes White Dragon',
      description: 'Legendary dragon engine of destruction.',
      price: 89.50,
      category: 'Yu-Gi-Oh',
      set: 'LOB',
      rarity: 'Ultra Rare',
      condition: 'Excellent',
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1622643048696-673e8a452779?q=80&w=2574&auto=format&fit=crop'
    },
    {
      name: 'Black Lotus',
      description: 'The most powerful Magic card ever printed.',
      price: 9999.99,
      category: 'Magic: The Gathering',
      set: 'Alpha',
      rarity: 'Rare',
      condition: 'Poor',
      stock: 1,
      imageUrl: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=2670&auto=format&fit=crop'
    },
    {
      name: 'Pikachu Illustrator',
      description: 'Extremely rare promo card.',
      price: 50000.00,
      category: 'Pokemon',
      set: 'Promo',
      rarity: 'Promo',
      condition: 'Gem Mint',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1613771404721-c5b05c6c19a0?q=80&w=2669&auto=format&fit=crop'
    }
  ]

  console.log('Start seeding...')

  for (const p of products) {
    await prisma.product.create({
      data: p
    })
  }

  console.log('Seed data inserted!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
