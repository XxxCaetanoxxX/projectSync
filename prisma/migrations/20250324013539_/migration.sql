/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `tb_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tb_user" ADD COLUMN     "imageId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_imageId_key" ON "tb_user"("imageId");
