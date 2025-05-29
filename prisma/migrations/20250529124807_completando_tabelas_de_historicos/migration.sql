-- CreateTable
CREATE TABLE "th_ticket_hist" (
    "id" SERIAL NOT NULL,
    "modified_by_id" INTEGER NOT NULL,
    "modified_by_name" TEXT NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,
    "changes" TEXT NOT NULL DEFAULT '',
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "th_ticket_hist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "th_event_hist" (
    "id" SERIAL NOT NULL,
    "modified_by_id" INTEGER NOT NULL,
    "modified_by_name" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,
    "changes" TEXT NOT NULL DEFAULT '',
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "th_event_hist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "th_artist_hist" (
    "id" SERIAL NOT NULL,
    "modified_by_id" INTEGER NOT NULL,
    "modified_by_name" TEXT NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,
    "changes" TEXT NOT NULL DEFAULT '',
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "th_artist_hist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "th_party_house_hist" (
    "id" SERIAL NOT NULL,
    "modified_by_id" INTEGER NOT NULL,
    "modified_by_name" TEXT NOT NULL,
    "party_house_id" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,
    "changes" TEXT NOT NULL DEFAULT '',
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "th_party_house_hist_pkey" PRIMARY KEY ("id")
);
