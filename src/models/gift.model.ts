import { DataTypes, Model, Optional } from "sequelize";
import connection from "../config/connection";

export type GiftAttributes = {
  id: string;
  giftUrl: string;
  price: number;
};

type GiftCreationAttributes = Optional<GiftAttributes, "id">;

class Gift extends Model<GiftAttributes, GiftCreationAttributes> {
  declare id: string;
  declare giftUrl: string;
  declare price: number;
}

Gift.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    giftUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize: connection,
    modelName: "Gift",
  },
);

export default Gift;
