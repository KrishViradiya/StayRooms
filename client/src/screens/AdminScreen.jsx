import { Tabs } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const items = [
  {
    key: "1",
    label: "Bookings",
    children: <Bookings />,
  },
  {
    key: "2",
    label: "Rooms",
    children: <Rooms />,
  },
  {
    key: "3",
    label: "Add Room",
    children: <AddRoom />,
  },
  {
    key: "4",
    label: "Users",
    children: <Users />,
  },
];

function AdminScreen() {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className="mt-3 ml-3 mr-3 bs">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default AdminScreen;

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  async function getAllBookings() {
    try {
      setLoading(true);
      const data = await axios.get("/api/bookings/getAllBookings");
      console.log(data.data);
      setBookings(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  }

  useEffect(() => {
    getAllBookings();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Bookings</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="thead-dark bs">
            <tr>
              <th>Booking Id</th>
              <th>User Id</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{booking.userid}</td>
                  <td>{booking.room}</td>
                  <td>{booking.checkin}</td>
                  <td>{booking.checkout}</td>
                  <td>{booking.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No bookings available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {bookings.length >= 0 && (
          <h1> There are total {bookings.length} bookings. </h1>
        )}
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  async function fetchRooms() {
    try {
      setLoading(true);
      const data = await axios.get("/api/rooms/getallrooms");
      console.log("hererereeeeeeer", data.data);
      console.log(typeof data.data.rooms);
      setRooms(data.data.rooms);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  }

  async function deleteRoom(roomId) {
      try {
        setLoading(true);
        const data = await axios.post("/api/rooms/deleteroom", {roomId} );
        console.log("Room deleted successfully", data);
        fetchRooms();
        setLoading(false);
      } catch (error) {
        console.log("Error while deleting Room", error.message);
        setLoading(false);
        setError(error.message)

      }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Rooms</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="thead-dark bs">
            <tr>
              <th>Room Id</th>
              <th>Room Name</th>
              <th>Room description</th>
              <th>Phone Number</th>
              <th>Rent per day</th>
              <th>Capacity</th>
              <th>Room Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room._id}</td>
                  <td>{room.name}</td>
                  <td>{room.description}</td>
                  <td>{room.phonenumber}</td>
                  <td>{room.rentperday}</td>
                  <td>{room.maxcount}</td>
                  <td>{room.type}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => deleteRoom(room._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No rooms available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {rooms.length >= 0 && <h1> There are total {rooms.length} rooms. </h1>}
      </div>
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await axios.get("/api/users/getAllUsers");
      console.log("users data-----------------", data.data);

      setUsers(data.data);
      setLoading(false);
    } catch (error) {
      console.log("Error is fetching users", error);
      setLoading(false);
      setError(error);
    }
  }

  async function deleteUser(userId) {
    try {
      setLoading(true);
      await axios.post("/api/users/deleteUser", { userId });
      fetchUsers();
      // console.log("User deleted successfully", data);
      setLoading(false);
    } catch (error) {
      console.log("Error while deleting the user");
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Users</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="thead-dark bs">
            <tr>
              <th>User Id</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Is Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.isAdmin ? "YES" : "NO"}</td>
                  <td>
                    {!user.isAdmin ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {users.length >= 0 && <h1> There are total {users.length} users. </h1>}
      </div>
    </div>
  );
}

// Add Room

export function AddRoom() {
  const [roomName, setRoomName] = useState("");
  const [rentPerDay, setRentPerDay] = useState("");
  const [maxCount, setMaxCount] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const[loading,setLoading] = useState(false);
  const [error,setError]= useState();

  async function addRoom() {

    const newRoom = {
      roomName,
      rentPerDay,
      maxCount,
      description,
      phone,
      type,
      imageurls: [image1, image2, image3],
    };
    

    try {
      setLoading(true);
      const data = await axios.post("/api/rooms/addRoom",{newRoom});
      const result = data.data;
      console.log(result);
      setLoading(false);
      
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      setLoading(false);
    }
    finally{
      setRoomName("");
      setRentPerDay("");
      setMaxCount("");
      setDescription("");
      setPhone("");
      setType("");
      setImage1("");
      setImage2("");
      setImage3("");
    }
  }

  return (
    <div className="row">
      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Rent per day"
          value={rentPerDay}
          onChange={(e) => setRentPerDay(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Max count"
          value={maxCount}
          onChange={(e) => setMaxCount(e.target.value)}
        />
        <input type="text" className="form-control" placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="col-md-5">
        <input type="text" className="form-control" placeholder="Type" 
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input type="text" className="form-control" placeholder="Iamge Url-1" 
          value={image1}
          onChange={(e) => setImage1(e.target.value)}
        />
        <input type="text" className="form-control" placeholder="Image Url-2"
          value={image2}
          onChange={(e) => setImage2(e.target.value)}
        />
        <input type="text" className="form-control" placeholder="Image Url-3"
          value={image3}
          onChange={(e) => setImage3(e.target.value)}
        />

        <div className="text-right">
          <button className="btn btn-primary mt-2" onClick={addRoom}>Add Room</button>
        </div>
      </div>
    </div>
  );
}
