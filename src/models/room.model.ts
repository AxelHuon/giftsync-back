import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";

export interface RoomAttributes {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomUserAttributes {
  roomId: string;
  userId: string;
}

export class RoomModel {
  static createRoom = async (
    title: string,
    ownerId: string,
  ): Promise<RoomAttributes> => {
    let slug = slugify(title, { lower: true });
    let uniqueSlug = slug;
    let count = 1;
    while (await prisma.rooms.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${count++}`;
    }

    const room = await prisma.rooms.create({
      data: {
        id: uuidv4(),
        title: title,
        slug: uniqueSlug,
        ownerId: ownerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    await prisma.roomUsers.create({
      data: {
        roomId: room.id,
        userId: ownerId,
      },
    });
    return room;
  };

  static putRoom = async (
    title: string,
    roomId: string,
  ): Promise<RoomAttributes> => {
    let slug = slugify(title, { lower: true });
    let uniqueSlug = slug;
    let count = 1;
    while (await prisma.rooms.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${count++}`;
    }
    const room = await prisma.rooms.update({
      where: { id: roomId },
      data: {
        title: title,
        slug: uniqueSlug,
        updatedAt: new Date().toISOString(),
      },
    });
    return room;
  };
}
