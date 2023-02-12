/*
  Warnings:

  - You are about to drop the column `iconBlack` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `iconColor` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `iconWhite` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `logoBlack` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `logoColor` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `logoWhite` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "iconBlack",
DROP COLUMN "iconColor",
DROP COLUMN "iconWhite",
DROP COLUMN "logoBlack",
DROP COLUMN "logoColor",
DROP COLUMN "logoWhite",
ADD COLUMN     "iconUrl" TEXT NOT NULL DEFAULT '#',
ADD COLUMN     "logoUrl" TEXT NOT NULL DEFAULT '#';
