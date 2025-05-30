-- AlterTable
ALTER TABLE "tb_ticket_type" ADD COLUMN     "endpoint_modificador" TEXT,
ADD COLUMN     "modified_by_id" INTEGER,
ADD COLUMN     "modified_by_name" TEXT,
ADD COLUMN     "nu_versao" INTEGER,
ALTER COLUMN "operation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "th_ticket_type_hist" ADD COLUMN     "nu_versao" INTEGER,
ALTER COLUMN "operation" DROP NOT NULL,
ALTER COLUMN "endpoint_modificador" DROP NOT NULL,
ALTER COLUMN "modified_by_name" DROP NOT NULL,
ALTER COLUMN "modified_by_id" DROP NOT NULL;
