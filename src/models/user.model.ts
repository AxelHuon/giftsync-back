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
  createdAt?: string;
  updatedAt?: string;
};
type UserCreationAttributes = Optional<UserAttributes, "id">;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password (hashed)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john.doe@example.com"
 *         password: "hashedpassword"
 *         createdAt: "2024-08-18T00:00:00.000Z"
 *         updatedAt: "2024-08-18T00:00:00.000Z"
 */
class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare createdAt?: string;
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
