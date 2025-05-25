/*
  Warnings:

  - Added the required column `ticketName` to the `tb_ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_ticket" ADD COLUMN     "ticketName" TEXT NOT NULL;
