import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState({});
  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
      email: email,
      password: password,
    });

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };
  return (
    <div className="p-7 flex flex-col  justify-between h-screen  ">
      <div>
        <img
          className="w-16 mb-10"
          src="https://www.pngall.com/wp-content/uploads/4/Uber-Logo-PNG-Free-Image.png"
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's your Name</h3>
          <div className="flex gap-4 mb-5">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              type="text"
              placeholder="First Name"
              className="bg-[#eeeeee] border rounded px-4 py-2 w-1/2  text-lg placeholder:text-base"
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              type="text"
              placeholder="Last Name"
              className="bg-[#eeeeee] border rounded px-4  w-1/2 py-2  text-lg placeholder:text-base"
            />
          </div>
          <h3 className="text-lg font-medium mb-2">What's your email?</h3>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Email"
            className="bg-[#eeeeee] border rounded px-4 py-2 w-full mb-5 text-lg placeholder:text-base"
          />
          <h3 className="text-lg font-medium mb-2">Enter your password</h3>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
            className="bg-[#eeeeee] border rounded px-4 py-2 w-full mb-5 text-lg placeholder:text-base"
          />
          <button
            type="submit"
            className="bg-[#111] text-white mb-5 py-2 text-lg font-semibold rounded w-full placeholder:text-base"
          >
            Login
          </button>
          <p className="text-center ">
            Already have a account?
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className="text-center text-[10px] leading-tight text-gray-500">
          This site is protected by reCAPTCHA and the Google
          <span className="text-blue-500 underline">Privacy Policy</span>
          and
          <span className="text-blue-500 underline">Terms of Service</span>
          apply.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
