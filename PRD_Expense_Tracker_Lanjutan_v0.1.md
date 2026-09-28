# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Expense Tracker – Modul Lanjutan: Anggaran Bulanan & Pengalaman Tanpa Reload (AJAX)

**STATUS: DRAFT SEMENTARA (v0.1)**

| Item | Keterangan |
|---|---|
| **Nama Produk** | Expense Tracker – Aplikasi Pengelolaan Keuangan Pribadi |
| **Cakupan Dokumen** | Lanjutan dari User Story 1 (Autentikasi, Dashboard, Manajemen Transaksi) — fokus pada User Story 2: audit/implementasi AJAX dan fitur Anggaran Bulanan |
| **Versi Dokumen** | v0.1 (Draft Sementara) |
| **Disusun oleh** | PM, Programmer 1, Programmer 2, Programmer 3 |
| **Tanggal** | 28 September 2026 |
| **Dokumen Terkait** | User Story 1 (telah selesai diimplementasikan), User Story 2 dari klien, struktur kode & `schema.prisma` yang sudah berjalan |

---

## 1. Ringkasan Produk (Overview)

Modul inti Expense Tracker (registrasi, login, sesi, dashboard, manajemen transaksi, filter, otorisasi per-pengguna) telah selesai dibangun pada User Story 1. Namun, pengalaman penggunaan saat ini pada dashboard, manajemen transaksi, dan filter masih berpotensi memuat ulang (reload) halaman setiap kali pengguna melakukan aksi, sehingga terasa kurang nyaman untuk aplikasi yang digunakan berulang kali dalam keseharian. Selain itu, pengguna belum memiliki cara untuk merencanakan dan memantau batas pengeluaran bulanan mereka sendiri.

Pada tahap ini, tim akan (1) memeriksa ulang seluruh kode dan fitur yang sudah berjalan untuk memastikan interaksi pada dashboard, manajemen transaksi, dan filter transaksi menggunakan AJAX (pemanggilan data asinkron tanpa reload halaman penuh), dan (2) membangun modul baru **Anggaran Bulanan (Monthly Budget)** yang memungkinkan setiap pengguna menetapkan anggaran per bulan, melihat ringkasan pemakaian anggaran, mendapatkan indikator status anggaran, serta menelusuri anggaran pada bulan-bulan yang berbeda. Seluruh data anggaran tetap terikat pada sesi pengguna yang login, mengikuti pola otorisasi yang sudah dibangun sebelumnya.

## 2. Tujuan & Sasaran (Goals)

- Meningkatkan kenyamanan penggunaan aplikasi dengan menghilangkan reload halaman penuh pada alur-alur yang paling sering digunakan (dashboard, transaksi, filter).
- Memastikan konsistensi teknis: seluruh fitur yang sudah ada diaudit ulang sebelum fitur baru ditambahkan, agar tidak menumpuk teknis utang (technical debt).
- Memberikan kemampuan perencanaan keuangan bulanan kepada pengguna melalui fitur anggaran, bukan hanya pencatatan transaksi historis.
- Memberikan transparansi kondisi anggaran pengguna secara instan (jumlah anggaran, total pengeluaran, sisa anggaran, status penggunaan) tanpa perlu berpindah halaman.
- Mempertahankan prinsip keamanan dan otorisasi yang sudah ada: setiap pengguna hanya dapat melihat dan mengelola anggarannya sendiri.

## 3. Pengguna & Peran (Users & Roles)

**Pengguna Terdaftar (User):**
Individu yang telah melakukan registrasi dan login ke dalam sistem. Pada lingkup dokumen ini, pengguna dapat berinteraksi dengan dashboard, mengelola transaksi, serta menetapkan dan memantau anggaran bulanannya sendiri secara asinkron (tanpa reload halaman). Tidak ada peran lain (mis. admin) yang disebutkan dalam diskusi User Story 2.

## 4. Ruang Lingkup (Scope)

### 4.1 Termasuk (MVP Lanjutan)

- Audit dan penyesuaian kode dashboard, manajemen transaksi, dan filter transaksi agar seluruh operasi (ambil data, tambah, ubah, hapus, filter) berjalan melalui AJAX tanpa reload halaman penuh.
- Modul Anggaran Bulanan: menetapkan anggaran, mengubah anggaran, ringkasan anggaran (jumlah anggaran, total pengeluaran, sisa anggaran), indikator status penggunaan anggaran, dan navigasi antar bulan.
- Otorisasi: anggaran hanya dapat dilihat dan dikelola oleh pemiliknya sendiri, mengikuti mekanisme sesi/cookie yang sudah berjalan.

### 4.2 Di Luar Lingkup Awal / Fase Lanjutan

Belum ada fitur yang secara eksplisit ditunda ke fase berikutnya pada diskusi User Story 2 ini. Seluruh poin yang disebutkan klien (set budget, budget summary, budget indicator, monthly budget) masuk ke dalam MVP lanjutan pada Bab 6.

## 5. Asumsi & Batasan (Assumptions & Constraints)

- **(Asumsi teknis)** AJAX diimplementasikan menggunakan `fetch` API bawaan browser yang memanggil Next.js Route Handler (`app/api/.../route.ts`), karena user story hanya menyebutkan "tanpa reload" tanpa menentukan teknologi secara spesifik.
- **(Asumsi teknis)** Framework tetap Next.js (App Router) dan database tetap PostgreSQL yang diakses melalui Prisma ORM, melanjutkan keputusan pada User Story 1.
- **(Asumsi teknis)** Anggaran bulanan bersifat **total per bulan** (satu nilai anggaran untuk seluruh pengeluaran dalam bulan tersebut), bukan per kategori pengeluaran, karena diskusi tidak menyebutkan pembagian kategori anggaran. Lihat juga Bab 12.
- **(Asumsi teknis)** Karena anggaran bersifat bulanan, penyimpanan anggaran memerlukan kombinasi bulan **dan** tahun (misalnya September 2026) agar navigasi antar bulan pada tahun berbeda tetap valid, meskipun user story hanya menyebutkan "bulan".
- **(Asumsi teknis)** Fitur anggaran bulanan mengikuti pola non-reload (AJAX) yang sama dengan modul lain, sebagai bagian dari konsistensi pengalaman pengguna yang diminta di awal User Story 2.
- Mekanisme autentikasi, session, dan cookie yang sudah dibangun pada User Story 1 **tidak diubah**; modul anggaran hanya memanfaatkan sesi yang sudah ada untuk otorisasi.
- Model data `User`, `Transaction`, dan `Session` pada `schema.prisma` yang sudah berjalan dianggap tetap (tidak diubah), kecuali penambahan model baru `Budget` yang dijelaskan pada Bab 8.

## 6. Kebutuhan Fungsional (Functional Requirements)

### 6.1 Pengguna – Pengalaman Tanpa Reload (AJAX)

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
|---|---|---|
| AJX-1 | Sistem menampilkan data dashboard (nama, saldo, total pemasukan, total pengeluaran) melalui pemanggilan data secara asinkron tanpa memuat ulang halaman. | Wajib |
| AJX-2 | Pengguna dapat menambahkan transaksi baru dari dashboard tanpa reload halaman; daftar transaksi dan ringkasan saldo diperbarui secara otomatis setelah transaksi tersimpan. | Wajib |
| AJX-3 | Pengguna dapat mengubah dan menghapus transaksi pada halaman manajemen transaksi tanpa reload halaman penuh. | Wajib |
| AJX-4 | Pengguna dapat memfilter transaksi berdasarkan jenis (pemasukan/pengeluaran) dan hasilnya diperbarui secara asinkron tanpa reload halaman. | Wajib |
| AJX-5 | Sistem menampilkan indikator status proses (mis. loading, berhasil, gagal) saat operasi AJAX (tambah/ubah/hapus/filter) sedang berlangsung. | Penting |

### 6.2 Pengguna – Manajemen Anggaran Bulanan (Budget)

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
|---|---|---|
| BUD-1 | Pengguna dapat menetapkan anggaran (nominal) untuk suatu bulan dan tahun tertentu. | Wajib |
| BUD-2 | Pengguna dapat mengubah anggaran yang sudah ditetapkan untuk suatu bulan. | Wajib |
| BUD-3 | Sistem menampilkan ringkasan anggaran bulan terpilih: jumlah anggaran, total pengeluaran pada bulan tersebut, dan sisa anggaran. | Wajib |
| BUD-4 | Sistem menampilkan indikator status penggunaan anggaran (mis. aman, mendekati batas, atau melebihi anggaran) berdasarkan perbandingan total pengeluaran terhadap anggaran. | Wajib |
| BUD-5 | Pengguna dapat memilih bulan (dan tahun) untuk melihat anggaran serta ringkasannya pada bulan tersebut. | Wajib |
| BUD-6 | Sistem memastikan pengguna hanya dapat melihat dan mengelola data anggaran miliknya sendiri, berdasarkan sesi login yang aktif. | Wajib |
| BUD-7 | Operasi menetapkan/mengubah anggaran dan pengambilan ringkasan anggaran dilakukan secara asinkron (AJAX) tanpa reload halaman. | Penting |

## 7. Alur Pengguna Utama (Key User Flows)

### 7.1 Menetapkan Anggaran Bulan Berjalan

1. Pengguna login dan membuka halaman Anggaran.
2. Sistem menampilkan bulan berjalan sebagai default, memuat data anggaran (jika ada) secara asinkron.
3. Jika anggaran belum ditetapkan, sistem menampilkan status "Anggaran Belum Ditetapkan" beserta form input.
4. Pengguna memasukkan nominal anggaran dan menekan tombol simpan.
5. Sistem mengirim permintaan AJAX untuk menyimpan anggaran tanpa reload halaman.
6. Sistem memperbarui tampilan ringkasan anggaran dan indikator status secara otomatis setelah data tersimpan.

### 7.2 Melihat Ringkasan Anggaran Bulan Lain

1. Pengguna membuka halaman Anggaran (bulan berjalan sudah tampil).
2. Pengguna memilih bulan/tahun lain melalui kontrol pemilih bulan.
3. Sistem mengambil data anggaran dan total pengeluaran bulan tersebut melalui AJAX, tanpa reload halaman.
4. Sistem menampilkan jumlah anggaran, total pengeluaran, sisa anggaran, dan indikator status untuk bulan yang dipilih.
5. **Kondisi khusus:** jika anggaran untuk bulan tersebut belum pernah ditetapkan, sistem menampilkan status "Anggaran Belum Ditetapkan" dan mengarahkan pengguna untuk menetapkannya (mengikuti alur 7.1).

### 7.3 Mencatat Transaksi Baru Tanpa Reload (Dashboard)

1. Pengguna berada di halaman Dashboard yang sudah menampilkan saldo, total pemasukan, dan total pengeluaran hasil pemanggilan AJAX.
2. Pengguna mengisi form transaksi baru dan menekan tombol simpan.
3. Sistem mengirim data transaksi melalui AJAX ke server.
4. Setelah tersimpan, sistem memperbarui saldo, total pemasukan/pengeluaran, dan daftar transaksi pada dashboard secara otomatis tanpa reload halaman.
5. **Kondisi gagal:** jika penyimpanan gagal (mis. input tidak valid atau sesi berakhir), sistem menampilkan pesan kesalahan tanpa reload dan mengarahkan ke login jika sesi tidak valid.

### 7.4 Mengubah/Menghapus Transaksi dan Memfilter (Manajemen Transaksi)

1. Pengguna membuka halaman Manajemen Transaksi; daftar transaksi dimuat melalui AJAX.
2. Pengguna memilih filter jenis transaksi (pemasukan/pengeluaran); daftar diperbarui secara asinkron sesuai filter.
3. Pengguna menekan tombol ubah pada salah satu transaksi, mengedit data, dan menyimpan perubahan melalui AJAX.
4. Pengguna menekan tombol hapus pada transaksi; sistem meminta konfirmasi, lalu menghapus data melalui AJAX dan memperbarui daftar tanpa reload halaman.

## 8. Model Data (High-Level)

| **Entitas** | **Field Utama** | **Keterangan** |
|---|---|---|
| **User** *(sudah ada)* | id, name, email, password | Tidak diubah pada tahap ini. |
| **Transaction** *(sudah ada)* | id, user_id, jenis, nominal, keterangan, tanggal | Tidak diubah struktur datanya; hanya cara pengambilan/pengiriman data yang diubah menjadi AJAX. |
| **Session** *(sudah ada)* | id, user_id, token, created_at | Tidak diubah; tetap menjadi dasar otorisasi untuk modul anggaran. |
| **Budget** *(baru)* | id, user_id, bulan, tahun, jumlah_anggaran, created_at, updated_at | Satu baris mewakili anggaran seorang pengguna untuk satu kombinasi bulan+tahun. Kombinasi (user_id, bulan, tahun) bersifat unik. |

**Catatan:** entitas `Budget` merupakan penambahan model baru yang belum ada pada `schema.prisma` sebelumnya; detail skema diusulkan pada Lampiran B.

## 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

**Responsivitas Antarmuka (Tanpa Reload):**
Seluruh interaksi pada dashboard, manajemen transaksi, filter, dan anggaran bulanan berjalan secara asinkron (AJAX) agar pengguna tidak mengalami reload halaman penuh.

**Keamanan & Otorisasi:**
Setiap permintaan AJAX (baik transaksi maupun anggaran) wajib divalidasi berdasarkan sesi pengguna yang login; pengguna tidak dapat mengakses atau mengubah data anggaran maupun transaksi milik pengguna lain.

**Konsistensi Data (ACID):**
Operasi menetapkan/mengubah anggaran serta pencatatan transaksi dilakukan dalam transaksi database yang konsisten agar data anggaran dan transaksi tidak berada dalam keadaan tidak sinkron.

**Proteksi dari SQL Injection:**
Seluruh query ke PostgreSQL wajib menggunakan prepared statement/parameterized query melalui Prisma Client; tidak diperkenankan menyusun query dengan penggabungan string mentah.

**Performa:**
Endpoint AJAX untuk ringkasan anggaran dan dashboard diharapkan tetap responsif meskipun dipanggil berulang kali, misalnya saat pengguna berpindah bulan atau mengganti filter secara cepat.

## 10. Integrasi Pihak Ketiga

Tidak ada integrasi pihak ketiga baru yang dibahas pada tahap lanjutan (User Story 2) ini; seluruh kebutuhan AJAX dan modul anggaran diselesaikan secara internal menggunakan Next.js Route Handler dan PostgreSQL melalui Prisma.

## 11. Fitur Usulan / Fase Lanjutan

Belum ada usulan fase lanjutan yang dibahas secara eksplisit dalam diskusi User Story 2 ini. Seluruh poin yang disampaikan klien (audit AJAX, set budget, budget summary, budget indicator, monthly budget) telah dimasukkan ke dalam kebutuhan fungsional MVP lanjutan pada Bab 6.

## 12. Pertanyaan Terbuka / TBD

- Berapa ambang batas (threshold) persentase pengeluaran terhadap anggaran yang dianggap "mendekati batas" atau "melebihi anggaran" pada indikator status? Belum ditentukan klien.
- Apakah anggaran perlu dipecah per kategori pengeluaran, atau cukup satu nilai total per bulan seperti diasumsikan pada Bab 5?
- Apakah pengguna dapat menghapus anggaran yang sudah ditetapkan, atau hanya menetapkan dan mengubah (sesuai yang disebutkan klien)?
- Apakah diperlukan notifikasi (email/push/in-app) ketika anggaran mendekati atau terlampaui? Belum dibahas dalam diskusi.
- Bentuk visual indikator status anggaran (warna, ikon, teks) belum ditentukan desainnya secara spesifik.
- Apakah histori/tren anggaran dan pengeluaran dari bulan-bulan sebelumnya perlu ditampilkan dalam bentuk grafik? Belum dibahas.
- Apakah ada batasan rentang bulan/tahun yang dapat dipilih pengguna (mis. hanya boleh melihat tahun berjalan)? Belum ditentukan.

## 13. Glosarium

**AJAX :**
Teknik pemanggilan data ke server secara asinkron dari sisi klien tanpa perlu memuat ulang seluruh halaman.

**Session :**
Data sesi login pengguna yang disimpan di server (tabel `Session`) untuk memverifikasi bahwa pengguna sedang dalam keadaan login.

**Cookie :**
Data kecil yang disimpan di sisi browser pengguna, digunakan di sini untuk menyimpan referensi (token) sesi login.

**ACID :**
Singkatan dari Atomicity, Consistency, Isolation, Durability — prinsip transaksi database yang menjamin data tetap konsisten meskipun terjadi kegagalan di tengah proses.

**Prepared Statement :**
Teknik penulisan query database dengan parameter terpisah dari perintah SQL, digunakan untuk mencegah serangan SQL Injection.

**Prisma ORM :**
Alat (Object-Relational Mapping) yang digunakan untuk mengelola skema dan query PostgreSQL dari kode Next.js/TypeScript.

**Anggaran Bulanan (Budget) :**
Batas nominal pengeluaran yang ditetapkan pengguna untuk satu bulan tertentu.

**Budget Indicator :**
Komponen antarmuka yang menunjukkan status pemakaian anggaran (mis. aman, mendekati batas, melebihi anggaran) berdasarkan perbandingan pengeluaran terhadap anggaran yang ditetapkan.

---

*Dokumen ini merupakan draft sementara dan dapat berubah seiring pembahasan lebih lanjut dengan klien.*

---

# LAMPIRAN — Pembagian Tugas Programmer, Struktur Teknis & Alur Git

> Lampiran ini hanya mencakup pekerjaan **lanjutan** dari User Story 2 (audit/implementasi AJAX + modul Anggaran Bulanan). Struktur dan fitur dari User Story 1 yang sudah selesai **tidak diubah**, kecuali disebutkan secara eksplisit.

## A. Prinsip Pembagian

Pembagian dibuat **per fitur/per halaman**, sehingga masing-masing programmer dapat melihat langsung hasil UI dari bagian yang dikerjakannya, serta meminimalkan konflik berkas (file) di GitHub karena setiap programmer bekerja pada berkas yang berbeda sebisa mungkin.

| Programmer | Fokus Fitur | Halaman yang Bisa Dilihat Sendiri |
|---|---|---|
| **Programmer 1 (P1)** | AJAX pada Dashboard (saldo, total masuk/keluar, transaksi baru) | `/dashboard` |
| **Programmer 2 (P2)** | AJAX pada Manajemen Transaksi (ubah, hapus) + Filter Transaksi | `/transactions` |
| **Programmer 3 (P3)** | Fitur baru Anggaran Bulanan (set, ubah, ringkasan, indikator, pilih bulan) + skema Prisma `Budget` | `/budget` (halaman baru) |

## B. Struktur Folder Tambahan (di atas struktur yang sudah ada)

Berkas di bawah ini merupakan **tambahan** terhadap struktur `expense-tracker/` yang sudah selesai pada User Story 1. Tidak ada berkas dari struktur lama yang dihapus.

```
expense-tracker/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx                     # MODIFIKASI — Programmer 1
│   │   ├── transactions/
│   │   │   └── page.tsx                     # MODIFIKASI — Programmer 2
│   │   ├── budget/                          # BARU
│   │   │   └── page.tsx                     # BARU — Programmer 3
│   │   └── layout.tsx                       # (tidak diubah, kecuali tautan menu — lihat Catatan D)
│   ├── api/                                 # BARU (folder Route Handler untuk AJAX)
│   │   ├── dashboard/
│   │   │   └── summary/
│   │   │       └── route.ts                 # BARU — Programmer 1
│   │   ├── transactions/
│   │   │   ├── route.ts                     # BARU — Programmer 2 (GET list+filter, POST tambah)
│   │   │   └── [id]/
│   │   │       └── route.ts                 # BARU — Programmer 2 (PUT ubah, DELETE hapus)
│   │   └── budget/
│   │       └── route.ts                     # BARU — Programmer 3 (GET ringkasan per bulan, POST set/ubah)
├── components/
│   ├── Sidebar.tsx                          # MODIFIKASI (tambah menu "Anggaran") — Programmer 3 saja
│   ├── TransactionFilter.tsx                # MODIFIKASI (jadi AJAX) — Programmer 2
│   ├── DashboardSummaryCards.tsx            # BARU — Programmer 1
│   ├── TransactionForm.tsx                  # BARU (form transaksi baru versi AJAX) — Programmer 1
│   ├── TransactionTable.tsx                 # BARU (tabel ubah/hapus versi AJAX) — Programmer 2
│   ├── BudgetForm.tsx                       # BARU — Programmer 3
│   ├── BudgetSummary.tsx                    # BARU — Programmer 3
│   ├── BudgetIndicator.tsx                  # BARU — Programmer 3
│   └── MonthPicker.tsx                      # BARU — Programmer 3
├── lib/
│   ├── actions/
│   │   ├── transactionActions.ts            # MODIFIKASI (logika dipakai ulang oleh Route Handler) — Programmer 2
│   │   └── budgetActions.ts                 # BARU — Programmer 3
├── prisma/
│   ├── schema.prisma                        # MODIFIKASI (tambah model Budget) — Programmer 3
│   └── migrations/
│       └── 004_create_budget/               # BARU — Programmer 3
```

**Catatan mengenai perubahan struktur:** seluruh berkas di atas yang ditandai **BARU** adalah tambahan di luar struktur folder yang sebelumnya dilaporkan sudah selesai. Tidak ada berkas dari struktur lama yang dikurangi/dihapus.

## C. Penambahan Skema Prisma (Model `Budget`)

Model berikut **diusulkan** sebagai tambahan pada `prisma/schema.prisma`, dikerjakan oleh **Programmer 3**:

```prisma
model Budget {
  id              Int      @id @default(autoincrement())
  userId          Int
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  bulan           Int      // 1-12
  tahun           Int
  jumlahAnggaran  Int
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([userId, bulan, tahun])
}
```

Serta tambahan relasi pada model `User` yang sudah ada:

```prisma
model User {
  id           Int           @id @default(autoincrement())
  name         String
  email        String        @unique
  password     String
  transactions Transaction[]
  sessions     Session[]
  budgets      Budget[]      // BARU
}
```

**Karena `schema.prisma` adalah berkas bersama (shared file):**
- Hanya **Programmer 3** yang mengubah berkas ini pada iterasi ini.
- Programmer 1 dan Programmer 2 **tidak perlu** menunggu perubahan ini untuk mengerjakan bagian AJAX dashboard/transaksi, karena keduanya tidak menyentuh model `Budget`.
- Setelah PR Programmer 3 di-merge ke `main`, Programmer 1 dan Programmer 2 wajib menjalankan `git pull origin main`, lalu `npx prisma generate` ulang sebelum melanjutkan pekerjaan, agar Prisma Client di lokal masing-masing tetap sinkron.

## D. Environment Variable

Berkas `.env` (tidak di-commit ke GitHub, tetap mengikuti `.gitignore` yang sudah ada) berisi:

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/NAMA_DATABASE"
```

Setiap programmer mengisi `USERNAME`, `PASSWORD`, dan `NAMA_DATABASE` sesuai environment PostgreSQL lokal masing-masing. Nilai `DATABASE_URL` **tidak perlu sama** antar programmer selama skema database (`prisma/schema.prisma`) yang digunakan identik dengan versi di `main`.

## E. Alur Kerja Git & Pull Request (dari Terminal, menggunakan `gh`)

Nama branch per programmer:

| Programmer | Nama Branch |
|---|---|
| Programmer 1 | `feat/ajax-dashboard-p1` |
| Programmer 2 | `feat/ajax-transaction-filter-p2` |
| Programmer 3 | `feat/monthly-budget-p3` |

Langkah yang sama berlaku untuk ketiga programmer (contoh memakai Programmer 1; ganti nama branch sesuai tabel di atas):

1. **Pastikan berada di branch `main` terbaru**
   ```
   git checkout main
   git pull origin main
   ```

2. **Buat branch baru dari `main`**
   ```
   git checkout -b feat/ajax-dashboard-p1
   ```

3. **Kerjakan perubahan sesuai berkas yang menjadi tanggung jawab (lihat Lampiran B), lalu cek status**
   ```
   git status
   ```

4. **Stage dan commit perubahan dengan pesan yang jelas**
   ```
   git add .
   git commit -m "feat(dashboard): implementasi AJAX untuk saldo, total, dan transaksi baru"
   ```

5. **Push branch ke GitHub**
   ```
   git push -u origin feat/ajax-dashboard-p1
   ```

6. **Buat Pull Request dari terminal menggunakan `gh`**
   ```
   gh pr create --base main --head feat/ajax-dashboard-p1 --title "AJAX Dashboard (Programmer 1)" --body "Mengimplementasikan pengambilan data dashboard dan penambahan transaksi baru secara AJAX tanpa reload halaman."
   ```

7. **(Opsional) Cek status PR dari terminal**
   ```
   gh pr status
   ```

8. **Setelah PR direview dan disetujui, merge dari terminal**
   ```
   gh pr merge feat/ajax-dashboard-p1 --squash --delete-branch
   ```

9. **Programmer lain menyinkronkan `main` setelah ada PR yang di-merge, sebelum melanjutkan pekerjaan**
   ```
   git checkout main
   git pull origin main
   ```
   Jika sedang berada di branch fitur sendiri dan ingin membawa update `main` terbaru ke branch tersebut:
   ```
   git checkout feat/ajax-transaction-filter-p2
   git merge main
   ```

Urutan rekomendasi merge untuk meminimalkan konflik: **Programmer 3 (skema Prisma + fitur Budget) disarankan merge lebih dahulu** apabila memungkinkan, karena satu-satunya yang mengubah `prisma/schema.prisma`. Programmer 1 dan Programmer 2 dapat bekerja paralel karena menyentuh berkas yang sepenuhnya berbeda satu sama lain.

## F. Catatan Tambahan

- **Setelah clone repository**, setiap programmer wajib melakukan langkah berikut agar `localhost` dapat dibuka:
  1. `npm install`
  2. Membuat berkas `.env` sendiri berisi `DATABASE_URL` sesuai PostgreSQL lokal masing-masing (lihat Lampiran D).
  3. `npx prisma generate`
  4. `npx prisma migrate dev` (untuk menerapkan migrasi, termasuk migrasi `Budget` setelah PR Programmer 3 di-merge dan branch masing-masing sudah menarik update tersebut).
  5. `npm run dev`, lalu buka `http://localhost:3000`.
- **Jika ada kebutuhan menambah atau mengurangi berkas di luar daftar pada Lampiran B**, programmer yang bersangkutan wajib menginformasikan ke tim (PM + programmer lain) terlebih dahulu sebelum melakukan perubahan, agar tidak menimbulkan konflik tak terduga.
- **Jika suatu pekerjaan membutuhkan dependensi dari pekerjaan programmer lain** (misalnya Programmer 1 membutuhkan komponen atau endpoint yang sedang dikerjakan Programmer 3), programmer tersebut wajib mengomunikasikannya terlebih dahulu ke tim sebelum mulai bekerja, agar urutan pengerjaan dan merge dapat disesuaikan. Berdasarkan pembagian pada Lampiran A dan B, ketiga programmer pada iterasi ini dirancang **tidak saling bergantung langsung**, kecuali ketergantungan satu arah pada `prisma/schema.prisma` milik Programmer 3 seperti dijelaskan pada Lampiran C.
