/*
  Warnings:

  - Added the required column `endpoint_modificador` to the `tb_ticket_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified_by_id` to the `tb_ticket_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified_by_name` to the `tb_ticket_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nu_versao` to the `tb_ticket_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operation` to the `tb_ticket_type` table without a default value. This is not possible if the table is not empty.
  - Made the column `dt_criacao` on table `tb_ticket_type` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `nu_versao` to the `th_ticket_type_hist` table without a default value. This is not possible if the table is not empty.
  - Made the column `dt_criacao` on table `th_ticket_type_hist` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tb_ticket_type" ADD COLUMN     "endpoint_modificador" TEXT NOT NULL,
ADD COLUMN     "modified_by_id" TEXT NOT NULL,
ADD COLUMN     "modified_by_name" TEXT NOT NULL,
ADD COLUMN     "nu_versao" INTEGER NOT NULL,
ADD COLUMN     "operation" TEXT NOT NULL,
ALTER COLUMN "dt_criacao" SET NOT NULL;

-- AlterTable
ALTER TABLE "th_ticket_type_hist" ADD COLUMN     "nu_versao" INTEGER NOT NULL,
ALTER COLUMN "dt_criacao" SET NOT NULL,
ALTER COLUMN "modified_by_id" SET DATA TYPE TEXT;
