/*
  Warnings:

  - You are about to drop the `artistevent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `artistevent` DROP FOREIGN KEY `ArtistEvent_artistId_fkey`;

-- DropForeignKey
ALTER TABLE `artistevent` DROP FOREIGN KEY `ArtistEvent_eventId_fkey`;

-- DropTable
DROP TABLE `artistevent`;

-- CreateTable
CREATE TABLE `artist_event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `artistId` INTEGER NOT NULL,
    `eventId` INTEGER NOT NULL,

    UNIQUE INDEX `artist_event_artistId_eventId_key`(`artistId`, `eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `artist_event` ADD CONSTRAINT `artist_event_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `artist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artist_event` ADD CONSTRAINT `artist_event_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_cpf_key` TO `user_cpf_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;
