/*
  Warnings:

  - You are about to drop the column `countryPreferences` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `delegationType` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "countryPreferences",
DROP COLUMN "delegationType",
DROP COLUMN "experience";
