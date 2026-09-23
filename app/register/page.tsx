'use client'

import { useActionState } from 'react'
import { registerUser } from '@/app/actions/authActions'
import Link from 'next/link'

export default function RegisterPage() {
  // Mengelola state error dari server action
  const [state, formAction, isPending] = useActionState(registerUser, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Daftar Akun Expense Tracker</h2>

        {state?.error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700 font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-indigo-600 py-2 text-white font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-300"
          >
            {isPending ? 'Memproses...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  )
}