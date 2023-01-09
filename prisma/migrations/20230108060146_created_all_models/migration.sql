-- CreateTable
CREATE TABLE "Account" (
    "ksn" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneCountryCode" INTEGER,
    "phoneNumber" INTEGER,
    "bpassword" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "walletBalance" INTEGER NOT NULL,
    "resetCode" INTEGER NOT NULL,
    "permissions" TEXT[],

    CONSTRAINT "Account_pkey" PRIMARY KEY ("ksn")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ksn" BIGINT NOT NULL,
    "aidn" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keychain" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ksn" BIGINT NOT NULL,
    "aidn" BIGINT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Keychain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "aidn" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("aidn")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_ksn_fkey" FOREIGN KEY ("ksn") REFERENCES "Account"("ksn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_aidn_fkey" FOREIGN KEY ("aidn") REFERENCES "Application"("aidn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keychain" ADD CONSTRAINT "Keychain_ksn_fkey" FOREIGN KEY ("ksn") REFERENCES "Account"("ksn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keychain" ADD CONSTRAINT "Keychain_aidn_fkey" FOREIGN KEY ("aidn") REFERENCES "Application"("aidn") ON DELETE CASCADE ON UPDATE CASCADE;
