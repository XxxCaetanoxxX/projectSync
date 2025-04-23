/*
  Warnings:

  - You are about to drop the `tb_artist_event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_artist_event" DROP CONSTRAINT "tb_artist_event_artistId_fkey";

-- DropForeignKey
ALTER TABLE "tb_artist_event" DROP CONSTRAINT "tb_artist_event_eventId_fkey";

-- DropTable
DROP TABLE "tb_artist_event";

-- CreateTable
CREATE TABLE "tb_ticket_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "tb_ticket_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_ticket" (
    "id" SERIAL NOT NULL,
    "ticketTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_artist_on_event" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "tb_artist_on_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_ticket_ticketTypeId_userId_key" ON "tb_ticket"("ticketTypeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_artist_on_event_artistId_eventId_key" ON "tb_artist_on_event"("artistId", "eventId");

-- AddForeignKey
ALTER TABLE "tb_ticket_type" ADD CONSTRAINT "tb_ticket_type_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_ticket" ADD CONSTRAINT "tb_ticket_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "tb_ticket_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_ticket" ADD CONSTRAINT "tb_ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_artist_on_event" ADD CONSTRAINT "tb_artist_on_event_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "tb_artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_artist_on_event" ADD CONSTRAINT "tb_artist_on_event_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
