import {
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Optional,
} from "sequelize";
import { v4 as uuidv4 } from "uuid";
import connection from "../config/connection";
import Room from "./room.model";

export type UserAttributes = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  createdAt?: string;
  profilePicture?: string;
  updatedAt?: string;
};
type UserCreationAttributes = Optional<UserAttributes, "id">;

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare dateOfBirth: Date;
  declare profilePicture?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
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
    profilePicture: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
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
