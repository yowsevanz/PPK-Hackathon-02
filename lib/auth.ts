import bcrypt from 'bcryptjs'

// Fungsi untuk mengenkripsi password sebelum disimpan ke database
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

// Fungsi untuk mencocokkan password saat login
export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}