-- AlterTable
ALTER TABLE "tb_batch" ADD COLUMN     "changes" TEXT DEFAULT '',
ADD COLUMN     "dt_alteracao" TIMESTAMP(3),
ADD COLUMN     "dt_criacao" TIMESTAMP(3),
ADD COLUMN     "endpoint_modificador" TEXT,
ADD COLUMN     "modified_by_id" INTEGER,
ADD COLUMN     "modified_by_name" TEXT,
ADD COLUMN     "nu_versao" INTEGER,
ADD COLUMN     "operation" TEXT;

-- CreateTable
CREATE TABLE "th_batch_hist" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "ticket_type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "dt_criacao" TIMESTAMP(3),
    "dt_alteracao" TIMESTAMP(3),
    "operation" TEXT,
    "endpoint_modificador" TEXT,
    "nu_versao" INTEGER,
    "modified_by_id" INTEGER,
    "modified_by_name" TEXT,
    "changes" TEXT DEFAULT '',

    CONSTRAINT "th_batch_hist_pkey" PRIMARY KEY ("id")
);
