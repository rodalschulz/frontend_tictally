import * as SDK from "../sdk_backend_fetch.js";

import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState({
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
      const user = await SDK.loginUser(input.username, input.password);
      setInput({
        username: "",
        password: "",
      });
      console.log(user);
      if (user) {
        localStorage.setItem("token", user.token);
      } else {
        console.log("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button>
        <Link to="/">Home</Link>
      </button>
      <h1>Login</h1>
      <p>Welcome to the login page!</p>
      <form onSubmit={submitHandler}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
