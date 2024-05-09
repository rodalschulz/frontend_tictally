import "../styles/v1home.css";
import * as SDK from "../sdk_backend_fetch.js";

import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // GETTING ALL USERS USERNAME DATA
  const [usernameData, setUsernameData] = useState([]);
  const fetchUsernameData = useCallback(async () => {
    try {
      const usernameData = await SDK.getUsernameData();
      setUsernameData(usernameData);
    } catch (error) {
      console.error(error);
    }
  }, [setUsernameData]);
  useEffect(() => {
    fetchUsernameData();
  }, [fetchUsernameData]);

  return (
    <div>
      <button>
        <Link to="/register">Register</Link>
      </button>
      <button>
        <Link to="/login">Login</Link>
      </button>
      <button>
        <Link to="/members">Members Area</Link>
      </button>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>

      <table>
        <thead>
          <tr>
            <th>Usernames</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {usernameData.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.role ?? null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
