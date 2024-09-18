import { DataTypes, Model } from "sequelize";
import connection from "../config/connection";
import Room from "./room.model";
import User from "./user.model";

export interface RoomUserAttributes {
  roomId: string;
  userId: string;
}

export class RoomUser
  extends Model<RoomUserAttributes>
  implements RoomUserAttributes
{
  public roomId!: string;
  public userId!: string;
}

RoomUser.init(
  {
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Room,
        key: "id",
      },
      field: "roomId",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      field: "userId",
    },
  },
  {
    sequelize: connection,
    modelName: "RoomUser",
    tableName: "RoomUsers",
    timestamps: false,
  },
);

export default RoomUser;
