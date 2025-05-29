/*
  Warnings:

  - You are about to drop the column `changes` on the `th_artist_hist` table. All the data in the column will be lost.
  - You are about to drop the column `changes` on the `th_event_hist` table. All the data in the column will be lost.
  - You are about to drop the column `changes` on the `th_party_house_hist` table. All the data in the column will be lost.
  - You are about to drop the column `changes` on the `th_ticket_hist` table. All the data in the column will be lost.
  - You are about to drop the column `changes` on the `th_ticket_type_hist` table. All the data in the column will be lost.
  - You are about to drop the column `changes` on the `th_user_hist` table. All the data in the column will be lost.
  - You are about to drop the column `dt_criacao` on the `th_user_hist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_ticket_type" ADD COLUMN     "dt_alteracao" TIMESTAMP(3),
ADD COLUMN     "dt_criacao" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "th_artist_hist" DROP COLUMN "changes";

-- AlterTable
ALTER TABLE "th_event_hist" DROP COLUMN "changes";

-- AlterTable
ALTER TABLE "th_party_house_hist" DROP COLUMN "changes";

-- AlterTable
ALTER TABLE "th_ticket_hist" DROP COLUMN "changes";

-- AlterTable
ALTER TABLE "th_ticket_type_hist" DROP COLUMN "changes",
ADD COLUMN     "dt_alteracao" TIMESTAMP(3),
ALTER COLUMN "dt_criacao" DROP NOT NULL,
ALTER COLUMN "dt_criacao" DROP DEFAULT;

-- AlterTable
ALTER TABLE "th_user_hist" DROP COLUMN "changes",
DROP COLUMN "dt_criacao";
