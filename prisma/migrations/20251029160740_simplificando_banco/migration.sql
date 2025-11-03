/*
  Warnings:

  - You are about to drop the `tb_artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_artist_on_event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_party_house` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `th_artist_hist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `th_party_house_hist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_artist_on_event" DROP CONSTRAINT "tb_artist_on_event_artistId_fkey";

-- DropForeignKey
ALTER TABLE "tb_artist_on_event" DROP CONSTRAINT "tb_artist_on_event_eventId_fkey";

-- DropForeignKey
ALTER TABLE "tb_event" DROP CONSTRAINT "tb_event_partyHouseId_fkey";

-- DropTable
DROP TABLE "tb_artist";

-- DropTable
DROP TABLE "tb_artist_on_event";

-- DropTable
DROP TABLE "tb_party_house";

-- DropTable
DROP TABLE "th_artist_hist";

-- DropTable
DROP TABLE "th_party_house_hist";
