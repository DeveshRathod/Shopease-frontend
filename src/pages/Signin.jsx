import React, { useState } from "react";
import Authwrapper from "../components/Authwrapper";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducers/user.slice";
import Message from "../components/Message";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Something went wrong");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      const user = JSON.stringify(data.currentUser);
      localStorage.setItem("currentUser", user);
      setEmail("");
      setPassword("");
      dispatch(setUser(data.currentUser));

      setSuccess("Signin successful! Redirecting to home page...");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError("Cannot sign in. Please try again.");
      console.error(error.message);
    }
  };

  return (
    <Authwrapper>
      <div className="flex items-center flex-col gap-6">
        <h1 className="font-semibold text-3xl text-black">Sign In</h1>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col gap-4"
        >
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Password"
            />
          </div>
          {error && (
            <Message
              message={error}
              setShowModal={setError}
              showModel={error}
              isError={true}
            />
          )}
          {success && (
            <Message
              message={success}
              setShowModal={setSuccess}
              showModel={success}
              isError={false}
            />
          )}
          <button
            type="submit"
            className="bg-black text-white w-full p-3 border border-black hover:border-black rounded-md  hover:bg-white hover:text-black transition duration-300 ease-in-out "
          >
            Sign In
          </button>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Authwrapper>
  );
};

export default Signin;
