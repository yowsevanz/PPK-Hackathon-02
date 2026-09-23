'use server'

import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// ==================== REGISTER ====================
export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'Semua field wajib diisi!' }
  }

  try {
    // Cek apakah email sudah terdaftar (Prepared Statement via Prisma)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'Email sudah terdaftar gunakan email lain!' }
    }

    // Enskripsi password menggunakan bcryptjs (menerapkan keamanan kredensial)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Simpan ke database dengan prinsip ACID (Atomic & Consistent)
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

  // Jika berhasil, alihkan ke halaman login
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
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: 'Email atau password salah!' }
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return { error: 'Email atau password salah!' }
    }

    // SIMPAN SESSION KE COOKIE (Berlaku 1 hari)
    const cookieStore = await cookies()
    cookieStore.set('session_user_id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
  } catch (error) {
    return { error: 'Terjadi kesalahan pada server saat login.' }
  }

  // Jika berhasil, arahkan ke dashboard
  redirect('/dashboard')
}

// ==================== LOGOUT ====================
export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('session_user_id')
  redirect('/login')
}