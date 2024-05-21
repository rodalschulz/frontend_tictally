import * as SDK from "../sdk_backend_fetch.js";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    username: "",
    password: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await SDK.registerUser(
        input.email,
        input.username,
        input.password
      );
      setInput({
        email: "",
        username: "",
        password: "",
      });
      alert(response.response);
      navigate("/login");
    } catch (error) {
      alert(
        "Something went wrong! The email or username could be already taken."
      );
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
          <Link to="/">
            <button className="px-4 py-2 text-sm font-medium text-gray-800">
              Home
            </button>
          </Link>
        </div>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={input.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={input.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={input.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white btn btn-primary rounded-md hover:bg-blue-700 focus:ring-blue-500 focus:border-blue-500"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
