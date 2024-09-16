import React, { useEffect, useState } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import "antd/dist/reset.css";
import moment from "moment";
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;
function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [checkin, setCheckin] = useState();
  const [checkout, setCheckout] = useState();
  const [duplicaterooms, setduplicaterooms] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  let id = JSON.parse(localStorage.getItem("currentUser"))._id;
  console.log(id);

  useEffect(() => {
    async function getdata() {
      try {
        setLoading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        console.log(data.rooms);
        setRooms(data.rooms);
        setduplicaterooms(data.rooms);

        setLoading(false);
      } catch (error) {
        setError(true);
        console.log("error");
        setLoading(false);
      }
    }
    getdata();
  }, []);

  // function filterByDate(dates) {
  //   console.log(
  //     "DATES ----------------------> ",
  //     dates[0].format("DD-MM-YYYY")
  //   );

  //   const checkin = dates[0].format("DD-MM-YYYY");
  //   const checkout = dates[1].format("DD-MM-YYYY");
  //   console.log("Chekin -------------> ", checkin);
  //   console.log("Checkout -------------> ", checkout);
  //   console.log(checkin, checkout);
  //   setCheckin(checkin);
  //   setCheckout(checkout);

  //   const temprooms = [];

  //   for (const room of duplicaterooms) {
  //     let availability = true;

  //     if (room.currentbookings.length > 0) {
  //       for (const booking of room.currentbookings) {
  //         const bookingCheckin = moment(booking.checkin, "DD-MM-YYYY");
  //         const bookingCheckout = moment(booking.checkout, "DD-MM-YYYY");

  //         if (
  //           moment(checkin, "DD-MM-YYYY").isBetween(
  //             bookingCheckin,
  //             bookingCheckout,
  //             undefined,
  //             "[]"
  //           ) ||
  //           moment(checkout, "DD-MM-YYYY").isBetween(
  //             bookingCheckin,
  //             bookingCheckout,
  //             undefined,
  //             "[]"
  //           ) ||
  //           bookingCheckin.isBetween(
  //             moment(checkin, "DD-MM-YYYY"),
  //             moment(checkout, "DD-MM-YYYY"),
  //             undefined,
  //             "[]"
  //           ) ||
  //           bookingCheckout.isBetween(
  //             moment(checkin, "DD-MM-YYYY"),
  //             moment(checkout, "DD-MM-YYYY"),
  //             undefined,
  //             "[]"
  //           )
  //         ) {
  //           availability = false;
  //           break;
  //         }
  //       }
  //     }

  //     if (availability) {
  //       temprooms.push(room);
  //     }
  //   }

  //   setRooms(temprooms);
  //   console.log(temprooms);
  // }

  function filterByDate(dates) {
    console.log(
      "DATES ----------------------> ",
      dates[0].format("DD-MM-YYYY")
    );

    const checkin = dates[0].format("DD-MM-YYYY");
    const checkout = dates[1].format("DD-MM-YYYY");
    console.log("Check-in -------------> ", checkin);
    console.log("Check-out -------------> ", checkout);
    console.log(checkin, checkout);
    setCheckin(checkin);
    setCheckout(checkout);

    const temprooms = [];

    for (const room of duplicaterooms) {
      let availability = true;

      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          const bookingCheckin = moment(booking.checkin, "DD-MM-YYYY");
          const bookingCheckout = moment(booking.checkout, "DD-MM-YYYY");

          if (
            moment(checkin, "DD-MM-YYYY").isBetween(
              bookingCheckin,
              bookingCheckout,
              undefined,
              "[]"
            ) ||
            moment(checkout, "DD-MM-YYYY").isBetween(
              bookingCheckin,
              bookingCheckout,
              undefined,
              "[]"
            ) ||
            bookingCheckin.isBetween(
              moment(checkin, "DD-MM-YYYY"),
              moment(checkout, "DD-MM-YYYY"),
              undefined,
              "[]"
            ) ||
            bookingCheckout.isBetween(
              moment(checkin, "DD-MM-YYYY"),
              moment(checkout, "DD-MM-YYYY"),
              undefined,
              "[]"
            ) ||
            moment(checkin, "DD-MM-YYYY").isSame(bookingCheckin) ||
            moment(checkin, "DD-MM-YYYY").isSame(bookingCheckout) ||
            moment(checkout, "DD-MM-YYYY").isSame(bookingCheckin) ||
            moment(checkout, "DD-MM-YYYY").isSame(bookingCheckout)
          ) {
            availability = false;
            break;
          }
        }
      }

      if (availability) {
        temprooms.push(room);
      }
    }

    setRooms(temprooms);
    console.log(temprooms);
  }

  function filterSearch() {
    const temprooms = duplicaterooms.filter((room) =>
      room.name.toLowerCase().includes(search.toLowerCase())
    );
    setRooms(temprooms);
  }

  function filterByType(e) {
    setType(e);
    if (e != "all") {
      const selectedRooms = duplicaterooms.filter(
        (room) => room.type.toLowerCase() == e.toLowerCase()
      );
      console.log(selectedRooms);
      setRooms(selectedRooms);
    } else {
      setRooms(duplicaterooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3 is">
          <Space>
            <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
          </Space>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Rooms"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={filterSearch}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={type}
            onChange={(e) => filterByType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="deluxe">Deluxe</option>
            <option value="non-deluxe">Non-Deluxe</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1>
            {" "}
            <Loader />{" "}
          </h1>
        ) : (
          rooms.map((room) => {
            return (
              <div key={Math.random(0)} className="col-md-9 mt-2">
                <Room room={room} checkin={checkin} checkout={checkout} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Homescreen;
