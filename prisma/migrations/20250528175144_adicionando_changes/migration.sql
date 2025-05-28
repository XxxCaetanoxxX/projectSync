-- AlterTable
ALTER TABLE "th_ticket_type_hist" ADD COLUMN     "changes" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "th_user_hist" ADD COLUMN     "changes" TEXT NOT NULL DEFAULT '';
