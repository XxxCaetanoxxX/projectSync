/*
  Warnings:

  - You are about to drop the `tb_event_participant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_event_participant" DROP CONSTRAINT "tb_event_participant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "tb_event_participant" DROP CONSTRAINT "tb_event_participant_userId_fkey";

-- DropTable
DROP TABLE "tb_event_participant";
