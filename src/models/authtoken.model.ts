import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/connection";
import User from "./user.model";

export interface AuthTokenAttributes {
  id?: string;
  user: string;
  token: string;
  expiryDate: Date;
}

// Optional fields for creation
interface AuthTokenCreationAttributes
  extends Optional<AuthTokenAttributes, "id"> {}

export class AuthtokenModel
  extends Model<AuthTokenAttributes, AuthTokenCreationAttributes>
  implements AuthTokenAttributes
{
  declare id: string;
  declare user: string;
  declare token: string;
  declare expiryDate: Date;

  static associate(models: any) {
    AuthtokenModel.belongsTo(models.User, {
      foreignKey: "user",
      as: "user_id",
    });
  }

  static createToken = async (user: User): Promise<string> => {
    let expiredAt = new Date();
    expiredAt.setSeconds(
      expiredAt.getSeconds() +
        parseInt(process.env.JWT_REFRESH_EXPIRATION || "0"),
    );
    let _token = uuidv4();
    let refreshToken = await AuthtokenModel.create({
      token: _token,
      user: user.id,
      expiryDate: expiredAt,
    });
    return refreshToken.dataValues.token;
  };

  static createTokenForgotPassword = async (user: User): Promise<string> => {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + parseInt("600"));
    let _token = uuidv4();
    let tokRequestForgotPassword = await AuthtokenModel.create({
      token: _token,
      user: user.id,
      expiryDate: expiredAt,
    });
    return tokRequestForgotPassword.dataValues.token;
  };

  static verifyAndDeleteExpiredToken = async (
    token: AuthtokenModel,
  ): Promise<boolean> => {
    const isExpired =
      token.dataValues.expiryDate.getTime() < new Date().getTime();
    if (isExpired) {
      await AuthtokenModel.destroy({ where: { id: token.id } });
    }

    return isExpired;
  };
}

AuthtokenModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
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
    modelName: "authToken",
  },
);

export default AuthtokenModel;
