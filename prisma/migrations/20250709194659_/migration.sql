/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `tb_ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_ticket_code_key" ON "tb_ticket"("code");
