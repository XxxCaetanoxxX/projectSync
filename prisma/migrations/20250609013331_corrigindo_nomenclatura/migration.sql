/*
  Warnings:

  - You are about to drop the column `batchId` on the `tb_ticket` table. All the data in the column will be lost.
  - Added the required column `batch_id` to the `tb_ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_ticket" DROP CONSTRAINT "tb_ticket_batchId_fkey";

-- AlterTable
ALTER TABLE "tb_ticket" DROP COLUMN "batchId",
ADD COLUMN     "batch_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_ticket" ADD CONSTRAINT "tb_ticket_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "tb_batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
