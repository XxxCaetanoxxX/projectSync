/*
  Warnings:

  - You are about to drop the column `endpoint_modificador` on the `tb_ticket_type` table. All the data in the column will be lost.
  - You are about to drop the column `modified_by_id` on the `tb_ticket_type` table. All the data in the column will be lost.
  - You are about to drop the column `modified_by_name` on the `tb_ticket_type` table. All the data in the column will be lost.
  - You are about to drop the column `nu_versao` on the `tb_ticket_type` table. All the data in the column will be lost.
  - You are about to drop the column `nu_versao` on the `th_ticket_type_hist` table. All the data in the column will be lost.
  - Changed the type of `modified_by_id` on the `th_ticket_type_hist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tb_ticket_type" DROP COLUMN "endpoint_modificador",
DROP COLUMN "modified_by_id",
DROP COLUMN "modified_by_name",
DROP COLUMN "nu_versao",
ALTER COLUMN "dt_criacao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "th_ticket_type_hist" DROP COLUMN "nu_versao",
ALTER COLUMN "dt_criacao" DROP NOT NULL,
DROP COLUMN "modified_by_id",
ADD COLUMN     "modified_by_id" INTEGER NOT NULL;
