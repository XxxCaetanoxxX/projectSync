/*
  Warnings:

  - Made the column `name` on table `event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `name` VARCHAR(191) NOT NULL;
