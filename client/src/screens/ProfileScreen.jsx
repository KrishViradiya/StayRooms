import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import swal from "sweetalert2";

import { Tabs } from "antd";
import axios from "axios";

function ProfileScreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location = "/login";
    }
  }, []);

  return (
    <div className="ml-3 mt-3">
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Profile",
            key: "1",
            children: <MyProfile />,
          },
          {
            label: "Bookings",
            key: "2",
            children: <MyBookings />,
          },
        ]}
      />
    </div>
  );
}

export default ProfileScreen;

export function MyProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="">
      <h1>MyProfile</h1>
      <br />
      <h1>Name: {user.name}</h1>
      <h1>Email: {user.email}</h1>
      <h1>isAdmin: {user.isAdmin ? "YES" : "NO"}</h1>
    </div>
  );
}

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  console.log(user);
  const [bookings, setBookings] = useState([]);
  const bookingss = Object.values(bookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true);
        const bookings = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });
        setBookings(bookings.data);
        console.log(bookingss);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    }

    fetchdata();
  }, []);

  async function cancelBooking(bookingId, roomId) {
    try {
      setLoading(true);
      const response = await axios.post("/api/bookings/cancelbooking", {
        bookingId,
        roomId,
      });
      const result = response.data;
      // console.log(response.data);
      setLoading(false);
      swal.fire("congrats", "Your booking has been cancelled", "success").then(
        (result)=>{window.location.reload()}
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
      swal.fire("Error", "Error while cancelling booking", "error");
    }
  }

  return (
    <div className="row">
      <div className="col-md-6">
        {loading && <Loader />}
        {bookingss && // Optional conditional rendering
          bookingss.map((book) => {
            return (
              <div key={Math.random(2)} className="bs">
                <h3>{book.room}</h3>
                <p>
                  <b>BookingID: </b> {book._id}
                </p>
                <p>
                  <b>Checkin: </b> {book.checkin}
                </p>
                <p>
                  <b>Checkout: </b>
                  {book.checkout}
                </p>
                <p>
                  <b>TotalAmount: </b>
                  {book.totalAmount}
                </p>
                <p>
                  <b>Status: </b>
                  {book.status === "booked" ? "CONFIRMED" : "CANCELLED"}
                </p>
                {book.status != 'cancelled' && <div className="text-right">
                  <button
                    onClick={() => {
                      cancelBooking(book._id, book.roomid);
                    }}
                    className="btn btn-primary "
                  >
                    Cancel Booking
                  </button>
                </div>}
              </div>
            );
          })}
      </div>
    </div>
  );
}
