This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

# Expense Tracker

## 📌 Deskripsi

Expense Tracker merupakan aplikasi web yang digunakan untuk membantu pengguna dalam mengelola keuangan pribadi secara sederhana dan terstruktur.

Aplikasi ini memungkinkan pengguna untuk mencatat pemasukan dan pengeluaran, melihat riwayat transaksi, serta memantau kondisi keuangan melalui dashboard yang menyediakan informasi saldo saat ini, total pemasukan, dan total pengeluaran.

Aplikasi menerapkan sistem autentikasi dan otorisasi sehingga setiap pengguna hanya dapat mengakses dan mengelola data transaksi miliknya sendiri.

---

## Fitur Utama

### 1. Register
 Pengguna dapat membuat akun baru dengan memasukkan:
   - Nama
   - Email
   - Password

---

### 2. Login
   Pengguna dapat masuk ke dalam aplikasi menggunakan:

   - Email
   - Password

---

### 3. Session dan Authentication
   Sistem menyimpan informasi pengguna yang sedang login selama session masih berlaku. Session juga digunakan untuk melindungi halaman yang membutuhkan autentikasi agar tidak dapat diakses oleh pengguna yang belum login.

### 4. Dashboard
   Dashboard menampilkan informasi utama pengguna, yaitu:

   * Nama pengguna
   * Saldo saat ini
   * Total pemasukan
   * Total pengeluaran
   * Daftar transaksi terbaru

### 5. Manajemen Transaksi
   Pengguna dapat melakukan operasi CRUD terhadap transaksi keuangannya, yaitu:

   * Menambahkan transaksi
   * Melihat transaksi
   * Mengubah transaksi
   * Menghapus transaksi

   Setiap transaksi dapat berupa *pemasukan* atau *pengeluaran*.

### 6. Filter Transaksi
   Pengguna dapat memfilter daftar transaksi berdasarkan jenis transaksi:

   * Pemasukan
   * Pengeluaran

### 7. Cookies
   Aplikasi menggunakan cookies untuk menyimpan minimal satu preferensi pengguna, misalnya pilihan filter transaksi terakhir, tema tampilan, atau preferensi lain yang relevan.

### 8. Authorization
   Setiap transaksi terhubung dengan akun pemiliknya. Sistem harus memastikan bahwa pengguna hanya dapat mengakses dan mengelola data transaksi miliknya sendiri.

### 9. Logout
   Pengguna dapat keluar dari aplikasi. Proses logout akan mengakhiri session pengguna sehingga halaman yang membutuhkan autentikasi tidak dapat diakses kembali sebelum pengguna melakukan login.

---



### 🍪 Preferensi Pengguna

Aplikasi menggunakan cookies untuk menyimpan preferensi pengguna agar pengalaman penggunaan menjadi lebih nyaman.

---

## 🛠️ Teknologi yang Digunakan

- Next.js
- TypeScript
- Prisma ORM
- Database
- Tailwind CSS

---

## ⚙️ Instalasi

Clone repository:

```bash
git clone https://github.com/yowsevanz/PPK-Hackathon-02/
```

Masuk ke folder project:

```bash
cd expense-tracker
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Konfigurasi Environment

Buat file `.env` pada folder utama project.

Sesuaikan konfigurasi environment dengan konfigurasi lokal yang digunakan.

Contoh:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"
```

Keterangan:

- `username` → username PostgreSQL
- `password` → password PostgreSQL
- `localhost:5432` → alamat dan port PostgreSQL
- `expense_tracker` → nama database yang digunakan

Pastikan database PostgreSQL sudah dibuat sebelum menjalankan aplikasi.

---

## 🗄️ Konfigurasi Database

Project ini menggunakan Prisma ORM untuk mengelola database PostgreSQL.

Install dependency Prisma PostgreSQL adapter:

```bash
npm install @prisma/adapter-pg pg
```

Install TypeScript type untuk PostgreSQL:

```bash
npm install -D @types/pg
```

Generate Prisma Client:

```bash
npx prisma generate
```

Jalankan migration database:

```bash
npx prisma migrate dev
```

Jika database belum memiliki migration atau ingin membuat migration baru:

```bash
npx prisma migrate dev --name init
```

Untuk melihat dan mengelola data melalui Prisma Studio:

```bash
npx prisma studio
```

---

## ▶️ Menjalankan Aplikasi

Jalankan aplikasi dalam mode development:

```bash
npm run dev
```

Aplikasi dapat diakses melalui:

```
http://localhost:3000
```

---

---

## 🔒 Keamanan Data

Aplikasi menerapkan mekanisme autentikasi dan otorisasi untuk menjaga keamanan data pengguna.

Implementasi keamanan meliputi:

- Pengguna harus melakukan login untuk mengakses fitur tertentu.
- Setiap transaksi terhubung dengan akun pemiliknya.
- Pengguna hanya dapat melihat dan mengelola transaksi miliknya sendiri.
- Halaman yang membutuhkan autentikasi tidak dapat diakses oleh pengguna yang belum login.

---

## 🚀 Pengembangan Selanjutnya

Beberapa pengembangan yang dapat dilakukan:

- Penambahan visualisasi statistik keuangan.
- Export laporan transaksi.
- Fitur pengaturan anggaran bulanan.
- Peningkatan tampilan responsif untuk berbagai perangkat.

---

## 📄 Lisensi

Project ini dibuat untuk tujuan pembelajaran dan pengembangan aplikasi.