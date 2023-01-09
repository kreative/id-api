-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "emailVerified" SET DEFAULT false,
ALTER COLUMN "profilePicture" SET DEFAULT '#',
ALTER COLUMN "walletBalance" SET DEFAULT 0,
ALTER COLUMN "resetCode" SET DEFAULT 0;
