-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SERTANEJO', 'PAGODE', 'ROCK', 'GENERICO');

-- AlterTable
ALTER TABLE "tb_event" ADD COLUMN     "tp_evento" "EventType" NOT NULL DEFAULT 'GENERICO';
