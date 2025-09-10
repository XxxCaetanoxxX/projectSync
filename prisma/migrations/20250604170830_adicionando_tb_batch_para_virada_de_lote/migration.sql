/*
  Warnings:

  - You are about to drop the column `price` on the `tb_ticket_type` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `th_ticket_type_hist` table. All the data in the column will be lost.
  - Added the required column `batchId` to the `tb_ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_ticket" ADD COLUMN     "batchId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tb_ticket_type" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "th_ticket_type_hist" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "tb_batch" (
    "id" SERIAL NOT NULL,
    "ticket_type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_batch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_ticket" ADD CONSTRAINT "tb_ticket_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "tb_batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_batch" ADD CONSTRAINT "tb_batch_ticket_type_id_fkey" FOREIGN KEY ("ticket_type_id") REFERENCES "tb_ticket_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
