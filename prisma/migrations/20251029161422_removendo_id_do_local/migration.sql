/*
  Warnings:

  - You are about to drop the column `partyHouseId` on the `tb_event` table. All the data in the column will be lost.
  - You are about to drop the column `partyHouseId` on the `th_event_hist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_event" DROP COLUMN "partyHouseId";

-- AlterTable
ALTER TABLE "th_event_hist" DROP COLUMN "partyHouseId";
