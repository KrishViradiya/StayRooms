const express = require("express");

const app = express();
app.use(express.json());

const dbConfig = require("./dbConnection.js");
const roomsRoute = require("./routes/roomsRoutes.js");
const usersRoute = require("./routes/usersRoutes.js");
const bookingsRoute = require("./routes/bookingsRoutes.js");
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT} 🔥`));
