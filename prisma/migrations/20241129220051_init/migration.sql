-- CreateTable
CREATE TABLE "GiftDonors" (
    "giftId" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "GiftDonors_pkey" PRIMARY KEY ("giftId","userId")
);

-- CreateTable
CREATE TABLE "Gifts" (
    "id" VARCHAR(255) NOT NULL,
    "giftUrl" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "listId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lists" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "ownerId" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomUsers" (
    "roomId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "RoomUsers_pkey" PRIMARY KEY ("roomId","userId")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRooms" (
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "UserId" UUID NOT NULL,
    "RoomId" UUID NOT NULL,

    CONSTRAINT "UserRooms_pkey" PRIMARY KEY ("UserId","RoomId")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "profilePicture" VARCHAR(255),
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "dateOfBirth" DATE,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authTokenForgotPasswords" (
    "id" UUID NOT NULL,
    "user" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiryDate" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "authTokenForgotPasswords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authTokens" (
    "id" UUID NOT NULL,
    "user" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiryDate" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "authTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inviteTokenRooms" (
    "id" UUID NOT NULL,
    "room" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "emailToAccept" VARCHAR(255) NOT NULL,
    "expiryDate" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "inviteTokenRooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_slug_key" ON "Rooms"("slug");

-- AddForeignKey
ALTER TABLE "GiftDonors" ADD CONSTRAINT "GiftDonors_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftDonors" ADD CONSTRAINT "GiftDonors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gifts" ADD CONSTRAINT "Gifts_listId_fkey" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lists" ADD CONSTRAINT "Lists_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lists" ADD CONSTRAINT "Lists_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
