import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Room from "./room.model";
import User from "./user.model";

export interface RoomUserAttributes {
  RoomId: string;
  UserId: string;
}

export class RoomUser
  extends Model<RoomUserAttributes>
  implements RoomUserAttributes
{
  public RoomId!: string;
  public UserId!: string;
}

RoomUser.init(
  {
    RoomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Room, // Use the Room model
        key: "id",
      },
      field: "roomId", // Explicitly specify the column name
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User, // Use the User model
        key: "id",
      },
      field: "userId", // Explicitly specify the column name
    },
  },
  {
    sequelize,
    modelName: "RoomUser",
    tableName: "RoomUsers", // Explicitly specify the table name
    timestamps: false, // Disable timestamps if not needed
  },
);

export default RoomUser;
