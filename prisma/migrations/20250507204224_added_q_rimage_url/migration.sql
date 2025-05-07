/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `qrImageUrl` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Participant_qrCode_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "qrCode",
ADD COLUMN     "qrImageUrl" TEXT NOT NULL;
