/*
  Warnings:

  - You are about to drop the column `roomId` on the `Gifts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Gifts" DROP CONSTRAINT "Gifts_roomId_fkey";

-- AlterTable
ALTER TABLE "Gifts" DROP COLUMN "roomId";

-- CreateTable
CREATE TABLE "RoomGifts" (
    "giftId" VARCHAR(255) NOT NULL,
    "roomId" UUID NOT NULL,

    CONSTRAINT "RoomGifts_pkey" PRIMARY KEY ("giftId","roomId")
);

-- AddForeignKey
ALTER TABLE "RoomGifts" ADD CONSTRAINT "RoomGifts_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomGifts" ADD CONSTRAINT "RoomGifts_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
