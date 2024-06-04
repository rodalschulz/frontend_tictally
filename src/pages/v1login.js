import * as SDK from "../sdk_backend_fetch.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setInput({
        ...input,
        username: username,
      });
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const user = await SDK.loginUser(input.username, input.password);

      if (user.token) {
        if (rememberMe) {
          localStorage.setItem("username", input.username);
          console.log(input.username);
        }
        localStorage.setItem("token", user.token);
        onLogin(user.id);
        navigate(`/members/${user.id}/tally`);
        setInput({
          username: "",
          password: "",
        });
      } else {
        alert(user.response);
        console.log("Something went wrong!");
        setInput({
          username: "",
          password: "",
        });
      }
    } catch (error) {
      console.error(error);
      setInput({
        username: "",
        password: "",
      });
    }
  };

  const passwordRecoveryHandler = () => {
    navigate("/password-recovery");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Sign In
          </h1>
        </div>
        <form onSubmit={submitHandler} className="space-y-6">
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
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="remember" className="text-gray-500">
                  Remember me
                </label>
              </div>
            </div>
            <div
              className="ml-3 text-sm text-gray-500"
              onClick={passwordRecoveryHandler}
            >
              Forgot your password?
            </div>
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-full">
              Sign In
            </button>
          </div>
        </form>
        <p className="text-sm font-light text-gray-500">
          Don’t have an account yet?{" "}
          <a
            href="/register"
            className="font-medium text-primary-600 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
