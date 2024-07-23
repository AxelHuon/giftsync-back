import { DataTypes, Model, Optional } from "sequelize";
import connection from "../config/connection";

export type ListAttributes = {
  id: string;
  name: string;
  ownerId: string;
  roomId: string;
};

type ListCreationAttributes = Optional<ListAttributes, "id">;

class List extends Model<ListAttributes, ListCreationAttributes> {
  declare id: string;
  declare name: string;
  declare ownerId: string;
  declare roomId: string;
}

List.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: connection,
    modelName: "List",
  },
);

export default List;
