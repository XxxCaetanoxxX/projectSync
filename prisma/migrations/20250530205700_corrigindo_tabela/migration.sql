/*
  Warnings:

  - Added the required column `eventId` to the `th_ticket_type_hist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `th_ticket_type_hist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `th_ticket_type_hist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `th_ticket_type_hist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "th_ticket_type_hist" ADD COLUMN     "eventId" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
