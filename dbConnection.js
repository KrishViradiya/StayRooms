const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });

let connection = mongoose.connection;

connection.on("error", console.error.bind(console, "connection error:"));
connection.on("connected", () => {
  console.log("Database connected successfully 🚀");
});

module.exports = mongoose;
