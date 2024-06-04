import { useState } from "react";
import * as SDK from "../sdk_backend_fetch.js";

const PasswordRecovery = () => {
  const [input, setInput] = useState({
    email: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    try {
      const response = SDK.passwordRecoveryEmail(input.email);
      if (!response) {
        alert("The email address provided doesn't match any account.");
        return;
      }

      alert(response.response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center m-10">
      <div className="w-60">
        <h1 className="mb-2 text-center text-lg font-bold">
          Password Recovery
        </h1>
        <p className="mb-5">
          Please enter your account's email below and we will send you a
          password recovery form
        </p>
        <form onSubmit={submitHandler}>
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
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mt-2">
            <button type="submit" className="btn btn-primary w-full">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecovery;
