/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `authTokenForgotPasswords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `authTokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `inviteTokenRooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "authTokenForgotPasswords_token_key" ON "authTokenForgotPasswords"("token");

-- CreateIndex
CREATE UNIQUE INDEX "authTokens_token_key" ON "authTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "inviteTokenRooms_token_key" ON "inviteTokenRooms"("token");
