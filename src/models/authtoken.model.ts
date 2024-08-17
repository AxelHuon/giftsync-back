import { DataTypes, Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/connection";
import User from "./user.model";

export interface AuthTokenAttributes {
  id?: string;
  user: string;
  token: string;
  expiryDate: Date;
}

export class AuthtokenModel
  extends Model<AuthTokenAttributes>
  implements AuthTokenAttributes
{
  public user!: string;
  public id!: string;
  public token!: string;
  public expiryDate!: Date;

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
    return refreshToken.token;
  };

  static verifyExpiration = (token: AuthtokenModel): boolean => {
    return token.expiryDate.getTime() < new Date().getTime();
  };
}

AuthtokenModel.init(
  {
    user: DataTypes.UUID,
    token: DataTypes.STRING,
    expiryDate: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "authToken",
  },
);

export default AuthtokenModel;
