/*
  Warnings:

  - Added the required column `code` to the `tb_ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isUsed` to the `tb_ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_password_reset" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tb_ticket" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "dt_validation" TIMESTAMP(3),
ADD COLUMN     "isUsed" BOOLEAN NOT NULL;
