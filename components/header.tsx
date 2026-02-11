'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { Gem, ArrowRightLeft, Tent, ShoppingBag, User, Search, Pickaxe, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { useSession } from "next-auth/react"
import { getUserBalance } from '@/app/actions/user'

export default function Header() {
  const { cartCount } = useCart()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session, status } = useSession()
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    if (session?.user) {
        // Initialize with session balance
        // @ts-ignore
        setBalance(session.user.cavernottiBalance || 0)

        // Fetch fresh balance
        getUserBalance().then(newBalance => {
            setBalance(newBalance)
        })
    }
  }, [session, router]) // Re-fetch on session change or route change

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="border-b-4 bg-card/95 backdrop-blur sticky top-0 z-50 border-stone-800 shadow-xl">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 hover:scale-105 transition-transform duration-200">
          <Image 
            src="/logo.png" 
            alt="PullCave Logo" 
            width={180} 
            height={60} 
            className="h-20 w-auto object-contain drop-shadow-lg filter"
            priority
          />
        </Link>
        
        <nav className="hidden lg:flex gap-8 items-center shrink-0">
          <Link href="/catalog" className="group flex flex-col items-center gap-1 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all font-heading">
            <div className="p-2 rounded-lg bg-stone-800/50 group-hover:bg-primary/20 group-hover:-translate-y-1 transition-all duration-300 border-2 border-stone-700 group-hover:border-primary">
              <Gem className="w-5 h-5 group-hover:fill-primary/20 group-hover:stroke-primary transition-colors" />
            </div>
            <span>Caverna</span>
          </Link>
          <Link href="/sell" className="group flex flex-col items-center gap-1 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all font-heading">
            <div className="p-2 rounded-lg bg-stone-800/50 group-hover:bg-primary/20 group-hover:-translate-y-1 transition-all duration-300 border-2 border-stone-700 group-hover:border-primary">
              <ArrowRightLeft className="w-5 h-5 group-hover:stroke-primary transition-colors" />
            </div>
            <span>Scambia</span>
          </Link>
          <Link href="/about" className="group flex flex-col items-center gap-1 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all font-heading">
            <div className="p-2 rounded-lg bg-stone-800/50 group-hover:bg-primary/20 group-hover:-translate-y-1 transition-all duration-300 border-2 border-stone-700 group-hover:border-primary">
              <Tent className="w-5 h-5 group-hover:fill-primary/20 group-hover:stroke-primary transition-colors" />
            </div>
            <span>Tribù</span>
          </Link>
        </nav>

        <div className="flex-1 max-w-md hidden md:block px-8">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Cerca tesori nascosti..."
              className="pl-10 h-12 bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-xl shadow-inner transition-all hover:bg-stone-900 hover:border-primary/50 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {session?.user && (
            <div className="hidden md:flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 mr-2" title="I tuoi Cavernotti">
              <Pickaxe className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-500">{balance}</span>
            </div>
          )}
          <Button variant="ghost" size="icon" className="relative w-14 h-14 rounded-full hover:bg-primary/10 hover:text-primary group border border-transparent hover:border-primary/20" asChild>
            <Link href="/cart">
              <ShoppingBag className="w-[29px] h-[29px] group-hover:fill-primary/20 transition-all" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          
          {session ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full hover:bg-primary/10 hover:text-primary group border border-transparent hover:border-primary/20" title="Il mio Account" asChild>
                <Link href="/account">
                  <User className="w-[29px] h-[29px] group-hover:fill-primary/20 transition-all" />
                </Link>
              </Button>
              <form action={logout}>
                <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full hover:bg-primary/10 hover:text-primary group border border-transparent hover:border-primary/20" title="Esci">
                  <LogOut className="w-[29px] h-[29px] group-hover:fill-primary/20 transition-all" />
                </Button>
              </form>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full hover:bg-primary/10 hover:text-primary group border border-transparent hover:border-primary/20" asChild>
              <Link href="/login">
                <User className="w-[29px] h-[29px] group-hover:fill-primary/20 transition-all" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
