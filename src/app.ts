import express from "express";
import sequelize from "./config/database";
import Room from "./models/room.model";
import RoomUser from "./models/roomuser.model";
import User from "./models/user.model";
import apiRoutes from "./routes/index";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/api", apiRoutes);

app.listen(port, async () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("Database connected!");
    Room.belongsToMany(User, { through: RoomUser });
    User.belongsToMany(Room, { through: RoomUser });
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
