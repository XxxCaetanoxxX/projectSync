/*
  Warnings:

  - Made the column `dt_fim` on table `tb_event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dt_inicio` on table `tb_event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tb_event" ALTER COLUMN "dt_fim" SET NOT NULL,
ALTER COLUMN "dt_inicio" SET NOT NULL;
