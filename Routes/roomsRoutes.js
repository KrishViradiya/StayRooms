const express = require("express");
const router = express.Router();

const Room = require("../models/Rooms.js");

router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});

    return res.json({ rooms });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getroombyid", async (req, res) => {
  const { roomid } = req.body;
  try {
    const room = await Room.findOne({ _id: roomid });
    console.log("Roommmmmm: ------------------------", room);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.json({ room });
  } catch (error) {
    return res.status(400).json({ message: error.message }); // Return the error message
  }
});

router.post("/addRoom", async (req, res) => {
  try {
    const {
      roomName,
      rentPerDay,
      maxCount,
      description,
      phone,
      type,
      imageurls,
    } = req.body.newRoom;
    console.log(
      "Adding Room-------------------->",
      roomName,
      rentPerDay,
      maxCount,
      description,
      phone,
      type,
      imageurls
    );
    const newroom = new Room({
      name: roomName,
      rentperday: rentPerDay,
      maxcount: maxCount,
      description: description,
      phonenumber: phone,
      type: type,
      imageurls: imageurls,
    });
    newroom.save();
    res.json({ message: "Room added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/deleteroom", async (req, res) => {
  const { roomId } = req.body;
  try {
    const delRoom = await Room.deleteOne({ _id: roomId });
    Room.save();
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
