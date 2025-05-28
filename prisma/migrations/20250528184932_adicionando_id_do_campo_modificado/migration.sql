/*
  Warnings:

  - You are about to drop the column `user_id` on the `th_ticket_type_hist` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `th_ticket_type_hist` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `th_user_hist` table. All the data in the column will be lost.
  - Added the required column `modified_by_id` to the `th_ticket_type_hist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified_by_name` to the `th_ticket_type_hist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_type_id` to the `th_ticket_type_hist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified_by_id` to the `th_user_hist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified_by_name` to the `th_user_hist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "th_ticket_type_hist" DROP COLUMN "user_id",
DROP COLUMN "user_name",
ADD COLUMN     "modified_by_id" INTEGER NOT NULL,
ADD COLUMN     "modified_by_name" TEXT NOT NULL,
ADD COLUMN     "ticket_type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "th_user_hist" DROP COLUMN "user_name",
ADD COLUMN     "modified_by_id" INTEGER NOT NULL,
ADD COLUMN     "modified_by_name" TEXT NOT NULL;
