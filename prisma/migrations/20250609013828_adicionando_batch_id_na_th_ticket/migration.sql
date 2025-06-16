/*
  Warnings:

  - Added the required column `batch_id` to the `th_ticket_hist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "th_ticket_hist" ADD COLUMN     "batch_id" INTEGER NOT NULL;
