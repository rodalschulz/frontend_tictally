import * as SDK from "../sdk_backend_fetch.js";

import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const Members = () => {
  // GETTING ALL MEMBERS USERNAMES AND EMAILS
  const [membersData, setMembersData] = useState([]);
  const fetchMembersData = useCallback(async () => {
    try {
      const membersData = await SDK.getMembersData();
      setMembersData(membersData.members);
      console.log(membersData.members);
    } catch (error) {
      console.error(error);
    }
  }, [setMembersData]);
  useEffect(() => {
    fetchMembersData();
  }, [fetchMembersData]);

  return (
    <div>
      <button>
        <Link to="/">Home</Link>
      </button>
      <h1>Members Area</h1>
      <p>Welcome to the members page!</p>
      <table>
        <thead>
          <tr>
            <th>Usernames</th>
            <th>Emails</th>
          </tr>
        </thead>
        <tbody>
          {membersData.map((member, index) => (
            <tr key={index}>
              <td>{member.username}</td>
              <td>{member.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Members;
