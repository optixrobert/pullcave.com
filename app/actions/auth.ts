'use server'

import { signIn, signOut } from "@/auth"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  let callbackUrl = '/'
  
  try {
    const email = formData.get('email') as string
    
    // Check user role before sign in to determine redirect
    const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true }
    })

    const redirectTo = formData.get('redirectTo') as string
    callbackUrl = redirectTo || '/'
    
    // If user is admin and no specific redirect is set (or it's just home), send to admin dashboard
    if (user?.role === 'ADMIN' && (callbackUrl === '/' || !callbackUrl)) {
        callbackUrl = '/admin'
    }

    await signIn('credentials', {
        ...Object.fromEntries(formData),
        redirect: false,
    })
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenziali non valide.'
        default:
          return 'Qualcosa è andato storto.'
      }
    }
    throw error
  }
  
  redirect(callbackUrl)
}

export async function register(
    prevState: string | undefined,
    formData: FormData,
  ) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!name || !email || !password) {
        return 'Tutti i campi sono obbligatori.'
    }
  
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return 'Email già registrata.'
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                cavernottiBalance: 0
            }
        })
        
        // Auto-login after registration is tricky in server actions with redirect
        // Ideally we redirect to login page with a success message
        return 'success'

    } catch (error) {
      console.error('Registration error:', error)
      return 'Errore durante la registrazione.'
    }
  }

export async function logout() {
    await signOut()
}
