-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '#',
ADD COLUMN     "homepage" TEXT NOT NULL DEFAULT '#',
ADD COLUMN     "iconBlack" TEXT NOT NULL DEFAULT '#',
ADD COLUMN     "iconColor" TEXT NOT NULL DEFAULT '#',
ADD COLUMN     "iconWhite" TEXT NOT NULL DEFAULT '#',
ADD COLUMN     "logoBlack" TEXT NOT NULL DEFAULT '#',
ADD COLUMN     "logoColor" TEXT NOT NULL DEFAULT '#',
ADD COLUMN     "logoWhite" TEXT NOT NULL DEFAULT '#';
