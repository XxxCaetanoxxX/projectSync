-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('CREDENTIAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "tb_user" ADD COLUMN     "authType" "AuthType" NOT NULL DEFAULT 'CREDENTIAL',
ALTER COLUMN "password" DROP NOT NULL;
