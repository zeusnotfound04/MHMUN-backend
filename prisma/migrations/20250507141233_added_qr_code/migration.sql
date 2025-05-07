/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qrCode` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "qrCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_qrCode_key" ON "Participant"("qrCode");
