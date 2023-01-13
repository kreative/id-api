/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ksn` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Application` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `aidn` on the `Application` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `ksn` on the `Keychain` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `aidn` on the `Keychain` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `ksn` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `aidn` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "Keychain" DROP CONSTRAINT "Keychain_aidn_fkey";

-- DropForeignKey
ALTER TABLE "Keychain" DROP CONSTRAINT "Keychain_ksn_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_aidn_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_ksn_fkey";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
ALTER COLUMN "ksn" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("ksn");

-- AlterTable
ALTER TABLE "Application" DROP CONSTRAINT "Application_pkey",
ALTER COLUMN "aidn" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Application_pkey" PRIMARY KEY ("aidn");

-- AlterTable
ALTER TABLE "Keychain" ALTER COLUMN "ksn" SET DATA TYPE INTEGER,
ALTER COLUMN "aidn" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "ksn" SET DATA TYPE INTEGER,
ALTER COLUMN "aidn" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_ksn_fkey" FOREIGN KEY ("ksn") REFERENCES "Account"("ksn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_aidn_fkey" FOREIGN KEY ("aidn") REFERENCES "Application"("aidn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keychain" ADD CONSTRAINT "Keychain_ksn_fkey" FOREIGN KEY ("ksn") REFERENCES "Account"("ksn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keychain" ADD CONSTRAINT "Keychain_aidn_fkey" FOREIGN KEY ("aidn") REFERENCES "Application"("aidn") ON DELETE CASCADE ON UPDATE CASCADE;
