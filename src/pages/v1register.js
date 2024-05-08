import * as SDK from "../sdk_backend_fetch.js";

import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
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
      await SDK.registerUser(input.email, input.username, input.password);
      setInput({
        email: "",
        username: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button>
        <Link to="/">Home</Link>
      </button>
      <h1>Register</h1>
      <p>Welcome to the register page!</p>
      <form onSubmit={submitHandler}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={input.email}
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={input.username}
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={input.password}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
