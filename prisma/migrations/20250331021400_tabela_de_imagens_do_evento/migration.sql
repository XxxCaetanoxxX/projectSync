-- CreateTable
CREATE TABLE "tb_event_image" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "tb_event_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_event_image" ADD CONSTRAINT "tb_event_image_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
