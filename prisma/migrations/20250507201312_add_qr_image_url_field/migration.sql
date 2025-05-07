-- DropIndex
DROP INDEX "Participant_email_key";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "qrImageUrl" TEXT;
