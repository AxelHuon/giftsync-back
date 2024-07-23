import { DataTypes, Model } from "sequelize";
import connection from "../config/connection";
import Gift from "./gift.model";
import User from "./user.model";

export type GiftDonorAttributes = {
  giftId: string;
  userId: string;
  percentage: number;
};

class GiftDonor extends Model<GiftDonorAttributes> {
  declare giftId: string;
  declare giftUrl: string;
  declare percentage: number;
}

GiftDonor.init(
  {
    giftId: {
      type: DataTypes.STRING,
      references: {
        model: Gift,
        key: "id",
      },
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: "id",
      },
      primaryKey: true,
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize: connection,
    modelName: "GiftDonor",
  },
);

export default GiftDonor;
