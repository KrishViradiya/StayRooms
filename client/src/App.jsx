import React from "react";
import Navbar from "./components/Navbar";
import { Route, Link, Routes } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import BookingScreen from "./screens/BookingScreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminScreen from "./screens/AdminScreen";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/home" element={<Homescreen />} />
        <Route path="/book/:roomid/:checkin/:checkout" element={<BookingScreen />} />
        <Route path="/register" element={<Registerscreen />} />
        <Route path="/login" element={<Loginscreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Routes>
    </>
  );
}

export default App;
