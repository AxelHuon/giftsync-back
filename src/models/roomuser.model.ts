import { DataTypes, Model } from "sequelize";
import connection from "../config/connection";
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
        model: Room,
        key: "id",
      },
      field: "roomId",
    },
    UserId: {
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
