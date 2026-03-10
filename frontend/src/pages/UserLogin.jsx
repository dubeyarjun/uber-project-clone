import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [userData, setUserData] = useState({});
  const submitHandler = (e) => {
    e.preventDefault();
    // Handle login logic here
    setUserData({
      email: email,
      password: password,
    });

    setemail("");
    setpassword("");
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
          <h3 className="text-lg font-medium mb-2">What's your email?</h3>
          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
            type="email"
            placeholder="Email"
            className="bg-[#eeeeee] border rounded px-4 py-2 w-full mb-7 text-lg placeholder:text-base"
          />
          <h3 className="text-lg font-medium mb-2">Enter your password</h3>
          <input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
            className="bg-[#eeeeee] border rounded px-4 py-2 w-full mb-7 text-lg placeholder:text-base"
          />
          <button
            type="submit"
            className="bg-[#111] text-white mb-5 py-2 text-lg font-semibold rounded w-full placeholder:text-base"
          >
            Login
          </button>
          <p className="text-center ">
            New here?
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create new Account
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to="/captain-login"
          className="bg-[#218112] flex items-center justify-center text-white mb-7 py-2 text-lg font-semibold rounded w-full placeholder:text-base"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
