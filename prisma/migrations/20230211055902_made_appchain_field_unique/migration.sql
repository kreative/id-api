/*
  Warnings:

  - A unique constraint covering the columns `[appchain]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Application_appchain_key" ON "Application"("appchain");
