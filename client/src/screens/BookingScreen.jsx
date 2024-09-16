import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import StripeCheckout from "react-stripe-checkout";
import moment from "moment";
import Swal from "sweetalert2";

function BookingScreen() {
  const { roomid, checkin, checkout } = useParams();
  const checkedin = moment(checkin, "DD-MM-YYYY");
  const checkedout = moment(checkout, "DD-MM-YYYY");
  // console.log(roomid);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [room, setRoom] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const totalDays = moment.duration(checkedout.diff(checkedin)).asDays() + 1;

  useEffect(() => {
    async function fetchData() {

      if(!localStorage.getItem('currentUser')){
        window.location.href='/login';
      }

      try {
        setLoading(true);
        const res = await axios.post("/api/rooms/getroombyid", { roomid });
        console.log("Printing response", res);
        setRoom(res.data.room);
        setTotalAmount(res.data.room.rentperday * totalDays);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    }
    fetchData();
  }, []);
  //   console.log(room);
  //   console.log(roomid);

  let useriid = JSON.parse(localStorage.getItem("currentUser"))._id;
  console.log("this is user iddd", useriid);
  console.log(totalAmount, totalDays);

  async function onToken(token) {
    console.log(token);
    const bookingDetails = {
      room,
      roomid,
      userid: useriid,
      checkin,
      checkout,
      totalAmount,
      totalDays,
      token
    };

    try {
      setLoading(true);
      const result = axios.post("/api/bookings/bookroom", bookingDetails);
      console.log("on clicking the pay button", result);
      setLoading(false);
      Swal.fire("Congratulations", "Your Room Booked Successfully" ,'success').then(result => 
        window.location.href = '/bookings'
      )
    
    } catch (e) {
      console.log(e);
      setError(true);
      setLoading(false)
      Swal.fire("Error", "Something went wrong" ,'error')
    }
  }

  return (
    <div className="m-5">
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5  bs">
            <div className="col-md-5">
              <h1>{room.name}</h1>
              <img className="c-image " src={room.imageurls[0]} alt="" />
            </div>
            <div className="col-md-5">
              <div style={{ textAlign: "right" }}>
                <h1>Booking details</h1>
                <hr style={{ marginLeft: "30px" }} />
                <p>
                  Name:{JSON.parse(localStorage.getItem("currentUser")).name}{" "}
                </p>
                <p>Check in: {checkin}</p>
                <p>Check out: {checkout}</p>
                <p>Max count: {room.maxcount}</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <h1>Amount</h1>
                <hr style={{ marginLeft: "30px" }} />
                <p>Total days: {totalDays}</p>
                <p>Rent per day: {room.rentperday}</p>
                <p>Total Amount: {room.rentperday * totalDays}</p>
              </div>
              <div style={{ float: "right" }}>
                <StripeCheckout
                  currency="INR"
                  amount={room.rentperday * totalDays * 100}
                  token={onToken}
                  stripeKey="pk_test_51Pg5JfE3RraivQxOWgdniMBivt0SA3b4NzcmamhJRo3tlRnTUbg6a8AE0eDSwfLQeM3aehtOjkUUkcnt61Of26Zp00CK14O4ob"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>
          <Error />
        </h1>
      )}
    </div>
  );
}

export default BookingScreen;
