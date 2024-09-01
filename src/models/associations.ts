import Gift from "./gift.model";
import GiftDonor from "./giftdonor.model";
import List from "./list.model";
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

User.belongsToMany(Gift, {
  through: GiftDonor,
  foreignKey: "userId",
  as: "donatedGifts",
});

List.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
List.belongsTo(Room, { foreignKey: "roomId", as: "room" });

Gift.belongsTo(List, { foreignKey: "listId", as: "list" });
Gift.belongsToMany(User, {
  through: GiftDonor,
  foreignKey: "giftId",
  as: "donors",
});
