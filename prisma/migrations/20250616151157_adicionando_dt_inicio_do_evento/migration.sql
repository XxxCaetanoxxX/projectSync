/*
  Warnings:

  - You are about to drop the column `quantity` on the `tb_batch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_batch" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "tb_event" ADD COLUMN     "dt_fim" TIMESTAMP(3),
ADD COLUMN     "dt_inicio" TIMESTAMP(3);
