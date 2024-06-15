import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";

export interface RoomAttributes {
  id: string;
  title: string;
  ownerId: string;
}

export class Room extends Model<RoomAttributes> implements RoomAttributes {
  public id!: string;
  public title!: string;
  public ownerId!: string;
  public addUser!: (user: User) => Promise<void>;
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Room",
  },
);

export default Room;
