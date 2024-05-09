const baseURL =
  // "https://backenddummy2-rodschulzs-projects.vercel.app";
  // "https://backenddummy-rodalschulz-rodschulzs-projects.vercel.app";
  "http://localhost:3000";
const version = "v1";
const apiKey = process.env.REACT_APP_API_KEY;
console.log(apiKey);

export const getUsernameData = async () => {
  const response = await fetch(`${baseURL}/`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
  });
  const json = await response.json();
  return json.usernames;
};

export const getMembersData = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": apiKey,
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
      "x-api-key": apiKey,
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
      "x-api-key": apiKey,
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
