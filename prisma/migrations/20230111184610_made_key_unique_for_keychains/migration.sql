/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Keychain` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Keychain_key_key" ON "Keychain"("key");
