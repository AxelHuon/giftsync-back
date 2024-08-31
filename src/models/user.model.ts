import {DataTypes, HasManyGetAssociationsMixin, Model, Optional,} from "sequelize";
import {v4 as uuidv4} from "uuid";
import connection from "../config/connection";
import Room from "./room.model";

export type UserAttributes = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: string;
  birthDay?: string;
  updatedAt?: string;
};
type UserCreationAttributes = Optional<UserAttributes, "id">;


class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare createdAt?: string;
  declare birthDay?: string;
  declare updatedAt?: string;
  declare getRooms: HasManyGetAssociationsMixin<Room[]>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthDay: DataTypes.DATE,
  },
  {
    sequelize: connection,
    modelName: "User",
    hooks: {
      beforeCreate: async (user: User) => {
        if (!user.id) {
          user.id = uuidv4();
        }
      },
    },
  },
);

export default User;
