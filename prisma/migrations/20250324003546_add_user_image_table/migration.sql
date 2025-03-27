/*
  Warnings:

  - You are about to drop the column `photo` on the `tb_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_user" DROP COLUMN "photo";

-- CreateTable
CREATE TABLE "tb_user_image" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "tb_user_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_image_userId_key" ON "tb_user_image"("userId");

-- AddForeignKey
ALTER TABLE "tb_user_image" ADD CONSTRAINT "tb_user_image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
