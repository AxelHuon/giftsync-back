import { DataTypes, Model, Optional } from "sequelize";
import slugify from "slugify";
import sequelize from "../config/database";
import User from "./user.model";

export interface RoomAttributes {
  id: string;
  title: string;
  ownerId: string;
  slug: string;
}

export interface RoomCreationAttributes
  extends Optional<RoomAttributes, "slug"> {}

export class Room
  extends Model<RoomAttributes, RoomCreationAttributes>
  implements RoomAttributes
{
  public id!: string;
  public title!: string;
  public ownerId!: string;
  public slug!: string;
  public addUser!: (user: User) => Promise<void>;
  static async generateUniqueSlug(title: string): Promise<string> {
    let slug = slugify(title, { lower: true });
    let uniqueSlug = slug;
    let count = 1;

    while (await Room.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${count++}`;
    }

    return uniqueSlug;
  }
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Room",
    hooks: {
      beforeValidate: async (room: Room) => {
        if (!room.slug) {
          room.slug = await Room.generateUniqueSlug(room.title);
        }
      },
      beforeCreate: async (room: Room) => {
        room.slug = await Room.generateUniqueSlug(room.title);
      },
      beforeUpdate: async (room: Room) => {
        if (room.changed("title")) {
          room.slug = await Room.generateUniqueSlug(room.title);
        }
      },
    },
  },
);

export default Room;
