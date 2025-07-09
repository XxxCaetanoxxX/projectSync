/*
  Warnings:

  - Added the required column `code` to the `th_ticket_hist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isUsed` to the `th_ticket_hist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "th_ticket_hist" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "dt_validation" TIMESTAMP(3),
ADD COLUMN     "isUsed" BOOLEAN NOT NULL;
