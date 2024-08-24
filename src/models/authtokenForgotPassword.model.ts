import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/connection";
import User from "./user.model";

export interface AuthTokenForgotPasswordAttributes {
  id?: string;
  user: string;
  token: string;
  expiryDate: Date;
}

// Optional fields for creation
interface AuthTokenForgotPasswordCreationAttributes
  extends Optional<AuthTokenForgotPasswordAttributes, "id"> {}

export class AuthTokenForgotPassword
  extends Model<
    AuthTokenForgotPasswordAttributes,
    AuthTokenForgotPasswordCreationAttributes
  >
  implements AuthTokenForgotPasswordAttributes
{
  declare id: string;
  declare user: string;
  declare token: string;
  declare expiryDate: Date;

  static associate(models: any) {
    AuthTokenForgotPassword.belongsTo(models.User, {
      foreignKey: "user",
      as: "user_id",
    });
  }
  static createForgotPasswordToken = async (user: User): Promise<string> => {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + parseInt("600"));
    let _token = uuidv4();
    let refreshToken = await AuthTokenForgotPassword.create({
      token: _token,
      user: user.id,
      expiryDate: expiredAt,
    });
    return refreshToken.dataValues.token;
  };

  static verifyAndDeleteExpiredTokenForgotPassword = async (
    token: AuthTokenForgotPassword,
  ): Promise<boolean> => {
    const isExpired =
      token.dataValues.expiryDate.getTime() < new Date().getTime();
    if (isExpired) {
      await AuthTokenForgotPassword.destroy({ where: { id: token.id } });
    }
    return isExpired;
  };
}

AuthTokenForgotPassword.init(
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

export default AuthTokenForgotPassword;
