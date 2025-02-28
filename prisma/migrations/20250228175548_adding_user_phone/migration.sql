/*
  Warnings:

  - Added the required column `phone` to the `tb_user` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `tb_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tb_user` ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
