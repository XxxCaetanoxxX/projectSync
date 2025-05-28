-- CreateTable
CREATE TABLE "th_ticket_type_hist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "endpoint_modificador" TEXT NOT NULL,

    CONSTRAINT "th_ticket_type_hist_pkey" PRIMARY KEY ("id")
);
