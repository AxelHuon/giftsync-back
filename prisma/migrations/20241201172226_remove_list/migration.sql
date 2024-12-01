/*
  Warnings:

  - You are about to drop the column `listId` on the `Gifts` table. All the data in the column will be lost.
  - You are about to drop the `Lists` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Gifts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Gifts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gifts" DROP CONSTRAINT "Gifts_listId_fkey";

-- DropForeignKey
ALTER TABLE "Lists" DROP CONSTRAINT "Lists_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Lists" DROP CONSTRAINT "Lists_roomId_fkey";

-- AlterTable
ALTER TABLE "Gifts" DROP COLUMN "listId",
ADD COLUMN     "ownerId" UUID NOT NULL,
ADD COLUMN     "roomId" UUID NOT NULL;

-- DropTable
DROP TABLE "Lists";

-- AddForeignKey
ALTER TABLE "Gifts" ADD CONSTRAINT "Gifts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gifts" ADD CONSTRAINT "Gifts_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
