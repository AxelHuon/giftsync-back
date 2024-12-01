/*
  Warnings:

  - A unique constraint covering the columns `[emailToAccept]` on the table `inviteTokenRooms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Gifts" DROP CONSTRAINT "Gifts_listId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "inviteTokenRooms_emailToAccept_key" ON "inviteTokenRooms"("emailToAccept");

-- AddForeignKey
ALTER TABLE "Gifts" ADD CONSTRAINT "Gifts_listId_fkey" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
