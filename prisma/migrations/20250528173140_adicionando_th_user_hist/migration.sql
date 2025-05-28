-- CreateTable
CREATE TABLE "th_user_hist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "th_user_hist_pkey" PRIMARY KEY ("id")
);
