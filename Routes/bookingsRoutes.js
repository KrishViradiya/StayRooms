const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings");
const Room = require("../models/Rooms");
const moment = require("moment");
const stripe = require("stripe")(
 process.env.STRIPE_KEY
);
const { v4: uuidv4 } = require("uuid");


router.post("/bookroom", async (req, res) => {
  const { room, userid, checkin, checkout, totalAmount, totalDays, token } =
    req.body;
  console.log(checkin);

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      try {
        const newBooking = new Booking({
          room: room.name,
          roomid: room._id,
          userid,
          checkin,
          checkout,
          totalAmount,
          totalDays,
          transactionid: "1234",
        });

        const booking = await newBooking.save();
        console.log("Reaching hereeereer ..................................");
        console.log(booking);

        console.log("-------------------------------------------");
        const temproom = await Room.findOne({ _id: room._id });

        temproom.currentbookings.push({
          bookingid: booking._id,
          checkin,
          checkout,
          userid,
          status: booking.status,
        });

        await temproom.save();

        res.send("Room Booked Successfully");
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error while booking roon.." });
      }
    }

    res.send("Payment Successfull, Your room is booked.");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;
  try {
    const booking = await Booking.find({ userid });
    console.log("This is the bokking ----------------------------", booking);
    res.send(booking);
  } catch (error) {
    return res.status(400).res({ message: error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingId, roomId } = req.body;
  console.log(bookingId,roomId);
  const booking = await Booking.findOne({ _id: bookingId });
  booking.status = "cancelled";
  await booking.save();

  
  
  const room = await Room.findOne({ _id: roomId });
  console.log("Room--------------------->", room);
  const temp = room.currentbookings.filter(room => room.bookingid.toString() != bookingId);
  room.currentbookings = temp;
  
  await room.save();
  const del = await Booking.deleteOne({_id:bookingId});
  // await del.save();

  res.send("Booking Cancelled Successfully");
  try {
  } catch (error) {
    res.status(400).res({ message: error });
  }
});


router.get("/getAllBookings", async (req,res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings)
  } catch (error) {
    res.status(400).res({message:error})
  }
})

module.exports = router;
