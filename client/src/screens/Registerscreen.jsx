import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Success from "../components/Success";
import Loader from "../components/Loader";
import Error from "../components/Error";

function Registerscreen() {
  const [show, setShow] = useState(false);
  const [conf, setConf] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
    const [success, setSuccess] = useState();

  async function register() {
    if ([name, email, password, confirmpassword].some((e) => !e)) {
      alert("Cant accept empty fields");
      return;
    }
    if (password === confirmpassword) {
      const user = {
        name,
        email,
        password,
        confirmpassword,
      };
      console.log(user);

      try {
        setLoading(true)
        const result = (await axios.post("/api/users/register", user)).data;
        console.log(result);
        setLoading(false)
        setSuccess(true)

        setName("");
        setEmail("");
        setPassword("");
        setConfirmpassword("");
      } catch (e) {
        console.log(e);
        setLoading(false)
        setError(true)
      }
    } else {
      alert("passwords do not match");
    }
  }
  return (
    <div>
        {loading && <Loader />}
        {error && <Error />}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
            {success && <Success message={"Registered successfully"} />}
          <div className="bs">
            <h1 className="text-center register">Register</h1>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              <input
                type={conf ? "text" : "password"}
                className="form-control"
                placeholder="ConfirmPassword"
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
              <button className="p-btn" onClick={() => setConf(!conf)}>
                {" "}
                {conf ? "hide" : "Show"} Password{" "}
              </button>
            </div>
            <div className="">
              Already have an account: -{" "}
              <span>
                {" "}
                <Link className="link" to={`/login`}>
                  {" "}
                  Login{" "}
                </Link>{" "}
              </span>
            </div>
          </div>
          <button className=" p-btn btn btn-primary " onClick={register}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Registerscreen;
