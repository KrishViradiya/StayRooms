import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

function Loginscreen() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    if ([email, password].some((e) => !e)) {
      alert("Cant accept empty fields");
      return;
    }

    const user = {
      email,
      password,
    };
    console.log(user);

    try {
      setLoading(true);
      const result = (await axios.post("/api/users/login", user)).data;
      console.log(result);
      setLoading(false);

      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "/home";

      setEmail("");
      setPassword("");
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError(true);
    }
  }
  return (
    <div>
      {loading && <Loader />}
      {error && <Error />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          <div className="bs">
            <h1 className="text-center register">Login</h1>

            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="p-btn" onClick={() => setShow(!show)}>
                {" "}
                {show ? "hide" : "Show"} Password{" "}
              </button>
            </div>
            <div className="">
              Don't have an account: -{" "}
              <span>
                {" "}
                <Link className="link" to={`/register`}>
                  {" "}
                  Register{" "}
                </Link>{" "}
              </span>
            </div>
          </div>
          <button className=" p-btn btn btn-primary " onClick={login}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Loginscreen;
