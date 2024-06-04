import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import * as SDK from "../sdk_backend_fetch.js";

const PasswordReset = () => {
  const location = useLocation();
  const [input, setInput] = useState({
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
      const query = new URLSearchParams(location.search);
      const token = query.get("token");
      const response = await SDK.passwordReset(input.password, token);
      alert(response.response);
    } catch (error) {
      console.log("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Password Reset
          </h1>
        </div>
        <p className="text-center">
          Reset your password by entering a new one below
        </p>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            id="password"
            name="password"
            onChange={handleInputChange}
            className="border border-collapse border-gray-300 w-full p-2 mt-1 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          ></input>
          <br></br>
          <button className="w-full bg-primary rounded-md mt-5 text-white h-10">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
