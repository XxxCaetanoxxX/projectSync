-- DropForeignKey
ALTER TABLE `artist_event` DROP FOREIGN KEY `artist_event_artistId_fkey`;

-- DropForeignKey
ALTER TABLE `artist_event` DROP FOREIGN KEY `artist_event_eventId_fkey`;

-- DropIndex
DROP INDEX `artist_event_eventId_fkey` ON `artist_event`;

-- AddForeignKey
ALTER TABLE `artist_event` ADD CONSTRAINT `artist_event_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `artist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artist_event` ADD CONSTRAINT `artist_event_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
