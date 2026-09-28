CREATE TABLE "Budget" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jumlahAnggaran" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Budget_bulan_check" CHECK ("bulan" >= 1 AND "bulan" <= 12),
    CONSTRAINT "Budget_tahun_check" CHECK ("tahun" >= 1 AND "tahun" <= 9999),
    CONSTRAINT "Budget_jumlahAnggaran_check" CHECK ("jumlahAnggaran" > 0)
);

CREATE UNIQUE INDEX "Budget_userId_bulan_tahun_key"
ON "Budget"("userId", "bulan", "tahun");

ALTER TABLE "Budget"
ADD CONSTRAINT "Budget_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
