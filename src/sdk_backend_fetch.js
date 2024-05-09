const baseURL = "https://backenddummy2-rodschulzs-projects.vercel.app";
// "https://backenddummy-rodalschulz-rodschulzs-projects.vercel.app";
// "http://localhost:3000";
const version = "v1";

export const getUsernameData = async () => {
  const response = await fetch(`${baseURL}/`);
  const json = await response.json();
  return json.usernames;
};

export const getMembersData = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Optionally, set other headers
    };

    const response = await fetch(`${baseURL}/${version}/members`, {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch members data");
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching members data:", error);
    throw error;
  }
};

export const registerUser = async (email, username, password) => {
  const response = await fetch(`${baseURL}/${version}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });
  const json = await response.json();
  return json.user;
};

export const loginUser = async (username, password) => {
  const response = await fetch(`${baseURL}/${version}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const json = await response.json();
  console.log(json);
  return json;
};

// const dt = await getUsernameData();
// console.log(dt);

// const userRegister = await registerUser(
//   "fromsdktest2@test.com",
//   "sdktest2",
//   "sdktest2"
// );
