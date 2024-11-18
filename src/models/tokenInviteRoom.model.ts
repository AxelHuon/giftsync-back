import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/connection";
import Room from "./room.model";

export interface TokenInviteRoomAttributes {
  id?: string;
  room: string;
  token: string;
  expiryDate: Date;
  emailToAccept: string;
}

// Optional fields for creation
interface TokenInviteRoomCreationAttributes
  extends Optional<TokenInviteRoomAttributes, "id"> {}

export class TokenInviteRoomModel
  extends Model<TokenInviteRoomAttributes, TokenInviteRoomCreationAttributes>
  implements TokenInviteRoomAttributes
{
  declare id: string;
  declare room: string;
  declare token: string;
  declare expiryDate: Date;
  declare emailToAccept: string;

  static associate(models: any) {
    TokenInviteRoomModel.belongsTo(models.Room, {
      foreignKey: "room",
      as: "room_id",
    });
  }

  static createToken = async (room: Room, email: string): Promise<string> => {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + parseInt("7200"));
    let _token = uuidv4();
    let refreshToken = await TokenInviteRoomModel.create({
      token: _token,
      emailToAccept: email,
      room: room.id,
      expiryDate: expiredAt,
    });
    return refreshToken.dataValues.token;
  };

  static verifyAndDeleteExpiredToken = async (
    token: TokenInviteRoomModel,
  ): Promise<boolean> => {
    const isExpired =
      token.dataValues.expiryDate.getTime() < new Date().getTime();
    if (isExpired) {
      await TokenInviteRoomModel.destroy({ where: { id: token.id } });
    }
    return isExpired;
  };
}

TokenInviteRoomModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    room: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailToAccept: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "inviteTokenRoom",
  },
);

export default TokenInviteRoomModel;
