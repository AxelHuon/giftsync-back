import Room from "./room.model";
import RoomUser from "./roomuser.model";
import User from "./user.model";

Room.belongsToMany(User, {
  through: RoomUser,
  foreignKey: "RoomId",
  as: "users",
});
User.belongsToMany(Room, {
  through: RoomUser,
  foreignKey: "UserId",
  as: "rooms",
});
