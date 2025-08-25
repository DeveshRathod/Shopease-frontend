import React, { useState } from "react";
import Authwrapper from "../components/Authwrapper";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducers/user.slice";
import Message from "../components/Message";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFirstChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastChange = (event) => {
    setLastName(event.target.value);
  };

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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          birthday: dob,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
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
      dispatch(setUser(data.currentUser));

      setFirstName("");
      setLastName("");
      setEmail("");
      setDob("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
      setSuccess("Signup successful! Redirecting to home page...");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError("Cannot sign up. Please try again.");
      console.error(error.message);
    }
  };

  return (
    <Authwrapper>
      <div className="flex items-center flex-col gap-6">
        <h1 className="font-semibold text-3xl text-black">Sign Up</h1>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col gap-4"
        >
          <div className="relative">
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={handleFirstChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="First Name"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={handleLastChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Last Name"
            />
          </div>
          <div className="relative">
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={`w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner ${
                dob === "" ? "text-gray-500" : "text-gray-900"
              }`}
            />
          </div>

          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={`w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner ${
              gender === "" ? "text-gray-500" : "text-gray-900"
            }`}
          >
            <option value="" disabled hidden>
              Select Gender
            </option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>

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
          <div className="relative">
            <input
              type="password"
              id="confirmation"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Confirm Password"
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
            Sign Up
          </button>
          <p>
            Already have an account?{" "}
            <Link className="hover:underline" to="/signin">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Authwrapper>
  );
};

export default Signup;
