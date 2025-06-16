/*
  Warnings:

  - You are about to drop the column `dt_fim` on the `tb_event` table. All the data in the column will be lost.
  - You are about to drop the column `dt_inicio` on the `tb_event` table. All the data in the column will be lost.
  - Added the required column `dt_end` to the `tb_event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_start` to the `tb_event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_end` to the `th_event_hist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_start` to the `th_event_hist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_event" DROP COLUMN "dt_fim",
DROP COLUMN "dt_inicio",
ADD COLUMN     "dt_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "th_event_hist" ADD COLUMN     "dt_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nu_ingressos" INTEGER NOT NULL DEFAULT 1000;
