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
    "imageId" INTEGER,
    "dt_criacao" TIMESTAMP(3),
    "dt_alteracao" TIMESTAMP(3),
    "operation" TEXT,
    "endpoint_modificador" TEXT,
    "nu_versao" INTEGER,
    "modified_by_id" INTEGER,
    "modified_by_name" TEXT,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "th_user_hist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "imageId" INTEGER,
    "user_id" INTEGER NOT NULL,
    "dt_criacao" TIMESTAMP(3),
    "dt_alteracao" TIMESTAMP(3),
    "operation" TEXT,
    "endpoint_modificador" TEXT,
    "nu_versao" INTEGER,
    "modified_by_id" INTEGER,
    "modified_by_name" TEXT,

    CONSTRAINT "th_user_hist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_image" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "tb_user_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_ticket_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "dt_criacao" TIMESTAMP(3),
    "dt_alteracao" TIMESTAMP(3),
    "operation" TEXT,
    "endpoint_modificador" TEXT,
    "nu_versao" INTEGER,
    "modified_by_id" INTEGER,
    "modified_by_name" TEXT,

    CONSTRAINT "tb_ticket_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "th_ticket_type_hist" (
    "id" SERIAL NOT NULL,
    "ticket_type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "dt_criacao" TIMESTAMP(3),
    "dt_alteracao" TIMESTAMP(3),
    "operation" TEXT,
    "endpoint_modificador" TEXT,
    "nu_versao" INTEGER,
    "modified_by_id" INTEGER,
    "modified_by_name" TEXT,

    CONSTRAINT "th_ticket_type_hist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_ticket" (
    "id" SERIAL NOT NULL,
    "ticketName" TEXT NOT NULL,
    "ticketTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "th_ticket_hist" (
    "id" SERIAL NOT NULL,
    "modified_by_id" INTEGER NOT NULL,
    "modified_by_name" TEXT NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "th_ticket_hist_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "th_event_hist" (
    "id" SERIAL NOT NULL,
    "modified_by_id" INTEGER NOT NULL,
    "modified_by_name" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "th_event_hist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_event_image" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "tb_event_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tb_artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "th_artist_hist" (
    "id" SERIAL NOT NULL,
    "modified_by_id" INTEGER NOT NULL,
    "modified_by_name" TEXT NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "th_artist_hist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_artist_on_event" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "tb_artist_on_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_party_house" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "tb_party_house_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "th_party_house_hist" (
    "id" SERIAL NOT NULL,
    "modified_by_id" INTEGER NOT NULL,
    "modified_by_name" TEXT NOT NULL,
    "party_house_id" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "th_party_house_hist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_cpf_key" ON "tb_user"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_phone_key" ON "tb_user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_imageId_key" ON "tb_user"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_image_userId_key" ON "tb_user_image"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_ticket_ticketTypeId_userId_key" ON "tb_ticket"("ticketTypeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_artist_on_event_artistId_eventId_key" ON "tb_artist_on_event"("artistId", "eventId");

-- AddForeignKey
ALTER TABLE "tb_user_image" ADD CONSTRAINT "tb_user_image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_ticket_type" ADD CONSTRAINT "tb_ticket_type_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_ticket" ADD CONSTRAINT "tb_ticket_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "tb_ticket_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_ticket" ADD CONSTRAINT "tb_ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_event" ADD CONSTRAINT "tb_event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_event" ADD CONSTRAINT "tb_event_partyHouseId_fkey" FOREIGN KEY ("partyHouseId") REFERENCES "tb_party_house"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_event_image" ADD CONSTRAINT "tb_event_image_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_artist_on_event" ADD CONSTRAINT "tb_artist_on_event_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "tb_artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_artist_on_event" ADD CONSTRAINT "tb_artist_on_event_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tb_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
