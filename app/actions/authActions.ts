'use server'

import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// ==================== REGISTER ====================
export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'Semua field wajib diisi!' }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'Email sudah terdaftar gunakan email lain!' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  } catch (error) {
    return { error: 'Terjadi kesalahan pada server saat registrasi.' }
  }

  redirect('/login?registered=success')
}

// ==================== LOGIN ====================
export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi!' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: 'Email atau password salah!' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return { error: 'Email atau password salah!' }
    }

    const sessionToken = crypto.randomBytes(32).toString('hex')

    //Simpan token ke tabel Session di database via Prisma
    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
      },
    })

    // SIMPAN TOKEN KE COOKIE (Bukan lagi angka ID mentah)
    const cookieStore = await cookies()
    cookieStore.set('session_user_id', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 hari
      path: '/',
    })
  } catch (error) {
    console.error(error);
    return { error: 'Terjadi kesalahan pada server saat login.' }
  }

  redirect('/dashboard')
}

// ==================== LOGOUT ====================
export async function logoutUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_user_id')?.value

  if (sessionToken) {
    // Hapus sesi dari database agar token tidak bisa dipakai lagi
    try {
      await prisma.session.delete({
        where: { token: sessionToken },
      })
    } catch (e) {
      // Abaikan jika token sudah tidak ada di database
    }
  }

  // Hapus cookie dari browser
  cookieStore.delete('session_user_id')
  redirect('/login')
}