/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "profilePicture" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_id_key" ON "Participant"("id");
