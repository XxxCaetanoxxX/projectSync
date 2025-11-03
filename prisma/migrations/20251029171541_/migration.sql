/*
  Warnings:

  - The `tp_evento` column on the `tb_event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tp_evento` column on the `th_event_hist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EventEnum" AS ENUM ('SERTANEJO', 'PAGODE', 'ROCK', 'GENERICO');

-- AlterTable
ALTER TABLE "tb_event" DROP COLUMN "tp_evento",
ADD COLUMN     "tp_evento" "EventEnum" DEFAULT 'GENERICO';

-- AlterTable
ALTER TABLE "th_event_hist" DROP COLUMN "tp_evento",
ADD COLUMN     "tp_evento" "EventEnum" DEFAULT 'GENERICO';

-- DropEnum
DROP TYPE "EventType";
