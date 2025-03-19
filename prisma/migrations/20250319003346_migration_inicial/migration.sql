-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ORGANIZER', 'PARTICIPANT');

-- CreateTable
CREATE TABLE "tb_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_party_house" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "tb_party_house_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "organizerId" INTEGER NOT NULL,
    "partyHouseId" INTEGER NOT NULL,

    CONSTRAINT "tb_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tb_artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_artist_event" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "tb_artist_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_event_participant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "tb_event_participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_cpf_key" ON "tb_user"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_phone_key" ON "tb_user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "tb_artist_event_artistId_eventId_key" ON "tb_artist_event"("artistId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_event_participant_userId_eventId_key" ON "tb_event_participant"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "tb_event" ADD CONSTRAINT "tb_event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_event" ADD CONSTRAINT "tb_event_partyHouseId_fkey" FOREIGN KEY ("partyHouseId") REFERENCES "tb_party_house"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_artist_event" ADD CONSTRAINT "tb_artist_event_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "tb_artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_artist_event" ADD CONSTRAINT "tb_artist_event_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_event_participant" ADD CONSTRAINT "tb_event_participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_event_participant" ADD CONSTRAINT "tb_event_participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
