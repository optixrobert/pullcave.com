'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Flame, User } from "lucide-react"
import { useActionState } from "react"
import { authenticate, register } from "@/app/actions/auth"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [loginState, loginAction, isLoginPending] = useActionState(authenticate, undefined)
  const [registerState, registerAction, isRegisterPending] = useActionState(register, undefined)

  const [activeTab, setActiveTab] = useState("login")

  useEffect(() => {
    if (loginState) {
        toast.error(loginState)
    }
  }, [loginState])

  useEffect(() => {
    if (registerState === 'success') {
        toast.success('Registrazione completata! Ora puoi accedere.')
        setActiveTab("login")
    } else if (registerState) {
        toast.error(registerState)
    }
  }, [registerState])

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-stone-900 p-6 rounded-full inline-flex mb-6 border-4 border-stone-700 shadow-xl">
            <User className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold font-heading uppercase tracking-wide text-primary mb-4">Benvenuto nella Tribù</h1>
          <p className="text-muted-foreground text-xl font-medium">Accedi al tuo rifugio o unisciti alla caccia.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-14 bg-stone-900 border-2 border-stone-800 p-1 rounded-xl">
            <TabsTrigger value="login" className="text-lg font-bold font-heading uppercase tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">Accedi</TabsTrigger>
            <TabsTrigger value="register" className="text-lg font-bold font-heading uppercase tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">Unisciti</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-2 border-stone-800 shadow-[8px_8px_0px_0px_var(--muted)] bg-card">
              <form action={loginAction}>
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 font-heading uppercase text-primary">
                    <Flame className="w-6 h-6 text-primary fill-primary/20" />
                    Bentornato Cacciatore
                  </CardTitle>
                  <CardDescription className="text-base">
                    Inserisci le tue credenziali per accedere al tuo inventario.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="cacciatore@esempio.com" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Password</Label>
                    <Input id="password" name="password" type="password" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg h-12" required />
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Button className="w-full text-xl font-heading uppercase tracking-wide py-6 shadow-sm" disabled={isLoginPending}>
                    {isLoginPending ? 'Accesso in corso...' : 'Entra nella Caverna'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="border-2 border-stone-800 shadow-[8px_8px_0px_0px_var(--muted)] bg-card">
              <form action={registerAction}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 font-heading uppercase text-primary">
                    <User className="w-6 h-6 text-primary" />
                    Nuovo Membro
                  </CardTitle>
                  <CardDescription className="text-base">
                    Crea il tuo profilo per iniziare a collezionare e scambiare.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Nome Completo</Label>
                    <Input id="name" name="name" placeholder="Nome Cognome" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Email</Label>
                    <Input id="reg-email" name="email" type="email" placeholder="cacciatore@esempio.com" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="font-heading uppercase text-xs tracking-wider text-muted-foreground">Password</Label>
                    <Input id="reg-password" name="password" type="password" className="bg-stone-900/50 border-2 border-stone-700 focus-visible:ring-primary focus-visible:border-primary rounded-lg h-12" required minLength={6} />
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Button className="w-full text-xl font-heading uppercase tracking-wide py-6 shadow-sm" disabled={isRegisterPending}>
                    {isRegisterPending ? 'Creazione profilo...' : 'Accendi il Fuoco'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
