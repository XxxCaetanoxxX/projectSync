-- DropForeignKey
ALTER TABLE "tb_event_image" DROP CONSTRAINT "tb_event_image_eventId_fkey";

-- AddForeignKey
ALTER TABLE "tb_event_image" ADD CONSTRAINT "tb_event_image_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
